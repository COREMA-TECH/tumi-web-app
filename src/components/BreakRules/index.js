import React, {Component} from 'react';
import withApollo from 'react-apollo/withApollo';
import BreaksTable from './breaksTable';
import BreakRulesModal from './breakRulesModal';

class BreakRules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openModal: true
        }
    }

    openModal = _ => {
        this.setState(_ => {
            return { openModal: true }
        })
    }

    handleModalClose = _ => {
        this.setState(_ => {
            return { openModal: false }
        })
    }

    handleModalSubmit = event => {
        event.preventDefault();
    }

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
                                <i class="fas fa-coffee"></i>
                            </div>
                            <div className="Breaks-descInfo d-inline-block">
                                <span className="Breaks-descTitle d-block">
                                    Breaks
                                </span>
                                <span className="Breaks-descText d-block">
                                    Set up break rules for employee meals and rest periods.
                                </span>
                            </div>
                        </div>
                        <button className="btn btn-success Break-add" onClick={this.openModal}>
                            <i class="fas fa-plus"></i>
                            &nbsp; Add Break Rule
                        </button>    
                        <div className="tumi-forcedResponsiveTable Breaks-tableWrapper">
                            <BreaksTable />
                        </div>
                    </div>
                </div>
                <BreakRulesModal 
                    openModal={this.state.openModal}
                    handleClose={this.handleModalClose}
                    handleSubmit={this.handleModalSubmit}
                />
            </React.Fragment>
        );
    }
}

export default withApollo(BreakRules);