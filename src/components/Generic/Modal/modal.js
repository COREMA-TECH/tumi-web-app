import React, {Fragment, Component} from 'react';

const GenericModal = props => {
    return(
        <Fragment>
            <div className={`genModal ${props.isOpen ? "open" : ""}`}>
                <div className="genModal-headbar">
                    <span className="genModal-title">{props.title}</span>
                    <span className="genModal-close float-right" onClick={props.handleClose}>&times;</span>
                </div>
                {props.children}
            </div>
        </Fragment>
    )
}

export default GenericModal;