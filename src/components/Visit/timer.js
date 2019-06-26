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
        this.setState((prevState) => {
            let time = new Date(prevState.time);
            return { time: time.setSeconds(time.getSeconds() + 1) }
        })
    }

    handleRun = (props) => {
        let { run } = props;
        if(run)
            interval=setInterval(()=>this.handleTime(),1000)
        else
            clearInterval(interval);
    }
    
    componentWillReceiveProps(nextProp){
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