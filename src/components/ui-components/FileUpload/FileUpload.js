import React, { Component } from 'react';
import firebase from 'firebase';
import './index.css';
import CircularProgress from '../../material-ui/CircularProgress';

import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';

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
		this.setState({
			loading: true
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
					uploadValue: percentage
				});
			},
			(error) => {
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
								//fileName: file.name,
								loading: false
							});
							this.props.updateURL(this.state.fileURL, file.name);
						}
					);
				});
			}
		);
	}

	render() {
		return (
			<div className="upload-file">
				<IconButton
					color="primary"
					href={!this.props.disabled && this.props.url}
					disabled={this.props.disabled}
					target="_blank"
					component="button"
				>
					<Visibility />
				</IconButton>

				<input
					className="input-name-file"
					disabled={this.props.disabled}
					type="text"
					value={this.props.fileName}
					onChange={(e) => {}}
				/>
				{this.state.loading ? (
					<div className="upload-btn-wrapper">
						<CircularProgress />
					</div>
				) : (
					<div className="upload-btn-wrapper">
						<button className="btn btn-file" disabled={this.props.disabled}>
							<span className="icon-attach" />
						</button>

						<input type="file" name="myfile" onChange={this.handleUpload} disabled={this.props.disabled} />
					</div>
				)}
			</div>
		);
	}
}

export default FileUpload;
