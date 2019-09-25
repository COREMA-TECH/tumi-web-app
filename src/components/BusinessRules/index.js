import React, {Component, Fragment} from 'react';
import withApollo from 'react-apollo/withApollo';
import withGlobalContent from "../Generic/Global";

import AddRuleModal from './AddRuleModal';
import RulesTable from './rulesTable';

import {CREATE_RULE, UPDATE_RULE} from './mutations';
import { GET_RULES } from './queries';


class BusinessRules extends Component{
    INITIAL_STATE = {
        isModalOpen: false,
        ruleToEdit: {},
        isEdition: false,
        businessRules: []        
    }

    constructor(props){
        super(props);
        this.state = {...this.INITIAL_STATE}
        this.fetchRules();
    }

    toggleModal = _ => {
        this.setState(prevState => ({
            isModalOpen: !prevState.isModalOpen
        }), _ => {
            if(!this.state.isModalOpen){
                this.setState(_ => ({
                    isEdition: false,
                    ruleToEdit: {}
                }))
            }
        });
    }

    handleEdit = item => {
        this.setState(_ => ({ ruleToEdit: item, isEdition: true }), this.toggleModal);
    }

    fetchRules = _ => {
        this.props.client.query({
            query: GET_RULES,
            fetchPolicy: "no-cache"
        })
        .then(({data: {businessRules}}) => {
            this.setState(_ => ({
                businessRules
            }));
        })
        .catch(error => {
            this.props.handleOpenSnackbar(
                'error',
                `Error: ${error}`,
                'bottom',
                'center'
            );
        })
    }

    saveRule = ({ruleType, ruleName, holidayRule, timeOfDayRule, overtimeRule}) => {        
        let data = {};        

        switch(ruleType.value){
            case 41755:
                data = {catalogItemId: ruleType.value, ...holidayRule}               
                break;

            case 41757:
                data = {catalogItemId: ruleType.value, ...overtimeRule}               
                break;
                
            case 41756:
                data = {catalogItemId: ruleType.value, ...timeOfDayRule}               
                break;
        }

        if(!this.state.isEdition){            
            this.createRule(data, ruleName);
        } else{
            this.updateRule(this.state.ruleToEdit.id, data, ruleName);            
        }
    }

    createRule = (data, ruleName) => {
        this.props.client.mutate({
            mutation: CREATE_RULE,
            variables: {
                input: { ...data, name: ruleName }
            },
            refetchQueries: [{
                query: GET_RULES
            }]

        })
        .then(_ => {
            this.props.handleOpenSnackbar(
                'success',
                'Saved Successfully',
                'bottom',
                'center'
            );            
            this.toggleModal();
            this.fetchRules();
        })
        .catch(error => {
            this.props.handleOpenSnackbar(
                'error',
                `Error: ${error}`,
                'bottom',
                'center'
                );
            })
            
            this.toggleModal();
            this.fetchRules();
    }

    updateRule = (id, data, ruleName) => {
        this.props.client.mutate({
            mutation: UPDATE_RULE,
            variables: {
                id,
                input: { ...data, name: ruleName }
            },
            refetchQueries: [{
                query: GET_RULES
            }]

        })
        .then(_ => {
            this.props.handleOpenSnackbar(
                'success',
                'Saved Successfully',
                'bottom',
                'center'
            );            
            this.toggleModal();
            this.fetchRules();
        })
        .catch(error => {
            this.props.handleOpenSnackbar(
                'error',
                `Error: ${error}`,
                'bottom',
                'center'
            );
            this.toggleModal();
            this.fetchRules();
        })
    }

    render(){
        return (
            <Fragment>
                <AddRuleModal 
                    isModalOpen={this.state.isModalOpen}
                    toggleModal={this.toggleModal}
                    saveRule={this.saveRule}
                    isEdition={this.state.isEdition}
                    ruleToEdit={this.state.ruleToEdit}
                />                

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                Business Preferences
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <button className="btn btn-success Break-add float-right" onClick={this.toggleModal}>
                                            <i class="fas fa-plus"></i>
                                            &nbsp; Add Rule
                                        </button> 
                                    </div>
                                    <div className="col-md-12">
                                        <div className="tumi-forcedResponsiveTable Breaks-tableWrapper">
                                            <RulesTable 
                                                handleEdit={this.handleEdit}
                                                businessRules={this.state.businessRules}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default withApollo(withGlobalContent(BusinessRules));;