import React, {Component} from 'react';
import AddAttachment from './AddAttachment';
import DisplayAttachment from './DisplayAttachment';

class Attachments extends Component{
    render(){
        return(
            <React.Fragment>
                <ul className="UploadDocument-wrapper Attachments-list">
                    <AddAttachment />
                    <DisplayAttachment />
                    <DisplayAttachment />
                    <DisplayAttachment />
                </ul>
            </React.Fragment>
        )
    }
}

export default Attachments;