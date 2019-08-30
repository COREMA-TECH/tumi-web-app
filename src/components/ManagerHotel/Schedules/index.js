import React, { Component } from 'react';

import Schedules from '../../Schedules';


class HotelSchedules extends Component {

    render() {
        return (
            <Schedules hotelManager={true} />
        );
    }
}

export default HotelSchedules;