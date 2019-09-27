import React, { Component } from 'react';
import Grid from './grid';
import withApollo from "react-apollo/withApollo";
import withGlobalContent from 'Generic/Global';
import GridTabModal from './GridTabModal';
import { GET_POSITION, GET_SCHEDULES_TAB_POSITIONS_QUERY } from './Queries';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';

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
        tabSelected: 0,
        daysOfWeek: [],
        weekStart: 0,
        weekEnd: 6
    };

    getPosition = (id) => {
        this.props.client.query({
            query: GET_POSITION,
            fetchPolicy: 'no-cache',
            variables: {
                Id: id
            }
        }).then(({ data }) => {
            if (data.getposition.length > 0) {
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
                }, this.getPositionsWithWorkOrder);
            }
        }).catch(error => {
            this.props.handleOpenSnackbar(
                'error',
                'Error loading positions with work order'
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

    componentWillMount() {
        this.getPosition(this.props.position || 0);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.position != this.props.position)
            this.getPosition(nextProps.position);
    }

    renderTabContent = () => {
        let position = this.state.positions.find(__position => __position.id === this.state.tabSelected);
        if (position)
            return <Grid weekDayStart={this.props.weekDayStart} entityId={this.props.location} positionId={position.id} departmentId={this.props.department} handleOpenSnackbar={this.props.handleOpenSnackbar} />
        else return <React.Fragment></React.Fragment>
    }

    getWeekDays = (newCurrentDate) => {
        let currentDate = moment.utc();

        if (newCurrentDate) {
            currentDate = moment.utc(newCurrentDate);
        }

        let weekStart = currentDate.clone().day(this.props.weekDayStart);

        let weekEnd = weekStart.clone().add('days', 6);

        let days = [];
        for (let i = 0; i <= 6; i++) {
            let date = moment.utc(weekStart).add(i, 'days');
            days.push({ index: i, label: date.format("MMMM Do,dddd"), date: date.format("YYYY-MM-DD") });
        };

        return {
            daysOfWeek: days,
            weekStart: weekStart.subtract(6, 'days'),
            weekEnd: weekEnd
        }
    }

    getPositionsWithWorkOrder = () => {
        this.setState((prevState) => ({ ...prevState, ...this.getWeekDays() }), () => {
            this.props.client.query({
                query: GET_SCHEDULES_TAB_POSITIONS_QUERY,
                fetchPolicy: 'no-cache',
                variables: {
                    IdEntity: this.props.location,
                    departmentId: this.props.department,
                    startDate: this.state.daysOfWeek[0].date,
                    endDate: this.state.daysOfWeek[6].date
                }
            }).then(({ data: { positionsWithWorkOrders } }) => {
                let myPositions = [...this.state.positions];
                positionsWithWorkOrders.forEach(_ => {
                    if (!this.state.positions.find(position => position.id === _.Id)) {
                        myPositions.push({ id: _.Id, name: _.Position })
                    }
                });
                this.setState(() => ({ positions: myPositions }));
            }).catch(error => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error loading positions list'
                );
            });
        });

    }

    render() {
        return (
            <React.Fragment>
                <div className="GridTab-content">
                    {this.renderTabContent()}
                </div>
                <div className="GridTab-head">
                    <div className="btn-group GridTab-Group" role="group" aria-label="Basic example">
                        {
                            this.state.positions.map(__position => {
                                let selected = this.state.tabSelected === __position.id ? 'GridTab-selected' : '';
                                return (
                                    <button type="button" className={`btn btn-secondary ${selected}`} onClick={_ => { this.selectTab(__position.id) }}>{__position.name}</button>
                                )
                            })
                        }
                        <Tooltip title="Add Position Schedules">
                            <button type="button" className="btn btn-secondary" onClick={this.openGridModal}>
                                <i className="fa fa-plus"></i>
                            </button>
                        </Tooltip>
                    </div>
                </div>
                <GridTabModal open={this.state.open} department={this.props.department} addTab={this.addTab} closeGrdiModal={this.closeGrdiModal} />
            </React.Fragment>
        );
    }

}

export default withApollo(withGlobalContent(GridTabs));