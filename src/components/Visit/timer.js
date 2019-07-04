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
            console.log(prevState.time, 'run timer');
            return { time: moment(prevState.time).add(1, 'seconds') }
        })
    }

    handleRun = (props) => {
        let { run } = props;
        //let startTime = props.startTime || '00:00:00';
        console.log(props, 'handleRun');

        if(interval !== null) clearInterval(interval);

        if(run) {
            console.log('Empezando el temporizador');
            interval=setInterval(()=>this.handleTime(),1000);
            // this.setState(() => {
            //     return {time: moment(startTime, 'MM/DD/YYYY HH:mm:ss')}
            // }, () => {
            //     console.log('Empezando el temporizador');
            //     interval=setInterval(()=>this.handleTime(),1000);
            // });
        } 
    }
    //TODO: borrar esta funcion
    // setInitTimer = (startTime) => {
    //     return new Promise((resolve, reject) =>{
    //         //let newTime = moment('00:00:00', 'MM/DD/YYYY HH:mm:ss');
    //         let newTime = getDefaultTime();
    //         console.log(startTime, '!!!!!!!!startTime');
    //         if(!!startTime){
    //             //let newStartTime = moment(startTime, 'MM/DD/YYYY HH:mm:ss');
    //             let newStartTime = getTime(startTime);
    //             //let currentTime = moment(new Date(), 'MM/DD/YYYY HH:mm:ss');
    //             let currentTime = getTime(new Date());
    //             let duration = moment.duration(currentTime.diff(newStartTime));
    //             console.log(duration, '!duration');
    //             console.log(startTime, 'newstarttime');
    //             console.log(currentTime, 'currentTime');
    //             console.log(duration.days(), duration.hours(), duration.minutes(), duration.seconds(), 'duracion !!!!!!!!!!');

    //             newTime = durationToTime(startTime,duration.days(), duration.hours(), duration.minutes(), duration.seconds());

    //             this.setState(() => {
    //                 return { days: duration.days() }
    //             }, () => resolve(newTime));
    //         }
    //         else{
    //             resolve(newTime);
    //         }

    //         // let startTime = props.startTime || '00:00:00';
    //         // let newTime = moment(startTime, 'HH:mm:ss');
    //         // this.setState()
    //     })
    // }
    
    componentWillReceiveProps(nextProp){
        console.log(nextProp.startTime, 'received startTime');

        console.log(nextProp, 'props in time');
        let { duration, startTime, endTime } = nextProp;
        this.setState(() => {
            return { time: durationToTime(startTime, duration.days, duration.hours, duration.minutes, duration.seconds) }
        }, () => this.handleRun(nextProp));

        // this.setInitTimer(nextProp.startTime)
        //     .then(newTime => {
        //         this.setState(() => {
        //             return { time: newTime }
        //         }, () => this.handleRun(nextProp));
        //     });

    }

    render() {
        console.log(this.state, 'state timerrrrrr');
        let days = this.props.duration.days;
        let daysMsg = !!days ? days + ' days ' : '';
        return (
            <h5>
                {daysMsg + moment(this.state.time).format("HH:mm:ss")}
            </h5>
        )
    }
}

export default Timer;