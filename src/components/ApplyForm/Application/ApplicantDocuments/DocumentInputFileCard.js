import React, { Component } from 'react';
import firebase from 'firebase';
import './ApplicantDocument.css';
import './Circular.css';
import withApollo from 'react-apollo/withApollo';
import withGlobalContent from '../../../Generic/Global';
import ConfirmDialog from 'material-ui/ConfirmDialog';
import PropTypes from 'prop-types';
const spanishActions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);
const dialogMessages = require(`../languagesJSON/${localStorage.getItem('languageForm')}/dialogMessages`);

class InputFileCard extends Component {
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
			errorMessage: null,
			editName: true,
			title: props.title,
			startTitle: props.title,
			updating: false,
			fileExtension: props.fileExtension || ''
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ title: nextProps.title });
	}

	getIconFile = () => {
		//Verify if the extension is from a word file
		if (
			this.context.extWord.find((value) => {
				return this.state.fileExtension.toLowerCase().endsWith(value);
			})
		)
			return 'far fa-file-word fa-7x';
		//Verify if the extension is from a pdf file
		if (
			this.context.extPdf.find((value) => {
				return this.state.fileExtension.toLowerCase().endsWith(value);
			})
		)
			return 'far fa-file-pdf fa-7x';
		//Verify if the extension is from a image file
		if (
			this.context.extImage.find((value) => {
				return this.state.fileExtension.toLowerCase().endsWith(value);
			})
		)
			return 'far fa-file-image fa-7x';
		return 'far fa-file-alt fa-7x';
	};
	handleUpload = (event, id, docName, typeId) => {
		// Get the file selected
		const file = event.target.files[0];
		var _validFileExtensions = [ ...this.context.extImage, ...this.context.extWord, ...this.context.extPdf ];
		if (
			!_validFileExtensions.find((value) => {
				return file.name.toLowerCase().endsWith(value);
			})
		) {
			this.props.handleOpenSnackbar('warning', 'This format is not supported!', 'bottom', 'right');
			event.target.value = '';
			event.preventDefault();
		} else if (file.size <= 0) {
			this.props.handleOpenSnackbar('warning', 'File is empty', 'bottom', 'right');
			event.target.value = '';
			event.preventDefault();
		} else if (file.size > this.context.maxFileSize) {
			this.props.handleOpenSnackbar(
				'warning',
				`File is too big. Max ${this.context.maxFileSize / 1024 / 1024} MB`,
				'bottom',
				'right'
			);
			event.target.value = '';
			event.preventDefault();
		} else {
			this.setState({
				uploading: true,
				catalogItemId: id,
				fileExtension: _validFileExtensions.find((value) => {
					return file.name.toLowerCase().endsWith(value);
				})
			});

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
					this.props.handleOpenSnackbar('error', 'Error Loading File', 'bottom', 'right');
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
							() => {
								this.props.addDocument(url, this.state.fileName, typeId, this.state.fileExtension);
							}
						);
					});
				}
			);
		}
	};
	renderStaticElement = () => {
		return (
			<li className="UploadDocument-item">
				<div className="group-container ">
					<div className="group-title" />
					<div className="image-upload-wrap-static">
						<input
							disabled={this.state.uploading}
							className="file-upload-input"
							type="file"
							onChange={(e) => {
								this.handleUpload(e);
							}}
							accept={this.context.acceptAttachFile}
						/>
						<div className="drag-text">
							{!this.state.uploading && <span>+</span>}
							{this.state.uploading && (
								<div className={`c100 p${this.state.progress} small`}>
									<span>{`${this.state.progress}%`}</span>
									<div className="slice">
										<div className="bar" />
										<div className="fill" />
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
		return (
			<li className="UploadDocument-item">
				<div key={this.props.typeId} className="group-container">
					{/*<span className="group-title"></span>*/}
					<div className="group-title" />
					<div className="button-container button-container-top">
						<a className="file-input" href={this.props.url} target="_blank">
							{' '}
							{this.props.title}{' '}
							<div className="fa-container fa-container-download">
								<i className="fas fa-download fa-lg" />
							</div>
						</a>
					</div>
					<div className="image-upload-wrap">
						<input
							className="file-upload-input"
							type="file"
							onChange={(e) => {
								this.handleUpload(e, this.props.typeId, this.props.title, this.props.typeId);
							}}
							accept={this.context.acceptAttachFile}
						/>
						<div className="drag-text">
							{!this.state.uploading && <i className="fas fa-cloud-upload-alt" />}
							{this.state.uploading && (
								<div className={`c100 p${this.state.progress} small`}>
									<span>{`${this.state.progress}%`}</span>
									<div className="slice">
										<div className="bar" />
										<div className="fill" />
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</li>
		);
	};

	renderEditButtons = () => {
		return this.state.editName ? (
			<div
				className="fa-container fa-container-edit"
				onClick={() => {
					this.setState({
						editName: false
					});
				}}
			>
				<i className="far fa-edit" />
			</div>
		) : (
			<div className="fa-container-option">
				<div
					className="fa-container-save bg-success"
					onClick={(e) => {
						if (this.state.updating) return true;
						this.setState(
							{
								updating: true
							},
							() => {
								const doc = this.props.item;

								const callUpdate = this.props.updateDocument({
									applicationId: doc.applicationId,
									catalogItemId: doc.catalogItemId,
									fileName: this.state.title,
									id: doc.id,
									url: doc.url,
									ApplicationId: doc.ApplicationId
								});
								callUpdate
									.then((result) => {
										this.setState({ updating: false, editName: true });
									})
									.catch((error) => {
										this.setState({ updating: false });
									});
							}
						);
					}}
				>
					{!this.state.updating && <i className="far fa-save" />}
					{this.state.updating && <i className="fa fa-spinner fa-spin" />}
				</div>
				<div
					className="fa-container-cancel bg-danger"
					onClick={() => {
						this.setState({
							editName: true,
							title: this.state.startTitle
						});
					}}
				>
					<i className="fas fa-ban" />
				</div>
			</div>
		);
	};
	renderDocumentList = () => {
		return (
			<li className="UploadDocument-item">
				<div key={this.props.ID} className="group-container">
					{/*<span className="group-title">{this.props.title}</span>*/}
					<div className="file-name-container">
						<input
							disabled={this.state.editName}
							type="text"
							value={this.state.title}
							onChange={(e) => {
								this.setState({
									title: e.target.value
								});
							}}
							className={this.state.editName ? 'group-title' : 'group-title input-file-name-edit'}
						/>
						{!this.props.typeId && this.renderEditButtons()}
					</div>
					<div className="image-show-wrap">
						<div className="drag-text">
							<i className={this.getIconFile()} />
						</div>
					</div>
					<div className="button-container">
						<a className="file-input input-middle" href={this.props.url} target="_blank">
							<i className="fas fa-download fa-lg" />
						</a>
						<a
							href=""
							className="file-input input-middle"
							onClick={(e) => {
								e.preventDefault();
								this.setState({ openConfirm: true, idToDelete: this.props.ID });
							}}
						>
							<i className="fas fa-trash fa-lg" />
						</a>
					</div>
				</div>
			</li>
		);
	};

	render() {
		return (
			<React.Fragment>
				<ConfirmDialog
					open={this.state.openConfirm}
					closeAction={() => {
						this.setState({ openConfirm: false });
					}}
					confirmAction={() => {
						this.props.removeDocument(this.props.ID);
					}}
					title={dialogMessages[0].label}
					loading={this.props.removing}
				/>

				{(!this.props.cardType || this.props.cardType == 'S') && this.renderStaticElement()}
				{this.props.cardType == 'T' && this.renderTemplateList()}
				{this.props.cardType == 'D' && this.renderDocumentList()}
			</React.Fragment>
		);
	}
	static contextTypes = {
		maxFileSize: PropTypes.number,
		extImage: PropTypes.array,
		extPdf: PropTypes.array,
		extWord: PropTypes.array,
		acceptAttachFile: PropTypes.string
	};
}

InputFileCard.propTypes = {
	cardType: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired
};

export default withApollo(withGlobalContent(withGlobalContent(InputFileCard)));
