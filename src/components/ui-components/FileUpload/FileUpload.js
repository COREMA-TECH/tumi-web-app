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
			<div className="">
				{/*<input
					className="form-control"
					disabled={this.props.disabled}
					type="text"
					value={this.state.fileName}
					onChange={(e) => { }}
				/>*/}
				{this.state.loading ? (
					<div className="upload-btn-wrapper">
						<CircularProgress />
					</div>
				) : (
						<div className="">
							<div class="input-group">
								<div class="custom-file">
									<input type="file" onChange={this.handleUpload} class="custom-file-input" id="validatedCustomFile" disabled={this.props.disabled} />
									<label class="custom-file-label" for="validatedCustomFile">{this.props.fileName == null ? "Choose File.." : this.props.fileName}</label>
								</div>
								<div class="input-group-append">
									<a class="btn btn-outline-secondary" id="inputGroupFileAddon04" href={!this.props.disabled && this.props.url}
										disabled={this.props.disabled}
										target="_blank">
										<i class="far fa-eye"></i>
									</a>
								</div>
							</div>
						</div>
					)}
			</div>
		);
	}
}

export default FileUpload;
