import Form from './Form.js';
import React, { Component } from 'react';
import Scheduler, { SchedulerData, ViewTypes, DATE_FORMAT, DemoData } from 'react-big-scheduler';
import 'react-big-scheduler/lib/css/style.css';
import moment from 'moment';

class Schedules extends Component {

    constructor(props) {
        super(props);

        let schedulerData = new SchedulerData('2017-12-18', ViewTypes.Week, false, false, {
            views: [
                { viewName: 'Day(Agenda)', viewType: ViewTypes.Day, showAgenda: true, isEventPerspective: false },
                { viewName: 'Week', viewType: ViewTypes.Week, showAgenda: false, isEventPerspective: false },
                { viewName: 'Month(TaskView)', viewType: ViewTypes.Month, showAgenda: false, isEventPerspective: true },
                { viewName: 'Year', viewType: ViewTypes.Year, showAgenda: false, isEventPerspective: false },
            ],
            schedulerWidth: '1500',
        });
        schedulerData.localeMoment.locale('en');
        schedulerData.setResources(DemoData.resources);
        schedulerData.setEvents(DemoData.eventsForCustomEventStyle);
        this.state = {
            viewModel: schedulerData
        }
    }

    render() {
        const { viewModel } = this.state;
        return (
            <div className="MasterShift">
                <div className="row">
                    <div className="col-md-2">
                        <div className="MasterShift-formWrapper">
                            <div className="MasterShift-options">

                            </div>
                            <Form />
                        </div>
                    </div>
                    <div className="col-md-10">
                        <div className="MasterShift-schedules">
                            <div className="MasterShift-schedulesHeader">
                                <form action="">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <select name="state" id="" className="form-control">
                                                <option value="">Select a Option</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <select name="position" id="" className="form-control">
                                                <option value="">Select a Option</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <select name="shifts" id="" className="form-control">
                                                <option value="">Select a Option</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="MasterShift-schedulesBody">
                                <Scheduler schedulerData={viewModel}
                                    prevClick={this.prevClick}
                                    nextClick={this.nextClick}
                                    onSelectDate={this.onSelectDate}
                                    onViewChange={this.onViewChange}
                                    eventItemClick={this.eventClicked}
                                    viewEventClick={this.ops1}
                                    viewEventText="Ops 1"
                                    viewEvent2Text="Ops 2"
                                    viewEvent2Click={this.ops2}
                                    updateEventStart={this.updateEventStart}
                                    updateEventEnd={this.updateEventEnd}
                                    moveEvent={this.moveEvent}
                                    newEvent={this.newEvent}
                                    eventItemTemplateResolver={this.eventItemTemplateResolver}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    prevClick = (schedulerData) => {
        schedulerData.prev();
        schedulerData.setEvents(DemoData.eventsForCustomEventStyle);
        this.setState({
            viewModel: schedulerData
        })
    }

    nextClick = (schedulerData) => {
        schedulerData.next();
        schedulerData.setEvents(DemoData.eventsForCustomEventStyle);
        this.setState({
            viewModel: schedulerData
        })
    }

    onViewChange = (schedulerData, view) => {
        schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
        schedulerData.setEvents(DemoData.eventsForCustomEventStyle);
        this.setState({
            viewModel: schedulerData
        })
    }

    onSelectDate = (schedulerData, date) => {
        schedulerData.setDate(date);
        schedulerData.setEvents(DemoData.eventsForCustomEventStyle);
        this.setState({
            viewModel: schedulerData
        })
    }

    eventClicked = (schedulerData, event) => {
        alert(`You just clicked an event: {id: ${event.id}, title: ${event.title}}`);
    };

    ops1 = (schedulerData, event) => {
        alert(`You just executed ops1 to event: {id: ${event.id}, title: ${event.title}}`);
    };

    ops2 = (schedulerData, event) => {
        alert(`You just executed ops2 to event: {id: ${event.id}, title: ${event.title}}`);
    };

    newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
        //  if (confirm(`Do you want to create a new event? {slotId: ${slotId}, slotName: ${slotName}, start: ${start}, end: ${end}, type: ${type}, item: ${item}}`)) {

        let newFreshId = 0;
        schedulerData.eventsForCustomEventStyle.forEach((item) => {
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
        }
        schedulerData.addEvent(newEvent);
        this.setState({
            viewModel: schedulerData
        })
        //  }
    }

    updateEventStart = (schedulerData, event, newStart) => {
        // if (confirm(`Do you want to adjust the start of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newStart: ${newStart}}`)) {
        schedulerData.updateEventStart(event, newStart);
        // }
        this.setState({
            viewModel: schedulerData
        })
    }

    updateEventEnd = (schedulerData, event, newEnd) => {
        // if (confirm(`Do you want to adjust the end of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`)) {
        schedulerData.updateEventEnd(event, newEnd);
        // }
        this.setState({
            viewModel: schedulerData
        })
    }

    moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
        //if (confirm(`Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`)) {
        schedulerData.moveEvent(event, slotId, slotName, start, end);
        this.setState({
            viewModel: schedulerData
        })
        //  }
    }

    eventItemTemplateResolver = (schedulerData, event, bgColor, isStart, isEnd, mustAddCssClass, mustBeHeight, agendaMaxEventWidth) => {
        let borderWidth = isStart ? '4' : '0';
        let borderColor = 'rgba(0,139,236,1)', backgroundColor = '#80C5F6';
        let titleText = schedulerData.behaviors.getEventTextFunc(schedulerData, event);
        if (!!event.type) {
            borderColor = event.type == 1 ? 'rgba(0,139,236,1)' : (event.type == 3 ? 'rgba(245,60,43,1)' : '#999');
            backgroundColor = event.type == 1 ? '#80C5F6' : (event.type == 3 ? '#FA9E95' : '#D9D9D9');
        }
        let divStyle = { borderLeft: borderWidth + 'px solid ' + borderColor, backgroundColor: backgroundColor, height: mustBeHeight };
        if (!!agendaMaxEventWidth)
            divStyle = { ...divStyle, maxWidth: agendaMaxEventWidth };

        return <div key={event.id} className={mustAddCssClass} style={divStyle}>
            <span style={{ marginLeft: '4px', lineHeight: `${mustBeHeight}px` }}>{titleText}</span>
        </div>;
    }
}

export default Schedules;