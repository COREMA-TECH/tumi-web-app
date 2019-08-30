import React, {Component} from 'react';
import withApollo from 'react-apollo/withApollo';
import BreaksTable from './breaksTable';
import BreakRulesModal from './breakRulesModal';
import { GET_EMPLOYEES, GET_BREAK_RULES } from './queries';

class BreakRules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openModal: false,
            employeeList: [],
            breakRules: [],
            breakRuleToEdit: {},
            isRuleEdit: false
        }
    }

    refreshComponent = _ => {
        this.getBreakRules();
    }

    openModal = _ => {
        this.setState(_ => {
            return { openModal: true }
        })
    }

    setRuleToEdit = rule => {
        this.setState(_ => {
            return { breakRuleToEdit: rule, isRuleEdit: true, openModal: true }
        });
    }

    handleModalClose = _ => {
        this.setState(_ => {
            return { openModal: false, breakRuleToEdit: null, isRuleEdit: false, }
        }, this.refreshComponent());
    }

    handleModalSubmit = event => {
        event.preventDefault();
    }

    componentWillMount() {
        this.getEmployees();
        this.getBreakRules();
    }

    getEmployees = _ => {
        //Fetch employees
        this.props.client.query({
            query: GET_EMPLOYEES,
            variables: { idEntity: this.props.companyId },
            fetchPolicy: 'no-cache'
        })
        
        .then(({ data }) => {
            this.setState({
                employeeList: data.employees
            });
        })
        
        .catch(error => console.log(error));
    }

    getBreakRules = _ => {
        //Fetch break rules for this company
        this.props.client.query({
            query: GET_BREAK_RULES,
            variables: { businessCompanyId: this.props.companyId },
            fetchPolicy: 'no-cache'
        })

        .then(({data}) => {
            this.setState(_ => {
                return { breakRules: data.breakRules }
            }, _ => console.log(''))
        })
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
                            <BreaksTable 
                                breakRules={this.state.breakRules}
                                refresh={this.refreshComponent}
                                setRuleToEdit={this.setRuleToEdit}
                                employeeCount={this.state.employeeList.length}
                            />
                        </div>
                    </div>
                </div>
                <BreakRulesModal 
                    openModal={this.state.openModal}
                    handleClose={this.handleModalClose}
                    handleSubmit={this.handleModalSubmit}
                    employeeList={this.state.employeeList}
                    businessCompanyId={this.props.companyId}
                    breakRuleToEdit={this.state.breakRuleToEdit}
                    isRuleEdit={this.state.isRuleEdit}
                    refresh={this.refreshComponent}
                />
            </React.Fragment>
        );
    }
}

export default withApollo(BreakRules);