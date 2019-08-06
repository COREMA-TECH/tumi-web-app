import React, { Component } from "react";
import "react-big-scheduler/lib/css/style.css";
import Scheduler, { SchedulerData, ViewTypes } from "react-big-scheduler";
import withApollo from "react-apollo/withApollo";
import { GET_INITIAL_DATA, GET_SHIFTS } from "./Queries";
import withGlobalContent from "../Generic/Global";
import withDnDContext from "./withDnDContext";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { GET_SHIFT_BY_DATE } from './Queries';
import moment from 'moment';

moment.locale('en', {
    week: {
        dow: 1,
        doy: 1,
    },
});

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
        schedulerWidth: "1366"
    }
);



schedulerData.localeMoment(moment);


let allEvents;
let allResources;

// TODO: create documentation for this component
class Shifts extends Component {
    constructor(props) {
        super(props);


        this.state = {
            viewModel: schedulerData,
            shift: [],
            shiftDetail: [],
            employees: [],
            locations: [],
            eventId: null,
            draftStartDate: '',
            draftEndDate: ''
        };
    }

    getFilterShift = (employeeId) => {
        if (employeeId == 0)
            return {
                shift: {
                    entityId: this.props.location,
                    departmentId: this.props.department
                }
            }
        else return {
            shift: {
                entityId: this.props.location,
                departmentId: this.props.department
            },
            shiftDetailEmployee: {
                EmployeeId: this.props.selectedEmployee.value
            }
        }
    }
    fetchShifts = (employeeId = 0) => {
        this.props.client
            .query({
                query: GET_SHIFTS,
                fetchPolicy: "no-cache",
                variables: {
                    ...this.getFilterShift(employeeId)
                }
            })
            .then(({ data }) => {
                this.setState(
                    {
                        shift: data.shift,
                        shiftDetail: data.ShiftDetail
                    },
                    () => {
                        allEvents = [];
                        allResources = [];
                        let openShiftExist = false;

                        this.state.shiftDetail.map(item => {
                            if (item.detailEmployee !== null) {
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
                                        title: shiftItem.position.Position,
                                        resourceId:
                                            shiftDetailItem.detailEmployee !== null
                                                ? shiftDetailItem.detailEmployee.EmployeeId
                                                : 0,
                                        bgColor: shiftDetailItem.bgColor
                                    });

                                    if (shiftDetailItem.detailEmployee == null) {
                                        openShiftExist = true;
                                    }
                                }
                            });
                        });



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

                        if (openShiftExist) {
                            orderedEmployees.unshift(
                                {
                                    id: 0,
                                    name: "Open Shift"
                                }
                            );
                        }
                        schedulerData.setResources(orderedEmployees);
                        schedulerData.setEvents(allEvents);
                        this.setState(
                            {
                                viewModel: schedulerData,
                                draftStartDate: schedulerData.startDate,
                                draftEndDate: schedulerData.endDate
                            },
                            () => {
                                this.setState({
                                    loading: false
                                });
                                this.getShiftRendered(this.state.draftStartDate, this.state.draftEndDate, this.props.entityId);
                            }
                        );
                    }
                );
            })
            .catch(error => {
                this.props.handleOpenSnackbar("error", "Error to list shifts!");
            });
    };

    getShiftRendered = (startDate, endDate, entityId) => {
        this.props.client
            .query({
                query: GET_SHIFT_BY_DATE,
                fetchPolicy: 'no-cache',
                variables: {
                    startDate: startDate,
                    endDate: endDate,
                    entityId: entityId
                }
            })
            .then(({ data }) => {
                this.props.saveTemplateShift(data.shiftDetailByWeek, startDate, endDate);
            })
            .catch();
    }

    componentWillMount() {
        this.loadShifts();
    }

    loadShifts = () => {
        this.setState(
            {
                loading: true
            },
            () => {
                this.getEmployees();
            }
        );
    };

    componentWillReceiveProps(nextProps) {
        this.filterShifts(
            nextProps.cityId,
            nextProps.shiftId
        );

        if (nextProps.weekDayStart != this.props.weekDayStart) {
            moment.locale('en', {
                week: {
                    dow: nextProps.weekDayStart,
                    doy: nextProps.weekDayStart,
                },
            });
            this.setState((prevState) => {
                let scheduler = prevState.viewModel;
                scheduler.localeMoment(moment);
                scheduler.setViewType(ViewTypes.Day);
                scheduler.setViewType(ViewTypes.Week);
                return { viewModel: scheduler }
            })

            console.log("shifts:::", { weekDayStart: this.props.weekDayStart });
        }
        if (nextProps.location != this.props.location ||
            nextProps.department != this.props.department ||
            nextProps.selectedEmployee.value != this.props.selectedEmployee.value ||
            nextProps.refresh != this.props.refresh) {

            this.setState(
                {
                    loading: true
                },
                () => {
                    this.fetchShifts(nextProps.selectedEmployee.value);
                }
            );
        }

    }

    filterShifts(city, shift) {
        allEvents = [];
        this.state.shift.map(shiftItem => {
            if (
                (shift == null || shift == "null" ? true : shiftItem.id == shift) &&
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
                            title: shiftItem.position.Position,
                            resourceId:
                                shiftDetailItem.detailEmployee !== null
                                    ? shiftDetailItem.detailEmployee.EmployeeId
                                    : 0,
                            bgColor: shiftDetailItem.bgColor
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

    buildParamsEmployees = () => {
        var params;
        var idEntity = this.props.location;
        params.push(idEntity);
        if (this.props.idUsers)
            params
        return params;
    }

    getEmployees = () => {
        this.props.client
            .query({
                query: GET_INITIAL_DATA,
                variables: {
                    idEntity: this.props.location
                }
            })
            .then(({ data }) => {
                //Save data into state
                //--Employees
                this.setState(prevState => {
                    let employees = data.employees.map(item => {
                        return {
                            value: item.id,
                            label: `${item.firstName} ${item.lastName}`
                        };
                    });
                    return { employees };
                });
                //Location
                this.setState(prevState => {
                    return { locations: data.getbusinesscompanies };
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
        const { viewModel } = this.state;

        if (this.state.loading) {
            return <LinearProgress />;
        }

        return (
            <div>
                <Scheduler
                    schedulerData={viewModel}
                    prevClick={this.prevClick}
                    nextClick={this.nextClick}
                    onSelectDate={this.onSelectDate}
                    onViewChange={this.onViewChange}
                    eventItemClick={this.eventClicked}
                    updateEventStart={this.updateEventStart}
                    updateEventEnd={this.updateEventEnd}
                    eventItemTemplateResolver={this.eventItemTemplateResolver}

                />
                <Dialog maxWidth="sm" open={this.props.editConfirmOpened} onClose={this.props.handleClosePreFilter}>
                    <DialogContent>
                        <h2>Do you want edit Shift or Serie?</h2>
                    </DialogContent>
                    <DialogActions>
                        <button className="btn btn-success btn-not-rounded mr-1" type="button" onClick={() => { this.selectTypeEdition(false) }}>
                            Edit Shift
                        </button>
                        <button className="btn btn-default btn-not-rounded" type="button" onClick={() => { this.selectTypeEdition(true) }}>
                            Edit Serie
                        </button>
                        <button className="btn btn-danger btn-not-rounded mr-1" type="button" onClick={this.props.openEditConfirm}>
                            Cancel
                        </button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    prevClick = schedulerData => {
        schedulerData.prev();
        schedulerData.setEvents(allEvents);
        this.setState({
            viewModel: schedulerData,
            draftStartDate: schedulerData.startDate,
            draftEndDate: schedulerData.endDate
        }, () => {
            this.getShiftRendered(this.state.draftStartDate, this.state.draftEndDate, this.props.entityId);
        });
    };

    nextClick = schedulerData => {
        schedulerData.next();
        schedulerData.setEvents(allEvents);
        this.setState({
            viewModel: schedulerData,
            draftStartDate: schedulerData.startDate,
            draftEndDate: schedulerData.endDate
        }, () => {
            this.getShiftRendered(this.state.draftStartDate, this.state.draftEndDate, this.props.entityId);
        });
    };

    onViewChange = (schedulerData, view) => {
        let viewType = view.viewType;
        this.props.changeViewType(viewType)
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
        this.props.openEditConfirm();
        this.setState(() => {
            return { eventId: event.id }
        });
    };

    selectTypeEdition = (type) => {
        let shiftDetailItem = this.state.shiftDetail.find(item => {
            if (item.id === this.state.eventId) {
                return item;
            }
        });

        // Return shiftDetailItem by props
        this.props.getSelectedValue(shiftDetailItem, type);
    }

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

    eventItemTemplateResolver = (schedulerData, event, bgColor, isStart, isEnd, mustAddCssClass, mustBeHeight, agendaMaxEventWidth) => {
        let borderWidth = isStart ? '4' : '0';
        let borderColor = bgColor, backgroundColor = bgColor;
        let titleText = schedulerData.behaviors.getEventTextFunc(schedulerData, event);

        let divStyle = { borderLeft: borderWidth + 'px solid ' + borderColor, backgroundColor: backgroundColor, height: mustBeHeight };
        if (!!agendaMaxEventWidth)
            divStyle = { ...divStyle, maxWidth: agendaMaxEventWidth };

        return <div key={event.id} className={mustAddCssClass} style={divStyle}>
            <span style={{ marginLeft: '4px', lineHeight: `${mustBeHeight}px` }}>{titleText}</span>
        </div>;
    }
}

export default withApollo(withGlobalContent(withDnDContext(Shifts)));