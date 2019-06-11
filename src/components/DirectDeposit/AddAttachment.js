import React, {Component} from 'react';
import withApollo from 'react-apollo/withApollo';
import withGlobalContent from '../Generic/Global';

class AddAttachment extends Component{

    constructor(props){
        super(props);

        this.state = {
            uploading: false,
			progress: 0,
			attachedFile: {}
        }
	}
	
	handleFileAttached = event => {
		const data = new FormData();
		data.append('file', event.target.files[0]);
		
		//AJAX request to upload.
	}

    render(){
        return (
			<li className="UploadDocument-item Attachments-item">
				<div className="group-container ">
					<div className="group-title">Add Attachment</div>
					<div className="image-upload-wrap-static">
						<input
							disabled={this.state.uploading}
							className="file-upload-input"
							type="file"
							onChange={(e) => {
								
							}}
							accept={this.context.acceptAttachFile}
						/>
						<div className="drag-text">
							{!this.state.uploading && <span>+</span>}
							{this.state.uploading && (
								<div className={`c100 p${this.state.progress} small`}>
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
    }
}   

export default  withApollo(withGlobalContent(withGlobalContent(AddAttachment)));