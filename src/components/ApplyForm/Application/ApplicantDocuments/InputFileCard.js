import React, { Component } from 'react';
import firebase from 'firebase';
import './ApplicantDocumen.css';
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
			errorMessage: null
		};
	}

	handleUpload = (event, id, docName, typeId) => {
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
						() => {
							this.props.addDocument(url, this.state.fileName, typeId);
						}
					);
				});
			}
		);
	};
	renderStaticElement = () => {
		return (
			<li className="UploadDocument-item">
				<div class="group-container ">
					<span class="group-title title-blue">{spanishActions[6].label}</span>
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
		return (
			<li className="UploadDocument-item">
				<div key={this.props.typeId} class="group-container">
					<span class="group-title">{this.props.title}</span>
					<div class="image-upload-wrap">
						<input
							class="file-upload-input"
							type="file"
							onChange={(e) => {
								this.handleUpload(e, this.props.typeId, this.props.title, this.props.typeId);
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
					<div class="button-container">
						<a class="file-input" href={this.props.url} target="_blank">
							{' '}
							{spanishActions[7].label} <i class="fas fa-file-download fa-lg" />
						</a>
					</div>
				</div>
			</li>
		);
	};

	renderDocumentList = () => {
		return (
			<li className="UploadDocument-item">
				<div key={this.props.ID} class="group-container">
					<span class="group-title">{this.props.title}</span>
					<div class="image-show-wrap">
						<div class="drag-text">
							<i class="far fa-file-alt fa-7x" />
						</div>
					</div>
					<div class="button-container">
						<a class="file-input input-middle" href={this.props.url} target="_blank">
							<i class="fas fa-file-download fa-lg" />
						</a>
						<a
							href=""
							class="file-input input-middle"
							onClick={(e) => {
								e.preventDefault();
								this.setState({ openConfirm: true, idToDelete: this.props.ID });
							}}
						>
							<i class="fas fa-trash-alt fa-lg" />
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
}
InputFileCard.propTypes = {
	cardType: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired
};

export default withApollo(withGlobalContent(InputFileCard));
