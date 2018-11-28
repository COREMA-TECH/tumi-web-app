import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';

const uuidv4 = require('uuid/v4');
class ImageSelection extends Component {
    state = {
        fileURL: '',
        progress: 0,
        loading: false,
        capturedImage: ''
    }
    constructor(props) {
        super(props)
    }
    onClickFileUpload = () => {
        if (!this.state.loading)
            this.fileInput.click();
    }
    onChageSelectedFile = (event) => {
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
        } else {
            // Loading state
            this.setState({
                loading: true
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
                        progress: percentage
                    });
                },
                (error) => {
                    this.setState({ loading: false });
                    this.props.handleOpenSnackbar('error', 'Error Loading File', 'bottom', 'right');
                },
                () => {
                    storageRef.getDownloadURL().then((url) => {
                        setTimeout(() => {
                            this.setState({ loading: false });
                            this.props.returnImage(url)
                        }, 500);
                    });
                }
            );
            event.target.value = '';
        }
    }
    showProgress = () => {
        if (this.state.loading)
            return <div className="progress" >
                <div className="progress-bar" role="progressbar" style={{ width: `${this.state.progress}%` }} aria-valuemax="100"></div>
            </div>
    }
    showCamera = () => {
        this.initVideoCamera();
        document.getElementById("IS-animationWrapper").classList.add("slide-left")
    }
    goToImageSelection = () => {
        this.stopVideoCamera()
        document.getElementById("IS-animationWrapper").classList.remove("slide-left");
        this.setState({ capturedImage: '' })
        if (this.videoElement)
            this.videoElement.pause();

    }
    initVideoCamera = () => {
        if (this.videoElement) {
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
            if (navigator.getUserMedia) {
                navigator.getUserMedia({ video: true }, this.handleVideo, this.videoError);
            }
        }
    }
    stopVideoCamera = () => {
        if (this.state.stream) {
            var track = this.state.stream.getTracks()[0];
            track.stop();
        }
    }

    handleVideo = (stream) => {
        // Update the state, triggering the component to re-render with the correct stream
        this.setState({ videoSrc: window.URL.createObjectURL(stream), stream: stream });
        this.videoElement.play();
    }
    videoError = () => {
    }
    captureImage = () => {
        const scale = 1;
        var canvas = document.createElement("CANVAS");
        var video = this.videoElement;
        //var canvas = this.canvas;
        canvas.width = video.videoWidth * scale;
        canvas.height = video.videoHeight * scale;

        canvas.getContext('2d').drawImage(video, 0, 0);
        this.setState({ capturedImage: canvas.toDataURL() })
    }
    showCameraContainer = () => {
        if (this.state.capturedImage === '') {
            return <React.Fragment>
                <video ref="videoElement" id="video" width="100%" height="auto" className="cameraFrame" src={this.state.videoSrc} autoPlay="true"
                    ref={(input) => { this.videoElement = input; }}></video>
            </React.Fragment>
        }
        if (this.state.capturedImage !== '') {
            return <img id="imgPreview" width="100%" height="auto" src={this.state.capturedImage} />
        }
    }
    showAcceptCapturedImagesBtn = () => {
        if (!this.state.capturedImage) {
            return <button className="btn btn-success btn-circle btn-lg" onClick={this.captureImage}>
                <i class="fas fa-camera-retro"></i>
            </button>
        } else {
            return <React.Fragment>
                <button className="btn btn-info btn-circle btn-lg" onClick={() => this.props.returnImage(this.state.capturedImage)}>
                    <i class="fas fa-check"></i>
                </button>
                <button className="btn btn-danger btn-circle btn-lg" onClick={() => { this.setState({ capturedImage: '' }) }}>
                    <i class="fas fa-times"></i>
                </button>
            </React.Fragment>
        }

    }
    render() {
        return <div className="ImageSelectionWrapper">
            <div id="IS-animationWrapper" className="IS-animationWrapper">
                <div id="ProfilePictureContiner" className="ProfilePicture">
                    <a className="image-container" onClick={this.onClickFileUpload} >
                        <i className="fas fa-cloud-upload-alt fa-3x image-upload" ></i>
                        <span>Upload File</span>
                    </a>
                    <div style={{ maxWidth: 300, width: '100%', height: 20 }}>
                        {this.showProgress()}
                    </div>
                    <input ref={input => this.fileInput = input} onChange={this.onChageSelectedFile} type="file" accept=" image/*" className="upload_btn" />
                    <h1 className="division-text">Or</h1>
                    <a className="image-container image-containter-bb" onClick={this.showCamera}>
                        <i class="fas fa-camera-retro  fa-3x image-upload"></i>
                        <span>Take a Picture</span>
                    </a>
                </div>
                <div id="ProfileCameraContiner" className="ProfileCamera">
                    <div style={{ width: '100%', height: '400px' }}>
                        {this.showCameraContainer()}
                        <button className="ProfileCamera-back btn btn-danger btn-circle btn-lg" onClick={this.goToImageSelection}>
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <div className="ProfileCamera-button">
                            {this.showAcceptCapturedImagesBtn()}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    }
    static contextTypes = {
        extImage: PropTypes.object
    };
}

export { ImageSelection };