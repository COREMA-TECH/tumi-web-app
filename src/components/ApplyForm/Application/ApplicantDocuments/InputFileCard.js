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
			errorMessage: null,
			editName: true,
			title: props.title
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ title: nextProps.title });
	}

	handleUpload = (event, id, docName, typeId) => {
		// Get the file selected
		const file = event.target.files[0];

		if (file.size > 10485760) {
			alert('File is too big!');
			this.value = '';
			return true;
		}
		this.setState({
			uploading: true,
			catalogItemId: id
		});

		// Build the reference based in the filename
		const storageRef = firebase.storage().ref(`/files/${file.name}`);

		// Send the reference and save the file in Firebase Storage
		const task = storageRef.put(file);

<<<<<<< HEAD
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
                <div className="group-container ">
                    <div className="group-title"></div>
                    <div className="image-upload-wrap-static">
                        <input
                            disabled={this.state.uploading}
                            className="file-upload-input"
                            type="file"
                            onChange={(e) => {
                                this.handleUpload(e);
                            }}
                            accept="application/pdf"
                        />
                        <div className="drag-text">
                            {!this.state.uploading && <span>+</span>}
                            {this.state.uploading && (
                                <div class={`c100 p${this.state.progress} small`}>
                                    <span>{`${this.state.progress}%`}</span>
                                    <div className="slice">
                                        <div className="bar"/>
                                        <div className="fill"/>
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
                <div key={this.props.typeId} className="group-container">
                    {/*<span className="group-title"></span>*/}
                    <div className="group-title"></div>
                    <div className="button-container button-container-top">
                        <a className="file-input" href={this.props.url} target="_blank">
                            {' '}
                            {this.props.title} <div className="fa-container fa-container-download"><i className="fas fa-download fa-lg"/></div>
                        </a>
                    </div>
                    <div className="image-upload-wrap">
                        <input
                            className="file-upload-input"
                            type="file"
                            onChange={(e) => {
                                this.handleUpload(e, this.props.typeId, this.props.title, this.props.typeId);
                            }}
                            accept="application/pdf"
                        />
                        <div className="drag-text">
                            {!this.state.uploading && <i className="fas fa-cloud-upload-alt"></i>}
                            {this.state.uploading && (
                                <div class={`c100 p${this.state.progress} small`}>
                                    <span>{`${this.state.progress}%`}</span>
                                    <div className="slice">
                                        <div className="bar"/>
                                        <div className="fill"/>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </li>
        );
    };

    renderDialogEditFileName = () => {

    };

    renderDocumentList = () => {
        return (
            <li className="UploadDocument-item">
                <div key={this.props.ID} className="group-container">
                    {/*<span className="group-title">{this.props.title}</span>*/}
                    <div className="file-name-container">
                        <input
                            disabled={this.state.editName}
                            type="text"
                            value={this.state.title}
                            onChange={(e) => {
                                this.setState({
                                    title: e.target.value
                                })
                            }}
                            className={this.state.editName ? "group-title" : "group-title input-file-name-edit"}/>
                        {
                            this.state.editName ? (
                                    <div className="fa-container fa-container-edit">
                                        <i className="far fa-edit"
                                           onClick={() => {
                                               this.setState({
                                                   editName: false
                                               })
                                           }}></i>
                                    </div>
                            ) : (
                                <div className="fa-container">
                                    <i className="far fa-save"
                                       onClick={() => {
                                           this.setState({
                                               editName: true
                                           })
                                       }}></i>
                                </div>
                            )
                        }
                    </div>
                    <div className="image-show-wrap">
                        <div className="drag-text">
                            <i className="far fa-file-alt fa-7x"/>
                        </div>
                    </div>
                    <div className="button-container">
                        <a className="file-input input-middle" href={this.props.url} target="_blank">
                            <i className="fas fa-download fa-lg"/>
                        </a>
                        <a
                            href=""
                            className="file-input input-middle"
                            onClick={(e) => {
                                e.preventDefault();
                                this.setState({openConfirm: true, idToDelete: this.props.ID});
                            }}
                        >
                        </a>
                    </div>
                </div>
            </li>
        );
    };

    componentWillMount(){
        this.setState({
            title: this.props.title
        })
    }

    render() {
        return (
            <React.Fragment>
                <ConfirmDialog
                    open={this.state.openConfirm}
                    closeAction={() => {
                        this.setState({openConfirm: false});
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
=======
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
				<div className="group-container ">
					<span className="group-title">{spanishActions[6].label}</span>
					<div className="image-upload-wrap-static">
						<input
							disabled={this.state.uploading}
							className="file-upload-input"
							type="file"
							onChange={(e) => {
								this.handleUpload(e);
							}}
							accept="application/pdf"
						/>
						<div className="drag-text">
							{!this.state.uploading && <span>+</span>}
							{this.state.uploading && (
								<div class={`c100 p${this.state.progress} small`}>
									<span>{`${this.state.progress}%`}</span>
									<div className="slice">
										<div className="bar" />
										<div className="fill" />
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
				<div key={this.props.typeId} className="group-container">
					<span className="group-title">{this.state.title}</span>
					<div className="image-upload-wrap">
						<input
							className="file-upload-input"
							type="file"
							onChange={(e) => {
								this.handleUpload(e, this.props.typeId, this.state.title, this.props.typeId);
							}}
							accept="application/pdf"
						/>
						<div className="drag-text">
							{!this.state.uploading && <span>+</span>}
							{this.state.uploading && (
								<div class={`c100 p${this.state.progress} small`}>
									<span>{`${this.state.progress}%`}</span>
									<div className="slice">
										<div className="bar" />
										<div className="fill" />
									</div>
								</div>
							)}
						</div>
					</div>
					<div className="button-container">
						<a className="file-input" href={this.props.url} target="_blank">
							{' '}
							{spanishActions[7].label} <i className="fas fa-download fa-lg" />
						</a>
					</div>
				</div>
			</li>
		);
	};
	renderEditButtons = () => {
		if (this.props.updating)
			return (
				<i
					className="fa fa-spinner fa-spin"
					onClick={() => {
						this.setState({
							editName: false
						});
					}}
				/>
			);
		return this.state.editName ? (
			<i
				className="far fa-edit"
				onClick={() => {
					this.setState({
						editName: false
					});
				}}
			/>
		) : (
			<i
				className="far fa-save"
				onClick={() => {
					this.setState(
						{
							editName: true
						},
						() => {
							const doc = this.props.item;
							this.props.updateDocument({
								applicationId: doc.applicationId,
								catalogItemId: doc.catalogItemId,
								fileName: this.state.title,
								id: doc.id,
								url: doc.url,
								ApplicationId: doc.ApplicationId
							});
						}
					);
				}}
			/>
		);
	};
	renderDocumentList = () => {
		return (
			<li className="UploadDocument-item">
				<div key={this.props.ID} className="group-container">
					{/*<span className="group-title">{this.state.title}</span>*/}
					<div className="file-name-container">
						<input
							disabled={this.state.editName}
							type="text"
							value={this.state.title}
							maxLength={20}
							onChange={(e) => {
								this.setState({ title: e.currentTarget.value });
							}}
							className={this.state.editName ? 'group-title' : 'group-title input-file-name-edit'}
						/>
						{!this.props.typeId && this.renderEditButtons()}
					</div>
					<div className="image-show-wrap">
						<div className="drag-text">
							<i className="far fa-file-alt fa-7x" />
						</div>
					</div>
					<div className="button-container">
						<a className="file-input input-middle" href={this.props.url} target="_blank">
							<i className="fas fa-download fa-lg" />
						</a>
						<a
							href=""
							className="file-input input-middle"
							onClick={(e) => {
								e.preventDefault();
								this.setState({ openConfirm: true, idToDelete: this.props.ID });
							}}
						/>
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
>>>>>>> e9df680e5e8d607f874237c23fbb306695880e1c
}

InputFileCard.propTypes = {
	cardType: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired
};

export default withApollo(withGlobalContent(InputFileCard));
