import React, {Fragment} from 'react';
import StepperApplyForm from './StepperApplyForm';

const ExternalAppWrapper = props => {
    return (
        <Fragment>
            <StepperApplyForm isInternalCall={true} />
        </Fragment>
    );
}

export default ExternalAppWrapper;