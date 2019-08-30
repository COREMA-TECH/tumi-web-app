import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AWS from 'aws-sdk';

const uuidv4 = require('uuid/v4');

class ImageUpload extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			uploadValue: 0
		};

		this.handleUpload = this.handleUpload.bind(this);
	}

	componentWillMount() {
		this.setState({ fileURL: this.context.avatarURL });
	}
	triggerFileClick = (event) => {
		event.preventDefault();
		document.getElementById(this.props.id).click();
	};

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
					this.props.updateAvatar(data.Location);
				};
			}).on('httpUploadProgress', evt => {
				// Update the progress
				this.setState(() => ({ uploadValue: parseInt((evt.loaded * 100) / evt.total) }));
			})
		});
	}

	handleUpload(event) {
		// Get the file selected
		const file = event.target.files[0];
		var _validFileExtensions = [...this.context.extImage];
		if (
			!_validFileExtensions.find((value) => {
				if (!file) return null;
				return (file.name || '').toLowerCase().endsWith(value);
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
			<div className="upload-image">
				<div className={`avatar-wrapper ${this.props.disabled == true ? 'disabled' : ''}`}>
					{this.state.loading ? (
						<div className="avatarImage-wrapper">
							<img
								className="avatar-uploaded"
								src={'https://loading.io/spinners/balls/lg.circle-slack-loading-icon.gif'}
								alt="Company Avatar"
							/>
						</div>
					) : (
							<React.Fragment>
								<div className="avatarImage-wrapper">
									<img className="avatar-uploaded" src={this.props.fileURL} alt="Company Avatar" />
								</div>
								<div className="upload-btn-wrapper">
									<button type="button" onClick={this.triggerFileClick} className="btn-up">
										<i class="fas fa-cloud-upload-alt" />
									</button>
									<input
										type="file"
										id={this.props.id}
										name="myfile"
										accept=" image/*"
										onChange={this.handleUpload}
										disabled={this.props.disabled}
									/>
								</div>
							</React.Fragment>
						)}
				</div>
			</div>
		);
	}
	static contextTypes = {
		avatarURL: PropTypes.string,
		extImage: PropTypes.object,
		credentialsS3: PropTypes.object,
		bucketS3: PropTypes.string
	};
}

export default ImageUpload;
