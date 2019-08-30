import React, { Component } from 'react';
import Grid from './grid';
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
        open: false,
        tabSelected: 0
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
                return {
                    positions: position,
                    tabSelected: data.getposition[0].Id
                }
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
                positions: [...prevState.positions, position],
                open: false
            }
        });
    }

    openGridModal = () => {
        this.setState(prevState => {
            return { open: true }
        });
    }

    closeGrdiModal = () => {
        this.setState(prevState => {
            return { open: false }
        });
    }

    selectTab = (id) => {
        this.setState(prevState => {
            return { tabSelected: id }
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="GridTab-content">
                    {
                        this.state.positions.map(__position => {
                            return (
                                <div className={this.state.tabSelected === __position.id ? 'd-block' : 'd-none'}>
                                    <Grid weekDayStart={this.props.weekDayStart} entityId={this.props.location} positionId={__position.id} departmentId={this.props.department} handleOpenSnackbar={this.props.handleOpenSnackbar} />
                                </div>
                            )
                        })
                    }
                </div>
                <div className="GridTab-head">
                    <div className="btn-group" role="group" aria-label="Basic example">
                        {
                            this.state.positions.map(__position => {
                                let selected = this.state.tabSelected === __position.id ? 'GridTab-selected' : '';
                                return (
                                    <button type="button" className={`btn btn-secondary ${selected}`} onClick={_ => { this.selectTab(__position.id) }}>{__position.name}</button>
                                )
                            })
                        }
                        <button type="button" className="btn btn-secondary" onClick={this.openGridModal}>
                            <i className="fa fa-plus"></i>
                        </button>
                    </div>
                </div>
                <GridTabModal open={this.state.open} department={this.props.department} addTab={this.addTab} closeGrdiModal={this.closeGrdiModal} />
            </React.Fragment>
        );
    }

}

export default withApollo(withGlobalContent(GridTabs));