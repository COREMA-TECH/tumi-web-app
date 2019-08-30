import React, { Component } from 'react';
import moment from 'moment';
import {getDefaultTime, getTime, durationToTime} from './Utilities';

let interval = null;

class Timer extends Component {
    
    constructor(props) {
        super(props)
        this.state={
            time: getDefaultTime()
        }
    }

    handleTime() {
        this.setState((prevState) => {
            return { time: moment(prevState.time).add(1, 'seconds') }
        })
    }

    handleRun = (props) => {
        let { run } = props;

        if(interval !== null) clearInterval(interval);

        if(run) {
            interval=setInterval(()=>this.handleTime(),1000);
        } 
    }
    
    
    componentWillReceiveProps(nextProp){
        let { duration, startTime, endTime, run } = nextProp;
        if(run !== this.props.run || startTime !== this.props.startTime){
            this.setState(() => {
                return { time: durationToTime(startTime, duration.days, duration.hours, duration.minutes, duration.seconds) }
            }, () => this.handleRun(nextProp));
        }
    }

    render() {
        let days = this.props.duration.days;
        let daysMsg = !!days ? days + ' days - ' : '';
        return (
            <h5>
                {daysMsg + moment(this.state.time).format("HH:mm:ss")}
            </h5>
        )
    }
}

export default Timer;
