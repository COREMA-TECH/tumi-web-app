import React, { Component } from 'react';


let interval = null;
class Timer extends Component {
    
    constructor(props) {
        super(props)
        this.state={
            time: new Date().setHours(0,0,0,0)
        }
    }

    handleTime() {
        console.log('Run handleTime');
        this.setState((prevState) => {
            let time = new Date(prevState.time);
            return { time: time.setSeconds(time.getSeconds() + 1) }
        })
    }

    handleRun = (props) => {
        console.log(props.run, 'propety is...');
        console.log(interval, 'interval is...');
        let { run } = props;
        if(run && interval === null)
            interval=setInterval(()=>this.handleTime(),1000)
        else if(run === false && interval !== null)
            clearInterval(interval);
    }
    
    componentWillReceiveProps(nextProp){
        if(nextProp.run !== this.props.run)
            this.handleRun(nextProp);
    }

    render() {
        let timeShow = new Date(this.state.time).toLocaleTimeString();
        
        return (
            <h5>
                {timeShow}
            </h5>
        )
    }
}

export default Timer;