import React, { Component } from 'react';
import 'react-big-scheduler/lib/css/style.css';
import Scheduler, { DemoData, SchedulerData, ViewTypes } from 'react-big-scheduler';
import withApollo from "react-apollo/withApollo";
import { GET_SHIFTS } from "./Queries";
import withGlobalContent from "../../Generic/Global";
import withDnDContext from "./withDnDContext";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import { INSERT_SHIFT, CHANGE_STATUS_SHIFT } from './Mutations';

let schedulerData = new SchedulerData('2018-12-08', ViewTypes.Week, false, false, {
    views: [
        { viewName: 'Day', viewType: ViewTypes.Day, showAgenda: true, isEventPerspective: false },
        { viewName: 'Week', viewType: ViewTypes.Week, showAgenda: false, isEventPerspective: false },
        { viewName: 'Month', viewType: ViewTypes.Month, showAgenda: false, isEventPerspective: true },
        { viewName: 'Year', viewType: ViewTypes.Year, showAgenda: false, isEventPerspective: false },
    ],
    schedulerWidth: '1500',
});

let allEvents;

class Shifts extends Component {
    constructor(props) {
        super(props);

        schedulerData.localeMoment.locale('en');
        schedulerData.setResources(DemoData.resources);
        schedulerData.setEvents(DemoData.events);

        this.state = {
            viewModel: schedulerData,
            shift: [],
            shiftDetail: [],
        }
    }

    fetchShifts = () => {
        this.props.client
            .query({
                query: GET_SHIFTS
            })
            .then(({ data }) => {
                this.setState({
                    shift: data.shift,
                    shiftDetail: data.ShiftDetail,
                }, () => {
                    allEvents = [];
                    this.state.shift.map(shiftItem => {
                        this.state.shiftDetail.map(shiftDetailItem => {

                            if (shiftItem.id === shiftDetailItem.ShiftId) {
                                allEvents.push({
                                    id: shiftDetailItem.id,
                                    start: shiftDetailItem.start.substring(0, 10) + ' ' + shiftDetailItem.startTime,
                                    end: shiftDetailItem.end.substring(0, 10) + ' ' + shiftDetailItem.endTime,
                                    title: shiftItem.title,
                                    resourceId: 'r2',
                                    // bgColor: shiftItem.bgColor
                                    bgColor: shiftItem.bgColor,
                                    ShiftId: shiftDetailItem.ShiftId
                                })
                            }
                        })
                    });

                    console.table(allEvents);
                    schedulerData.setEvents(allEvents);
                    this.setState({
                        viewModel: schedulerData
                    }, () => {
                        this.setState({
                            loading: false
                        });
                    })
                })
            })
            .catch(error => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to list shifts!',
                );
            })
    };

    componentWillMount() {
        this.loadShifts();
    }

    loadShifts = () => {
        this.setState({
            loading: true
        }, () => {
            this.fetchShifts()
        });
    };

    componentWillReceiveProps(nextProps) {
        this.filterShifts(nextProps.cityId, nextProps.positionId, nextProps.shiftId);

        console.log(nextProps.cityId, " ", nextProps.positionId, " ", nextProps.shiftId);
    }

    filterShifts(city, position, shift) {
        allEvents = [];
        this.state.shift.map(shiftItem => {
            if (
                (shift == null || shift == "null" ? true : shiftItem.id == shift) &&
                (position == null || position == "null" ? true : shiftItem.idPosition == position) &&
                (city == null || city == "null" ? true : shiftItem.company.City == city)
            ) {
                console.log("TRUE VALUES");
                this.state.shiftDetail.map(shiftDetailItem => {

                    if (shiftItem.id === shiftDetailItem.ShiftId) {
                        allEvents.push({
                            id: shiftDetailItem.id,
                            start: shiftDetailItem.start.substring(0, 10) + ' ' + shiftDetailItem.startTime,
                            end: shiftDetailItem.end.substring(0, 10) + ' ' + shiftDetailItem.endTime,
                            title: shiftItem.title,
                            resourceId: 'r2',
                            bgColor: shiftItem.bgColor,
                            ShiftId: shiftDetailItem.ShiftId
                        })
                    }
                })
            }
        });

        schedulerData.setEvents(allEvents);
        this.setState({
            loading: true
        }, () => {
            this.setState({
                viewModel: schedulerData
            }, () => {
                this.setState({
                    loading: false
                });
            })
        });
    }

    render() {
        const { viewModel } = this.state;

        if (this.state.loading) {
            return <LinearProgress />
        }

        return (
            <Scheduler schedulerData={viewModel}
                prevClick={this.prevClick}
                nextClick={this.nextClick}
                onSelectDate={this.onSelectDate}
                onViewChange={this.onViewChange}
                eventItemClick={this.eventClicked}
                viewEventClick={this.ops1}
                viewEventText="Approved"
                viewEvent2Text="Rejected"
                viewEvent2Click={this.ops2}
                updateEventStart={this.updateEventStart}
                updateEventEnd={this.updateEventEnd}
            //moveEvent={this.moveEvent}
            //newEvent={this.newEvent}
            />
        );
    };

    prevClick = (schedulerData) => {
        schedulerData.prev();
        schedulerData.setEvents(allEvents);
        this.setState({
            viewModel: schedulerData
        })
    };

    nextClick = (schedulerData) => {
        schedulerData.next();
        schedulerData.setEvents(allEvents);
        this.setState({
            viewModel: schedulerData
        })
    };

    onViewChange = (schedulerData, view) => {
        schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
        schedulerData.setEvents(allEvents);
        this.setState({
            viewModel: schedulerData
        })
    };

    onSelectDate = (schedulerData, date) => {
        schedulerData.setDate(date);
        schedulerData.setEvents(allEvents);
        this.setState({
            viewModel: schedulerData
        })
    };

    eventClicked = (schedulerData, event) => {
        // Find shift detail state property
        let shiftDetailItem = this.state.shiftDetail.find(item => {
            if (item.id === event.id) {
                return item;
            }
        });

        // Return shiftDetailItem by props
        this.props.getSelectedValue(shiftDetailItem);
    };

    ops1 = (schedulerData, event) => {
        this.props.client
            .mutate({
                mutation: CHANGE_STATUS_SHIFT,
                variables: {
                    id: event.ShiftId,//this.state.id,
                    status: 2,
                    color: "#114bff"
                }
            })
            .then((data) => {
                this.loadShifts();
                this.props.handleOpenSnackbar('success', 'Shift approved successfully!');
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error approved Shift');
            });
    };

    ops2 = (schedulerData, event) => {
        this.props.client
            .mutate({
                mutation: CHANGE_STATUS_SHIFT,
                variables: {
                    id: event.ShiftId,//this.state.id,
                    status: 3,
                    color: "#cccccc"
                }
            })
            .then((data) => {
                this.loadShifts();
                this.props.handleOpenSnackbar('success', 'Shift rejected successfully!');
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error rejected Shift');
            });
    };

    newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
        let newFreshId = 0;
        schedulerData.events.forEach((item) => {
            if (item.id >= newFreshId)
                newFreshId = item.id + 1;
        });

        let newEvent = {
            id: newFreshId,
            title: 'New event you just created',
            start: start,
            end: end,
            resourceId: slotId,
            bgColor: 'purple'
        };

        schedulerData.addEvent(newEvent);
        this.setState({
            viewModel: schedulerData
        });
    };

    updateEventStart = (schedulerData, event, newStart) => {
        // if (confirm(`Do you want to adjust the start of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newStart: ${newStart}}`)) {
        schedulerData.updateEventStart(event, newStart);

        this.setState({
            viewModel: schedulerData
        })
    };

    updateEventEnd = (schedulerData, event, newEnd) => {
        // if (confirm(`Do you want to adjust the end of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`)) {
        schedulerData.updateEventEnd(event, newEnd);

        this.setState({
            viewModel: schedulerData
        })
    };

    moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
        //if (confirm(`Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`)) {
        schedulerData.moveEvent(event, slotId, slotName, start, end);
        this.setState({
            viewModel: schedulerData
        })
    };
}

export default withApollo(withGlobalContent(withDnDContext(Shifts)));