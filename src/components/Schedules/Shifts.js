import React, {Component} from "react";
import "react-big-scheduler/lib/css/style.css";
import Scheduler, {SchedulerData, ViewTypes} from "react-big-scheduler";
import withApollo from "react-apollo/withApollo";
import {GET_INITIAL_DATA, GET_SHIFTS} from "./Queries";
import withGlobalContent from "../Generic/Global";
import withDnDContext from "./withDnDContext";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";

let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1; //January is 0!
let yyyy = today.getFullYear();

if (dd < 10) {
    dd = '0' + dd
}

if (mm < 10) {
    mm = '0' + mm
}

today = yyyy + '-' + mm + '-' + dd;
let schedulerData = new SchedulerData(
    today,
    ViewTypes.Week,
    false,
    false,
    {
        views: [
            {
                viewName: "Day",
                viewType: ViewTypes.Day,
                showAgenda: true,
                isEventPerspective: false
            },
            {
                viewName: "Week",
                viewType: ViewTypes.Week,
                showAgenda: false,
                isEventPerspective: false
            },
            {
                viewName: "Month",
                viewType: ViewTypes.Month,
                showAgenda: false,
                isEventPerspective: true
            }
        ],
        schedulerWidth: "1500"
    }
);

let allEvents;
let allResources;

// TODO: create documentation for this component
class Shifts extends Component {
    constructor(props) {
        super(props);

        schedulerData.localeMoment.locale("en");

        this.state = {
            viewModel: schedulerData,
            shift: [],
            shiftDetail: [],
            employees: [],
            locations: []
        };
    }

    fetchShifts = () => {
        this.props.client
            .query({
                query: GET_SHIFTS,
                fetchPolicy: "no-cache"
            })
            .then(({data}) => {
                this.setState(
                    {
                        shift: data.shift,
                        shiftDetail: data.ShiftDetail
                    },
                    () => {
                        allEvents = [];
                        allResources = [];

                        this.state.shiftDetail.map(item => {
                            if (item.detailEmployee !== null) {
                                console.log("item.detailEmployee ", item.detailEmployee);
                                console.log(this.state.loading);

                                let employee = this.getSelectedEmployee(
                                    item.detailEmployee.EmployeeId
                                );

                                if (employee) {
                                    allResources.push({
                                        id:
                                            item.detailEmployee == null
                                                ? 0
                                                : item.detailEmployee.EmployeeId,
                                        name: employee.label
                                    });
                                }
                            }
                        });
                        this.state.shift.map(shiftItem => {
                            this.state.shiftDetail.map(shiftDetailItem => {
                                if (shiftItem.id === shiftDetailItem.ShiftId) {
                                    allEvents.push({
                                        id: shiftDetailItem.id,
                                        start:
                                            shiftDetailItem.start.substring(0, 10) +
                                            " " +
                                            shiftDetailItem.startTime,
                                        end:
                                            shiftDetailItem.end.substring(0, 10) +
                                            " " +
                                            shiftDetailItem.endTime,
                                        title: shiftItem.title,
                                        resourceId:
                                            shiftDetailItem.detailEmployee !== null
                                                ? shiftDetailItem.detailEmployee.EmployeeId
                                                : 0,
                                        bgColor: shiftItem.bgColor
                                    });
                                }
                            });
                        });

                        schedulerData.setEvents(allEvents);

                        let result = allResources.reduce((unique, o) => {
                            if (!unique.some(obj => obj.id === o.id && obj.name === o.name)) {
                                unique.push(o);
                            }
                            return unique;
                        }, []);

                        let orderedEmployees = result.sort(function (a, b) {
                            return a.name.toLowerCase() > b.name.toLowerCase()
                                ? 1
                                : b.name.toLowerCase() > a.name.toLowerCase()
                                    ? -1
                                    : 0;
                        });

                        orderedEmployees.unshift(
                            {
                                id: 0,
                                name: "Open Shift"
                            }
                        );
                        schedulerData.setResources(orderedEmployees);

                        this.setState(
                            {
                                viewModel: schedulerData
                            },
                            () => {
                                this.setState({
                                    loading: false
                                });
                            }
                        );
                    }
                );
            })
            .catch(error => {
                this.props.handleOpenSnackbar("error", "Error to list shifts!");
            });
    };

    componentWillMount() {
        this.loadShifts();
    }

    loadShifts = () => {
        this.setState(
            {
                loading: true
            },
            () => {
                console.log(this.state.loading);
                this.getEmployees();
            }
        );
    };

    componentWillReceiveProps(nextProps) {
        this.filterShifts(
            nextProps.cityId,
            nextProps.positionId,
            nextProps.shiftId
        );

        console.log("Next prop", nextProps.refresh);
        console.log("This prop", this.props.refresh);

        if (nextProps.refresh != this.props.refresh) {
            this.setState(
                {
                    loading: true
                },
                () => {
                    this.fetchShifts();
                }
            );
        }

        console.log(
            nextProps.cityId,
            " ",
            nextProps.positionId,
            " ",
            nextProps.shiftId
        );
    }

    filterShifts(city, position, shift) {
        allEvents = [];
        this.state.shift.map(shiftItem => {
            if (
                (shift == null || shift == "null" ? true : shiftItem.id == shift) &&
                (position == null || position == "null"
                    ? true
                    : shiftItem.idPosition == position) &&
                (city == null || city == "null" ? true : shiftItem.company.City == city)
            ) {
                this.state.shiftDetail.map(shiftDetailItem => {
                    if (shiftItem.id === shiftDetailItem.ShiftId) {
                        allEvents.push({
                            id: shiftDetailItem.id,
                            start:
                                shiftDetailItem.start.substring(0, 10) +
                                " " +
                                shiftDetailItem.startTime,
                            end:
                                shiftDetailItem.end.substring(0, 10) +
                                " " +
                                shiftDetailItem.endTime,
                            title: shiftItem.title,
                            resourceId:
                                shiftDetailItem.detailEmployee !== null
                                    ? shiftDetailItem.detailEmployee.EmployeeId
                                    : 0,
                            bgColor: shiftItem.bgColor
                        });
                    }
                });
            }
        });

        schedulerData.setEvents(allEvents);
        this.setState(
            {
                loading: true
            },
            () => {
                this.setState(
                    {
                        viewModel: schedulerData
                    },
                    () => {
                        this.setState({
                            loading: false
                        });
                    }
                );
            }
        );
    }

    getEmployees = () => {
        this.props.client
            .query({
                query: GET_INITIAL_DATA
            })
            .then(({data}) => {
                //Save data into state
                //--Employees
                this.setState(prevState => {
                    let employees = data.employees.map(item => {
                        return {
                            value: item.id,
                            label: `${item.firstName} ${item.lastName}`
                        };
                    });
                    return {employees};
                });
                //Location
                this.setState(prevState => {
                    return {locations: data.getbusinesscompanies};
                });

                this.fetchShifts();
            })
            .catch(error => {
                this.props.handleOpenSnackbar(
                    "error",
                    "Error loading employees list and loading shifts",
                    "bottom",
                    "right"
                );

                this.setState({
                    loading: false
                });
            });
    };

    getSelectedEmployee = id => {
        return this.state.employees.find(item => item.value == id);
    };

    render() {
        const {viewModel} = this.state;

        if (this.state.loading) {
            return <LinearProgress/>;
        }

        return (
            <Scheduler
                schedulerData={viewModel}
                prevClick={this.prevClick}
                nextClick={this.nextClick}
                onSelectDate={this.onSelectDate}
                onViewChange={this.onViewChange}
                eventItemClick={this.eventClicked}
                updateEventStart={this.updateEventStart}
                updateEventEnd={this.updateEventEnd}
                //moveEvent={this.moveEvent}
                //newEvent={this.newEvent}
            />
        );
    }

    prevClick = schedulerData => {
        schedulerData.prev();
        schedulerData.setEvents(allEvents);
        this.setState({
            viewModel: schedulerData
        });
    };

    nextClick = schedulerData => {
        schedulerData.next();
        schedulerData.setEvents(allEvents);
        this.setState({
            viewModel: schedulerData
        });
    };

    onViewChange = (schedulerData, view) => {
        schedulerData.setViewType(
            view.viewType,
            view.showAgenda,
            view.isEventPerspective
        );
        schedulerData.setEvents(allEvents);
        this.setState({
            viewModel: schedulerData
        });
    };

    onSelectDate = (schedulerData, date) => {
        schedulerData.setDate(date);
        schedulerData.setEvents(allEvents);
        this.setState({
            viewModel: schedulerData
        });
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
        alert(
            `You just executed ops1 to event: {id: ${event.id}, title: ${
                event.title
                }}`
        );
    };

    newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
        let newFreshId = 0;
        schedulerData.events.forEach(item => {
            if (item.id >= newFreshId) newFreshId = item.id + 1;
        });

        let newEvent = {
            id: newFreshId,
            title: "New event you just created",
            start: start,
            end: end,
            resourceId: slotId,
            bgColor: "purple"
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
        });
    };

    updateEventEnd = (schedulerData, event, newEnd) => {
        // if (confirm(`Do you want to adjust the end of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`)) {
        schedulerData.updateEventEnd(event, newEnd);

        this.setState({
            viewModel: schedulerData
        });
    };

    moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
        //if (confirm(`Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`)) {
        schedulerData.moveEvent(event, slotId, slotName, start, end);
        this.setState({
            viewModel: schedulerData
        });
    };
}

export default withApollo(withGlobalContent(withDnDContext(Shifts)));