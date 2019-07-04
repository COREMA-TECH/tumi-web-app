import React from 'react';
import ExternalApply from './StepperApplyForm';

const LinkWrapper = props => {
    return (
        <React.Fragment>
            <div style={{ 
                position: 'absolute', top: '0', left: '0', width: '100%'
             }} >
                <ExternalApply 
                    allowSearch={true}
                />
            </div>
        </React.Fragment>
    )
}

export default LinkWrapper;