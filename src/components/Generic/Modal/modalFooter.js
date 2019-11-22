import React, {Fragment, Component} from 'react';

const GenericModalFooter = props => {
    return(
        <Fragment>
            <div className="genModal-footer">
                {props.children}
            </div>            
        </Fragment>
    )
}

export default GenericModalFooter;