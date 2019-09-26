import React, {Component, Fragment} from 'react';
import withApollo from 'react-apollo/withApollo';
import withGlobalContent from "../Generic/Global";

import AddRuleModal from './AddRuleModal';
import RulesTable from './rulesTable';

import {CREATE_RULE, UPDATE_RULE, TOGGLE_ACTIVE_RULE} from './mutations';
import { GET_RULES, GET_OVERLAPS } from './queries';


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
                    ruleToEdit: {},
                    holdOpen: false
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

    findOverlaps = (days, ruleType) => {
        return new Promise((resolve, reject) => {
            this.props.client.query({
                query: GET_OVERLAPS,
                fetchPolicy: "no-cache",
                variables: {
                    days, ruleType
                }
            })
            .then(({data: {overlappingRules}}) => {
                resolve(overlappingRules.length);
            })
            .catch(error => reject(error));
        })
    }

    saveRule = async ({ruleType, ruleName, holidayRule, timeOfDayRule, overtimeRule, holdOpen}) => {        
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

        if(!this.state.isEdition && ruleType.value === 41756){
            const overlaps = await this.findOverlaps(data.days, ruleType.value);
            if (overlaps > 0){
                this.props.handleOpenSnackbar(
                    'error',
                    'Error: There is another rule overlapping the selected days',
                    'bottom',
                    'center'
                ); 

                return;
            }
        }

        if(!this.state.isEdition){
            this.createRule(data, ruleName, holdOpen);
        } else{
            this.updateRule(this.state.ruleToEdit.id, data, ruleName);            
        }
    }

    createRule = (data, ruleName, holdOpen) => {
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
            
            if(!holdOpen){
                this.toggleModal();
            }

            this.fetchRules();
        })
        .catch(error => {
            this.props.handleOpenSnackbar(
                'error',
                `Error: ${error}`,
                'bottom',
                'center'
            );
            
            if(!holdOpen){
                this.toggleModal();
            }
            this.fetchRules();
        })            
           
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

    toggleActiveRule = (id, isActive = false) => {
        this.props.client.mutate({
            mutation: TOGGLE_ACTIVE_RULE,
            variables: {
                id, isActive
            }
        })
        .then(_ => {
            this.props.handleOpenSnackbar(
                'success',
                `Rule has been ${isActive ? 'enabled' : 'disabled'}`,
                'bottom',
                'center'
            );            
            this.fetchRules();
        })
        .catch(error => {
            this.props.handleOpenSnackbar(
                'error',
                `Error: ${error}`,
                'bottom',
                'center'
            );
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
                    setHoldModalOpen={this.setHoldModalOpen}
                />                

                <div className="row">
                    <div className="col-md-12">
                        <button className="btn btn-success Break-add float-right" onClick={this.toggleModal}>
                            <i class="fas fa-plus"></i>
                            &nbsp; Add Rule
                        </button> 
                    </div>
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                Business Preferences
                            </div>
                            <div className="card-body">
                                <div className="row">                                    
                                    <div className="col-md-12">
                                        <div className="tumi-forcedResponsiveTable Breaks-tableWrapper">
                                            <RulesTable 
                                                handleEdit={this.handleEdit}
                                                businessRules={this.state.businessRules}
                                                toggleActiveRule={this.toggleActiveRule}
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