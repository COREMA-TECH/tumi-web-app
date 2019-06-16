import React, { Component } from 'react';
import Grid from './Grid';
import withApollo from "react-apollo/withApollo"; 
import withGlobalContent from 'Generic/Global';
import GridTabModal from './GridTabModal';
import { GET_POSITION } from './Queries';

const uuidv4 = require('uuid/v4');

class GridTabs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...this.DEFAULT_STATE
        }
    }

    DEFAULT_STATE = {
        tabs: [],
        positions: [],
        position: 0,
        positionTags: [],
        open: false
    };

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.position != nextProps.position) {
            this.getPosition(nextProps.position);
        }
    }

    getPosition = (id) => {
        this.props.client.query({
            query: GET_POSITION,
            fetchPolicy: 'no-cache',
            variables: {
                Id: id
            }
        }).then(({ data }) => {
            //Save data into state
            let position = [];
            position.push({
                id: data.getposition[0].Id,
                name: data.getposition[0].Position
            });
            this.setState(prevState => {
                return { positions : position }
            });
        }).catch(error => {
            this.props.handleOpenSnackbar(
                'error',
                'Error loading employees list'
            );
        });
    }

    addTab = (position) => {
        this.setState(prevState => {
            return {
                positions: [...prevState.positions, position]
            }
        });
    }

    openGridModal = () => {
        this.setState(prevState => {
            return { open: true }
        });
    }

    render() {
        return(
            <React.Fragment>
                <div className="GridTab-content">
                    {
                        this.state.positions.map(__position => {
                            return (
                                <Grid positionId={__position.Id} departmentId={this.props.departmentId} />
                            )
                        })
                    }
                </div>
                <div className="GridTab-head">
                    <div class="btn-group" role="group" aria-label="Basic example">
                        {
                            this.state.positions.map(__position => {
                                return (
                                    <button type="button" class="btn btn-secondary">{__position.name}</button>
                                )
                            })
                        }
                        <button type="button" class="btn btn-secondary" onClick={this.openGridModal}>
                            <i className="fa fa-plus"></i>
                        </button>
                    </div>
                </div>
                <GridTabModal open={this.state.open} department={this.props.department} addTab={this.addTab}/>
            </React.Fragment>
        );
    }

}

export default withApollo(withGlobalContent(GridTabs));