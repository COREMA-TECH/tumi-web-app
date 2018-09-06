import React, {Component} from 'react';
import firebase from 'firebase';
import './index.css';

class FileUpload extends Component {
    constructor(props){
        super(props);

        this.state = {
            uploadValue: 0,
            fileURL: ''
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

        task.on('state_changed', snapshot => {
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            // Update the progress
            this.setState({
                uploadValue: percentage
            })
        }, error => {
            console.log(error);
        }, () => {
            storageRef.getDownloadURL().then(url => {
                this.setState({
                    uploadValue: 100,
                    fileURL: url
                })
            })
        });
    }

    render() {
        return (
            <div>
                <progress value={this.state.uploadValue} max="100"/>
                <br/>
                <input className="file-upload" type="file" onChange={this.handleUpload}/>
            </div>
        );
    }
}

export default FileUpload;
