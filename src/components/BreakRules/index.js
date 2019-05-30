import React, {Component} from 'react';
import withApollo from 'react-apollo/withApollo';

class BreakRules extends Component {
    render(){
        return(
            <React.Fragment>
                <div className="card Breaks">
                    <div className="card-header">
                        Breaks Preferences
                    </div>
                    <div className="card-body">
                        <div className="Breaks-desc">
                            <div className="Breaks-mug">
                                <i class="fas fa-plus"></i>
                            </div>
                            <div className="Breaks-descInfo d-block">
                                <span className="Breaks-descTitle">
                                    Breaks
                                </span>
                                <span className="Breaks-descText d-block">
                                    Set up break rules for employee meals and rest periods.
                                </span>
                            </div>
                        </div>
                        <button className="Break-add">
                            <i class="fas fa-plus"></i>
                            Add Break Rule
                        </button>                        
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withApollo(BreakRules);