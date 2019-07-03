import React, { Component } from 'react';
import moment from 'moment';

let interval = null;
class Timer extends Component {
    
    constructor(props) {
        super(props)
        this.state={
            time: moment('00:00:00', 'HH:mm:ss')
        }
    }

    handleTime() {
        this.setState((prevState) => {
            return { time: moment(prevState.time).add(1, 'seconds') }
        })
    }

    handleRun = (props) => {
        let { run } = props;
        let startTime = props.startTime || '00:00:00';

        if(interval !== null) clearInterval(interval);

        if(run) {
            this.setState(() => {
                return {time: moment(startTime, 'HH:mm:ss')}
            }, () => {
                interval=setInterval(()=>this.handleTime(),1000);
                console.log('Empezando el temporizador');
            });
        } 
    }
    
    componentWillReceiveProps(nextProp){
        if(nextProp.run !== this.props.run)
            this.handleRun(nextProp);
    }

    render() {        
        return (
            <h5>
                {moment(this.state.time).format("HH:mm:ss")}
            </h5>
        )
    }
}

export default Timer;