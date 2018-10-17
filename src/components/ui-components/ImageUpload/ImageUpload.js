import React, { Component } from 'react';
import firebase from 'firebase';
import CircularProgress from '../../material-ui/CircularProgress';
import PropTypes from 'prop-types';
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
		document.getElementById("avatarFile").click();
	}
	handleUpload(event) {
		// Loading state
		this.setState({
			loading: true
		});

		// Get the file selected
		const file = event.target.files[0];

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
				console.log('The error is: ' + error);
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

	render() {
		if (this.state.loading) {
			return (
				<div className="upload-image">
					<div className="avatar-wrapper">
						<div className="avatarImage-wrapper">
							<img className="avatar-uploaded" src="https://loading.io/spinners/balls/lg.circle-slack-loading-icon.gif" />
						</div>
					</div>
				</div>

			);
		}

		return (
			<div className="upload-image">
				<div className="avatar-wrapper">
					<div className="avatarImage-wrapper">
						<img className="avatar-uploaded" src={this.props.fileURL || this.state.fileURL} alt="Company Avatar" />
					</div>
					<div className="upload-btn-wrapper">
						<button onClick={this.triggerFileClick} className="btn-up"><i class="fas fa-cloud-upload-alt"></i></button>
						<input type="file" id="avatarFile" name="myfile" onChange={this.handleUpload} disabled={this.props.disabled} />
					</div>
				</div>
			</div>
		);
	}
	static contextTypes = {
		avatarURL: PropTypes.string
	};
}

export default ImageUpload;
