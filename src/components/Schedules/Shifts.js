import React, {Component} from 'react';
import Scheduler, {DATE_FORMAT, SchedulerData, ViewTypes} from 'react-big-scheduler';
import 'react-big-scheduler/lib/css/style.css';
import moment from 'moment';

class Shifts extends Component {

    constructor(props) {
        super(props);


        // let schedulerData = new SchedulerData('2018-12-17 09:30:00', ViewTypes.Day, false, false, {
        //     views: [
        //         { viewName: 'Day', viewType: ViewTypes.Day, showAgenda: true, isEventPerspective: false },
        //         { viewName: 'Week', viewType: ViewTypes.Week, showAgenda: false, isEventPerspective: false },
        //         { viewName: 'Month', viewType: ViewTypes.Month, showAgenda: false, isEventPerspective: true },
        //         { viewName: 'Year', viewType: ViewTypes.Year, showAgenda: false, isEventPerspective: false },
        //     ],
        //     schedulerWidth: '1500',
        // });
        let schedulerData = new SchedulerData(new moment().format(DATE_FORMAT), ViewTypes.Week);


        moment.locale('zh-cn');
        schedulerData.setLocaleMoment(moment);


        //set resources here or later
        let resources = [
            {
                id: 'r1',
                name: 'Resource1'
            },
            {
                id: 'r2',
                name: 'Resource2'
            },
            {
                id: 'r3',
                name: 'Resource 5'
            }
        ];
        schedulerData.setResources(resources);
        //set events here or later,
        //the event array should be sorted in ascending order by event.start property, otherwise there will be some rendering errors
        let events = [
            {
                id: 1,
                start: '2018-12-17 09:30:00',
                end: '2018-12-17 23:30:00',
                resourceId: 'r1',
                title: 'I am finished',
                bgColor: '#cd0000'
            },
            {
                id: 2,
                start: '2018-12-18 12:30:00',
                end: '2018-12-18 23:30:00',
                resourceId: 'r2',
                title: 'I am not resizable',
                bgColor: '#269c1c',
                resizable: true
            },
            {
                id: 3,
                start: '2018-12-19 12:30:00',
                end: '2018-12-19 23:30:00',
                resourceId: 'r3',
                title: 'I am not movable',
                bgColor: '#0087ff',
                movable: false,
                resizable: true
            }
        ];
        schedulerData.setEvents(events);


        // schedulerData.localeMoment.locale('en');
        // schedulerData.setResources(DemoData.resources);
        // schedulerData.setEvents(DemoData.eventsForCustomEventStyle);
        // schedulerData.setEvents(events);
        this.state = {
            viewModel: schedulerData,
            events: [
                {
                    id: 1,
                    start: '2018-12-17 09:30:00',
                    end: '2018-12-17 23:30:00',
                    resourceId: 'r1',
                    title: 'I am finished',
                    bgColor: '#cd0000'
                },
                {
                    id: 2,
                    start: '2018-12-18 12:30:00',
                    end: '2018-12-18 23:30:00',
                    resourceId: 'r2',
                    title: 'I am not resizable',
                    bgColor: '#269c1c',
                    resizable: false
                },
                {
                    id: 3,
                    start: '2018-12-19 12:30:00',
                    end: '2018-12-19 23:30:00',
                    resourceId: 'r3',
                    title: 'I am not movable',
                    bgColor: '#0087ff',
                    movable: false
                }
            ]
        }
    }

    render() {
        const {viewModel} = this.state;

        return (
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

        );
    }

    prevClick = (schedulerData) => {
        schedulerData.prev();
        schedulerData.setEvents(this.state.events);
        this.setState({
            viewModel: schedulerData
        })
    }

    nextClick = (schedulerData) => {
        schedulerData.next();
        schedulerData.setEvents(this.state.events);
        this.setState({
            viewModel: schedulerData
        })
    }

    onViewChange = (schedulerData, view) => {
        schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
        schedulerData.setEvents(this.state.events);
        this.setState({
            viewModel: schedulerData
        })
    };

    onSelectDate = (schedulerData, date) => {
        schedulerData.setDate(date);
        schedulerData.setEvents(this.state.events);
        this.setState({
            viewModel: schedulerData
        })
    };

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
        };

        schedulerData.addEvent(newEvent);
        this.setState({
            viewModel: schedulerData
        });
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
        let divStyle = {
            borderLeft: borderWidth + 'px solid ' + borderColor,
            backgroundColor: backgroundColor,
            height: mustBeHeight
        };
        if (!!agendaMaxEventWidth)
            divStyle = {...divStyle, maxWidth: agendaMaxEventWidth};

        return <div key={event.id} className={mustAddCssClass} style={divStyle}>
            <span style={{marginLeft: '4px', lineHeight: `${mustBeHeight}px`}}>{titleText}</span>
        </div>;
    }
}

export default Shifts;