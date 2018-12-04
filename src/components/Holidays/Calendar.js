import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import events from './events';
import moment from 'moment';

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

const localizer = BigCalendar.momentLocalizer(moment);

const Calendar = props => (
    <div className="row">
        <div className="col-md-12">
            <div className="MainCalendar">
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                />
            </div>
        </div>
    </div>
)


export default Calendar;