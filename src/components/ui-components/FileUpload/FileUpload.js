import React, { Component } from 'react';
import './index.css';
import PropTypes from 'prop-types';
import AWS from 'aws-sdk';

const uuidv4 = require('uuid/v4');

class FileUpload extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uploadValue: 0,
			loading: false
		};

		this.handleUpload = this.handleUpload.bind(this);
	}

	uploadImageToS3 = (image) => {
		// Loading state
		this.setState(() => ({
			loading: true
		}), () => {
			let s3 = new AWS.S3(this.context.credentialsS3);
			// Create a random file
			let filename = `${uuidv4()}_${image.name}`;
			let route = 'images/' + filename;
			// Configure bucket and key
			let params = {
				Bucket: this.context.bucketS3,
				Key: route,
				contentType: image.type,
				ACL: 'public-read',
				Body: image
			};

			s3.upload(params, (err, data) => {
				if (err) {
					// Update the progress
					this.setState(() => ({ uploadValue: 0, loading: false }));
					this.props.handleOpenSnackbar('error', 'Error Loading File', 'bottom', 'right');
				}
				else {
					this.setState(() => ({ uploadValue: 0, loading: false }));
					this.props.updateURL(data.Location, filename)
				};
			}).on('httpUploadProgress', evt => {
				// Update the progress
				this.setState(() => ({ uploadValue: parseInt((evt.loaded * 100) / evt.total) }));
			})
		});
	};

	handleUpload(event) {
		// Get the file selected
		const file = event.target.files[0];
		if (!file)
			return true;
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
		} else this.uploadImageToS3(file);
	}

	render() {
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
		UID: PropTypes.func,
		credentialsS3: PropTypes.object,
		bucketS3: PropTypes.string
	};
}
FileUpload.propTypes = {
	handleOpenSnackbar: PropTypes.func.isRequired
};
export default FileUpload;
