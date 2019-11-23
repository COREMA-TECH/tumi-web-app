import React, {Fragment, Component} from 'react';

const GenericModalBody = props => {
    return(
        <Fragment>
            <div className="genModal-body">
                {props.children}
            </div>            
        </Fragment>
    )
}

export default GenericModalBody;