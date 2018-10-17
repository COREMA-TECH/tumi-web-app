import React, { Component } from 'react';
import CircularProgressLoading from 'material-ui/CircularProgressLoading';
import firebase from 'firebase';
import './ApplicantDocumen.css';
import { GET_DOCUMENTS_AND_TEMPLATES } from '../../Queries';
import { REMOVE_APPLICANT_DOCUMENT, ADD_APPLICANT_DOCUMENT } from '../../Mutations';

import withApollo from 'react-apollo/withApollo';
import withGlobalContent from '../../../Generic/Global';
import ConfirmDialog from 'material-ui/ConfirmDialog';

const menuSpanish = require(`../languagesJSON/${localStorage.getItem('languageForm')}/menuSpanish`);
const spanishActions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);
const languagesTable = require(`../languagesJSON/${localStorage.getItem('languageForm')}/languagesTable`);

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
			fileName: null
		};
	}

	getTemplateDocuments = () => {
		this.setState(
			{
				loading: true
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
							loading: false
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
				this.setState({ loading: false });
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
			<div class="group-container ">
				<span class="group-title">Other Document</span>
				<div class="image-upload-wrap">
					<input
						class="file-upload-input"
						type="file"
						onChange={(e) => {
							//this.handleUpload(e, item.Id);
						}}
						accept="image/*"
					/>
					<div class="drag-text">
						<div>+</div>
					</div>
				</div>
			</div>
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
				<div key={item.Id} class="group-container">
					<span class="group-title">{item.Name}</span>
					<div class="image-upload-wrap">
						<input
							class="file-upload-input"
							type="file"
							onChange={(e) => {
								this.handleUpload(e, item.Id);
							}}
							accept="image/*"
						/>
						<div class="drag-text">
							<div>+</div>
						</div>
					</div>
					<div class="button-container">
						<button class="file-input">Download Template</button>
					</div>
				</div>
			);
		});
	};

	renderDocumentList = () => {
		if (!this.state.documents) return false;
		return this.state.documents.map((item) => {
			return (
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
			);
		});
	};

	handleUpload = (event, id) => {
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
				let percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;

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
							fileName: file.name
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
					confirmAction={() => {
						this.removeDocument();
					}}
					title={'Are you sure you want to delete this record?'}
					loading={this.state.removing}
				/>
				<div className="row">
					<div className="col-12">
						<div className="applicant-card">
							<div className="applicant-card__header">
								<span className="applicant-card__title">Documents</span>
							</div>
							<div className="row">
								{this.state.loading ? (
									<div className="form-section-1 form-section--center">
										<CircularProgressLoading />
									</div>
								) : (
									<div class="main-group-container">
										{this.renderStaticElement()}
										{this.renderTemplateList()}
										{this.renderDocumentList()}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withApollo(withGlobalContent(ApplicantDocument));
