import React, { Component } from 'react';
import firebase from 'firebase';
import PropTypes from 'prop-types';
const uuidv4 = require('uuid/v4');

class ImageUpload extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			uploadValue: 0,
			fileURL: props.fileURL
		};

		this.handleUpload = this.handleUpload.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ fileURL: nextProps.fileURL });
	}
	componentWillMount() {
		this.setState({ fileURL: this.context.avatarURL });
	}
	triggerFileClick = (event) => {
		event.preventDefault();
		document.getElementById(this.props.id).click();
	};
	handleUpload(event) {
		// Get the file selected
		const file = event.target.files[0];
		var _validFileExtensions = [ ...this.context.extImage ];
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
		} else {
			// Loading state
			this.setState({
				loading: true,
				fileURL: 'https://loading.io/spinners/balls/lg.circle-slack-loading-icon.gif'
			});

			// Build the reference based in the filename
			const storageRef = firebase.storage().ref(`/images/${uuidv4()}`);

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
					this.setState({ loading: false });
					this.props.handleOpenSnackbar('error', 'Error Loading File', 'bottom', 'right');
				},
				() => {
					storageRef.getDownloadURL().then((url) => {
						this.setState(
							{
								fileURL: url,
								loading: false
							},
							() => {
								this.props.updateAvatar(this.state.fileURL);
							}
						);
					});
				}
			);
		}
	}

	render() {
		return (
			<div className="upload-image">
				<div className={`avatar-wrapper ${this.props.disabled == true ? 'disabled' : ''}`}>
					<div className="avatarImage-wrapper">
						<img className="avatar-uploaded" src={this.state.fileURL} alt="Company Avatar" />
					</div>
					<div className="upload-btn-wrapper">
						<button onClick={this.triggerFileClick} className="btn-up">
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
				</div>
			</div>
		);
	}
	static contextTypes = {
		avatarURL: PropTypes.string,
		extImage: PropTypes.object
	};
}

export default ImageUpload;
