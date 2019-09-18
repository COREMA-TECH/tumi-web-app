import React, {Component, Fragment} from 'react';
import AddRuleModal from './AddRuleModal';

class BusinessRules extends Component{
    render(){
        return (
            <Fragment>
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            <AddRuleModal />
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default BusinessRules;