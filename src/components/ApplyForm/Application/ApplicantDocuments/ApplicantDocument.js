import React, { Component } from 'react';
import CircularProgressLoading from 'material-ui/CircularProgressLoading';

import './ApplicantDocument.css';
import './Circular.css';

import { GET_DOCUMENTS_AND_TEMPLATES } from '../../Queries';
import { REMOVE_APPLICANT_DOCUMENT, ADD_APPLICANT_DOCUMENT, UPDATE_APPLICANT_DOCUMENT } from '../../Mutations';
import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';
import withApollo from 'react-apollo/withApollo';
import withGlobalContent from '../../../Generic/Global';
import ConfirmDialog from 'material-ui/ConfirmDialog';
import DocumentInputFileCard from './DocumentInputFileCard';
import PropTypes from 'prop-types';

const applyTabs = require(`../languagesJSON/${localStorage.getItem('languageForm')}/applyTabs`);
const spanishActions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);
const dialogMessages = require(`../languagesJSON/${localStorage.getItem('languageForm')}/dialogMessages`);

class ApplicantDocument extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			progress: 0,
			uploading: false,
			fileURL: null,
			fileName: null,
			openConfirm: false,
			errorMessage: null
		};
	}

	getTemplateDocuments = () => {
		this.setState(
			{
				loading: true,
				errorMessage: null
			},
			() => {
				this.props.client
					.query({
						query: GET_DOCUMENTS_AND_TEMPLATES,
						variables: {
							applicationId: this.props.applicationId
						},
						fetchPolicy: 'no-cache'
					})
					.then(({ data }) => {
						this.setState({
							templates: data.getcatalogitem,
							documents: data.applicantDocument,
							loading: false
						});
					})
					.catch((error) => {
						this.setState({
							loading: false,
							errorMessage: error
						});
						this.props.handleOpenSnackbar(
							'error',
							'Error to show document list. Please, try again!',
							'bottom',
							'right'
						);
					});
			}
		);
	};
	removeDocument = (id) => {
		this.setState({ removing: true });
		this.props.client
			.mutate({
				mutation: REMOVE_APPLICANT_DOCUMENT,
				variables: {
					id: id
				}
			})
			.then(({ data }) => {
				this.setState({ openConfirm: false, removing: false });
				this.props.handleOpenSnackbar('success', 'Successfully removed', 'bottom', 'right');
				this.getTemplateDocuments();
			})
			.catch((error) => {
				this.setState({ removing: false });
				this.props.handleOpenSnackbar(
					'error',
					'Error to remove this document. Please, try again!',
					'bottom',
					'right'
				);
			});
	};
	addDocument = (url, fileName, typeId, fileExtension) => {
		this.setState({ loading: true });
		this.props.client
			.mutate({
				mutation: ADD_APPLICANT_DOCUMENT,
				variables: {
					documents: {
						url: url,
						fileName: fileName,
						fileExtension: fileExtension,
						CatalogItemId: typeId,
						ApplicationId: this.props.applicationId
					}
				}
			})
			.then(() => {
				this.props.handleOpenSnackbar('success', 'Successfully created', 'bottom', 'right');
				this.getTemplateDocuments();
			})
			.catch((error) => {
				// Replace this alert with a Snackbar message error
				this.props.handleOpenSnackbar('error', 'Error to save document. Please, try again!', 'bottom', 'right');

				this.setState({
					loading: false
				});
			});
	};

	updateDocument = (document) => {
		return new Promise((resolve, reject) => {
			this.props.client
				.mutate({
					mutation: UPDATE_APPLICANT_DOCUMENT,
					variables: {
						document: document
					}
				})
				.then(() => {
					this.props.handleOpenSnackbar('success', 'Successfully update', 'bottom', 'right');
					this.getTemplateDocuments();
					resolve('¡Éxito!');
				})
				.catch((error) => {
					// Replace this alert with a Snackbar message error
					this.props.handleOpenSnackbar(
						'error',
						'Error to update title. Please, try again!',
						'bottom',
						'right'
					);
					reject(error);
				});
		});
	};

	componentWillMount() {
		this.getTemplateDocuments();
	}

	componentWillReceiveProps(nextProps) {
        if (nextProps.applicationId != this.props.applicationId) {
            this.setState({
                applicationId: nextProps.applicationId
            });
        }
    }

	renderStaticElement = () => {
		return (
			<DocumentInputFileCard
				cardType={'S'}
				title={spanishActions[6].label}
				addDocument={this.addDocument}
				handleOpenSnackbar={this.props.handleOpenSnackbar}
			/>
		);
	};

	renderTemplateList = () => {
		if (!this.state.templates) return false;
		return this.state.templates.map((item) => {
			//Search for the Document Type into Applicant's Documents
			const found = this.state.documents.find((fnd) => {
				return fnd.CatalogItemId == item.Id;
			});

			//If document found then , don't show template into template list
			if (found) {
				return (
					<DocumentInputFileCard
						key={found.id}
						ID={found.id}
						cardType={'D'}
						typeId={found.CatalogItemId}
						title={found.fileName.trim()}
						url={found.url}
						removeDocument={this.removeDocument}
						removing={this.state.removing}
						updateDocument={this.updateDocument}
						handleOpenSnackbar={this.props.handleOpenSnackbar}
						item={found}
						fileExtension={found.fileExtension}
					/>
				);
			}
			return (
				<DocumentInputFileCard
					key={item.Id}
					cardType={'T'}
					typeId={item.Id}
					title={item.Name.trim()}
					url={item.Value}
					addDocument={this.addDocument}
					handleOpenSnackbar={this.props.handleOpenSnackbar}
				/>
			);
		});
	};

	renderDocumentList = () => {
		if (!this.state.documents) return false;
		return this.state.documents.map((item) => {
			//Search for the Document Type into Applicant's Documents
			const found = this.state.templates.find((fnd) => {
				return fnd.Id == item.CatalogItemId;
			});
			if (found) return false;

			return (
				<DocumentInputFileCard
					key={item.id}
					ID={item.id}
					cardType={'D'}
					typeId={item.CatalogItemId}
					title={item.fileName.trim()}
					url={item.url}
					removeDocument={this.removeDocument}
					removing={this.state.removing}
					updateDocument={this.updateDocument}
					handleOpenSnackbar={this.props.handleOpenSnackbar}
					item={item}
					fileExtension={item.fileExtension}
				/>
			);
		});
	};

	render() {
		return (
			<div className="Apply-container--application">
				<ConfirmDialog
					open={this.state.openConfirm}
					closeAction={() => {
						this.setState({ openConfirm: false });
					}}
					confirmAction={() => {
						this.removeDocument();
					}}
					title={dialogMessages[0].label}
					loading={this.state.removing}
				/>
				<div className="row">
					<div className="col-md-12">
						<div className="applicant-card">
							<div className="applicant-card__header">
								<span className="applicant-card__title">
									{applyTabs[9].label}
									<p>
										<small className="font-weight-light text-success">
											supported files ({[
												...this.context.extImage,
												...this.context.extPdf,
												...this.context.extWord
											].join(',')}) | max size {this.context.maxFileSize / 1024 / 1024} MB
										</small>
									</p>
								</span>
							</div>
							{this.state.loading ? (
								<div className="form-section-1 form-section--center">
									<CircularProgressLoading />
								</div>
							) : this.state.errorMessage ? (
								<React.Fragment>
									<NothingToDisplay
										title="Oops!"
										message="Error loading data"
										type="Error-danger"
										icon="danger"
									/>
								</React.Fragment>
							) : (
										<ul className="UploadDocument-wrapper">
											{this.renderStaticElement()}
											{this.renderTemplateList()}
											{this.renderDocumentList()}
										</ul>
									)}
						</div>
					</div>
				</div>
			</div>
		);
	}
	static contextTypes = {
		maxFileSize: PropTypes.number,
		extImage: PropTypes.array,
		extPdf: PropTypes.array,
		extWord: PropTypes.array
	};
}

export default withApollo(withGlobalContent(ApplicantDocument));
