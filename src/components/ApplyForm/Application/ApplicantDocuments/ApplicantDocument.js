import React, { Component } from 'react';
import CircularProgressLoading from 'material-ui/CircularProgressLoading';
import firebase from 'firebase';
import './ApplicantDocumen.css';
import './Circular.css';
import { GET_DOCUMENTS_AND_TEMPLATES } from '../../Queries';
import { REMOVE_APPLICANT_DOCUMENT, ADD_APPLICANT_DOCUMENT } from '../../Mutations';
import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';
import withApollo from 'react-apollo/withApollo';
import withGlobalContent from '../../../Generic/Global';
import ConfirmDialog from 'material-ui/ConfirmDialog';

const menuSpanish = require(`../languagesJSON/${localStorage.getItem('languageForm')}/menuSpanish`);
const spanishActions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);
const dialogMessages = require(`../languagesJSON/${localStorage.getItem('languageForm')}/dialogMessages`);

class ApplicantDocument extends Component {
	constructor(props) {
		super(props);

		this.state = {
			// Editing state properties - To edit general info
			editing: false,
			applicationId: 24,
			loading: false,
			idToDelete: 0,
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
	removeDocument = () => {
		this.setState({ removing: true });
		this.props.client
			.mutate({
				mutation: REMOVE_APPLICANT_DOCUMENT,
				variables: {
					id: this.state.idToDelete
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
	addDocument = () => {
		this.setState({ loading: true });
		this.props.client
			.mutate({
				mutation: ADD_APPLICANT_DOCUMENT,
				variables: {
					documents: {
						url: this.state.fileURL,
						fileName: this.state.fileName,
						CatalogItemId: this.state.catalogItemId,
						ApplicationId: this.state.applicationId
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

	componentWillMount() {
		this.getTemplateDocuments();
	}

	renderStaticElement = () => {
		return (
			<li className="UploadDocument-item">
				<div class="group-container ">
					<span class="group-title title-blue">
						{spanishActions[6].label}
					</span>
					<div class="image-upload-wrap-static">
						<input
							disabled={this.state.uploading}
							class="file-upload-input"
							type="file"
							onChange={(e) => {
								this.handleUpload(e);
							}}
							accept="application/pdf"
						/>
						<div class="drag-text">
							{!this.state.uploading && <span>+</span>}
							{this.state.uploading && (
								<div class={`c100 p${this.state.progress} small`}>
									<span>{`${this.state.progress}%`}</span>
									<div class="slice">
										<div class="bar" />
										<div class="fill" />
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</li>
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
			if (found) return false;
			return (
				<li className="UploadDocument-item">
					<div key={item.Id} class="group-container">
						<span class="group-title">{item.Name}</span>
						<div class="image-upload-wrap">
							<input
								class="file-upload-input"
								type="file"
								onChange={(e) => {
									this.handleUpload(e, item.Id, item.Name);
								}}
								accept="application/pdf"
							/>
							<div class="drag-text">
								<span>+</span>
							</div>
						</div>
						<div class="button-container">
							<a class="file-input" href={item.Value} target="_blank">
								{' '}
								{spanishActions[7].label} <i className="fas fa-download"></i>
							</a>
						</div>
					</div>
				</li>
			);
		});
	};

	renderDocumentList = () => {
		if (!this.state.documents) return false;
		return this.state.documents.map((item) => {
			return (
				<li className="UploadDocument-item">
					<div key={0} class="group-container">
						<span class="group-title">{item.fileName}</span>
						<div class="image-show-wrap">
							<div class="drag-text">
								<i class="far fa-file-alt fa-7x" />
							</div>
						</div>
						<div class="button-container">
							<a class="file-input input-middle" href={item.url} target="_blank">
								<i class="fas fa-file-download fa-lg" />
							</a>
							<a
								href=""
								class="file-input input-middle"
								onClick={(e) => {
									e.preventDefault();
									this.setState({ openConfirm: true, idToDelete: item.id });
								}}
							>
								<i class="fas fa-trash-alt fa-lg" />
							</a>
						</div>
					</div>
				</li>
			);
		});
	};

	handleUpload = (event, id, docName) => {
		this.setState({
			uploading: true,
			catalogItemId: id
		});

		// Get the file selected
		const file = event.target.files[0];

		// Build the reference based in the filename
		const storageRef = firebase.storage().ref(`/files/${file.name}`);

		// Send the reference and save the file in Firebase Storage
		const task = storageRef.put(file);

		task.on(
			'state_changed',
			(snapshot) => {
				let percentage = parseInt(snapshot.bytesTransferred / snapshot.totalBytes * 100);

				// Update the progress
				this.setState({
					progress: percentage
				});
			},
			(error) => {
				this.setState({
					uploading: false
				});
			},
			() => {
				storageRef.getDownloadURL().then((url) => {
					this.setState(
						{
							progress: 100,
							uploading: false,
							fileURL: url,
							fileName: docName || file.name
						},
						this.addDocument
					);
				});
			}
		);
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
								<span className="applicant-card__title">{menuSpanish[6].label}</span>
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
}

export default withApollo(withGlobalContent(ApplicantDocument));
