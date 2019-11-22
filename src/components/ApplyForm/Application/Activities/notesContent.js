import React, {Fragment, Component} from 'react';
import { Editor } from '@tinymce/tinymce-react';
import withApollo from "react-apollo/withApollo";

import GeneralModal from '../../../Generic/Modal/modal';
import ModalHeader from '../../../Generic/Modal/modalHeader';
import ModalBody from '../../../Generic/Modal/modalBody';
import ActivityCard from './activityCard';

class NotesContent extends Component{
    constructor(props){
        super(props);
        this.state = {
            isModalOpen: false
        }
    }

    handleEditorChange = (e) => {
        console.log('Content was updated:', e.target.getContent());
      }

    toggleModal = _ => {
        this.setState(prev => ({
            isModalOpen: !prev.isModalOpen
        }));
    }

    render(){
        return(
            <Fragment>
                <div className="Activities">
                    <button className="Activities-toggleModal" onClick={this.toggleModal}>Create Note</button>
                    <GeneralModal title="Notes" isOpen={this.state.isModalOpen} handleClose={this.toggleModal}>
                        <ModalHeader>
                            
                        </ModalHeader>
                        <ModalBody>
                            <Editor
                                initialValue="<p>This is the initial content of the editor</p>"
                                init={{
                                height: 270,
                                menubar: false,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount'
                                ],
                                toolbar:
                                    'undo redo | formatselect | bold italic backcolor | \
                                    alignleft aligncenter alignright alignjustify | \
                                    bullist numlist outdent indent | removeformat | help'
                                }}
                                onChange={this.handleEditorChange}
                            />
                        </ModalBody>
                    </GeneralModal>
                    <ActivityCard />
                </div>
            </Fragment>
        )
    }
}

export default withApollo(NotesContent);