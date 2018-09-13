import React, { Component } from 'react';
import firebase from 'firebase';
import './index.css';

class FileUpload extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uploadValue: 0,
			fileURL: '',
			fileName: ''
		};

		this.handleUpload = this.handleUpload.bind(this);
	}

	handleUpload(event) {
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
				console.log(error);
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
								fileName: file.name
							});
							this.props.updateURL(this.state.fileURL);
						}
					);
				});
			}
		);
	}

	render() {
		return (
			<div className="upload-file">
				<input
					className="input-name-file"
					disabled={this.props.disabled}
					type="text"
					value={this.state.fileName}
					onChange={(e) => {}}
				/>
				<div className="upload-btn-wrapper">
					<button className="btn btn-file" disabled={this.props.disabled}>
						<span className="icon-attach" />
					</button>
					<input type="file" name="myfile" onChange={this.handleUpload} disabled={this.props.disabled} />
				</div>
			</div>
		);
	}
}

export default FileUpload;
