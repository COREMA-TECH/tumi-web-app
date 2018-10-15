import React, { Component } from 'react';
import firebase from 'firebase';
import './index.css';
import CircularProgress from '../../material-ui/CircularProgress';

class FileUpload extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uploadValue: 0,
			fileURL: '',
			fileName: '',
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
								fileName: file.name,
								loading: false
							});
							this.props.updateURL(this.state.fileURL);
						}
					);
				});
			}
		);
	}

	componentWillMount() {
		if (this.props.fileNameUploaded) {
			this.setState({
				fileName: this.props.fileNameUploaded
			});
		}
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
									<label class="custom-file-label" for="validatedCustomFile">{this.state.fileName == "" ? "Choose File.." : this.state.fileName}</label>
								</div>
								<div class="input-group-append">
									<button class="btn btn-outline-secondary" type="button" id="inputGroupFileAddon04">
										<i class="far fa-eye"></i>
									</button>
								</div>
							</div>
						</div>
					)}
			</div>
		);
	}
}

export default FileUpload;
