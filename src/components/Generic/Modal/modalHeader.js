import React, {Fragment, Component} from 'react';

const GenericModalHeader = props => {
    return(
        <Fragment>
            <div className="genModal-header">
                {props.children}
            </div>            
        </Fragment>
    )
}

export default GenericModalHeader;