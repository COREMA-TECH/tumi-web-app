import React, {Component} from 'react';
import firebase from 'firebase';
import './index.css';
import CircularProgress from "../../material-ui/CircularProgress";

const uuidv4 = require('uuid/v4');

class ImageUpload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            uploadValue: 0,
            fileURL: 'https://intellihr.com.au/wp-content/uploads/2017/06/avatar_placeholder_temporary.png'
        };

        this.handleUpload = this.handleUpload.bind(this);
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

        task.on('state_changed', snapshot => {
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            // Update the progress
            this.setState({
                uploadValue: percentage
            })

        }, error => {
            console.log("The error is: " + error);
        }, () => {
            storageRef.getDownloadURL().then(url => {
                this.setState({
                    fileURL: url,
                    loading: false
                }, () => {
                    this.props.updateAvatar(this.state.fileURL);
                })
            })

        });
    }


    render() {

        if (this.state.loading) {
            return (
                <div className="upload-image">
                    <CircularProgress/>
                    <br/><br/>
                    <div className="upload-btn-wrapper">
                        <button className="btn">Select Avatar</button>
                        <input type="file" name="myfile" onChange={this.handleUpload}/>
                    </div>
                </div>
            );
        }

        return (
            <div className="upload-image">
                <img className="avatar-uploaded" src={this.state.fileURL} alt="Company Avatar"/>
                <br/>
                <div className="upload-btn-wrapper">
                    <button className="btn">Select Avatar</button>
                    <input type="file" name="myfile" onChange={this.handleUpload}/>
                </div>
            </div>


        );
    }
}

export default ImageUpload;
