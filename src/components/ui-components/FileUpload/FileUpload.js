import React, { Component } from 'react';
import firebase from 'firebase';
import './index.css';
import PropTypes from 'prop-types';

class FileUpload extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uploadValue: 0,
			loading: false
		};

		this.handleUpload = this.handleUpload.bind(this);
	}

	handleUpload(event) {
		// Get the file selected
		const file = event.target.files[0];

		var _validFileExtensions = [...this.context.extImage, ...this.context.extWord, ...this.context.extPdf];
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
				loading: true
			});

			// Build the reference based in the filename
			const storageRef = firebase.storage().ref(`/files/${this.context.UID()}${file.name}`);

			// Send the reference and save the file in Firebase Storage
			const task = storageRef.put(file);

			task.on(
				'state_changed',
				(snapshot) => {
					let percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;

					// Update the progress
					this.setState({
						uploadValue: percentage
					});
				},
				(error) => {
					this.props.handleOpenSnackbar('error', 'Error Loading File', 'bottom', 'right');
					this.setState({
						loading: false
					});
				},
				() => {
					storageRef.getDownloadURL().then((url) => {
						this.setState(
							{
								uploadValue: 100,
								fileURL: url
							},
							() => {
								this.setState({
									loading: false
								});
								this.props.updateURL(this.state.fileURL, file.name);
							}
						);
					});
				}
			);
		}
	}

	render() {
		//console.log("This props", !this.props.url)
		return (
			<div className="">
				<div className="">
					<div class="input-group">
						<div class="custom-file">
							<input
								type="file"
								onChange={this.handleUpload}
								class="custom-file-input"
								id="validatedCustomFile"
								disabled={this.props.disabled}
								accept={this.context.acceptAttachFile}
							/>
							<label class="custom-file-label" for="validatedCustomFile">
								{this.props.fileName == null ? 'Choose File..' : this.props.fileName}
							</label>
						</div>
						<div class="input-group-append">
							<a
								class="btn btn-outline-secondary"
								id="inputGroupFileAddon04"
								href={""}
								onClick={(e) => {
									e.preventDefault();
									if (this.state.loading) {
										return true;
									}
									if (this.props.url) {
										window.open(
											this.props.url,
											'_blank'
										);
									}
								}}
								disabled={!this.props.url}
								target="_blank"
							>
								{this.state.loading && <i className="fa fa-spinner fa-spin" />}
								{!this.state.loading && <i class="far fa-eye" />}
							</a>
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
		extWord: PropTypes.array,
		acceptAttachFile: PropTypes.string,
		UID: PropTypes.func
	};
}
FileUpload.propTypes = {
	handleOpenSnackbar: PropTypes.func.isRequired
};
export default FileUpload;
