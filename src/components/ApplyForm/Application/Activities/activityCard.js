import React, {Component, Fragment} from 'react';

class ActivityCard extends Component{

    render(){
        return(
            <Fragment>
                <div className="card Activity">
                    <i class="far fa-sticky-note Activity-icon"></i>
                    <div className="card-header Activity-header">
                        <span className="Activity-type">
                            Task
                        </span>
                    </div>
                    <div className="card-body Activity-body">
                        <div className="Activity-title">
                            <i class="far fa-check-circle"></i>
                            Follow Up with Marielena Lopez
                        </div>
                        <div className="Activity-data">
                            <div className="Activity-info">
                                <label className="Activity-label">
                                    Assigned To:
                                </label>
                                <div class="input-group">
                                    <div class="input-group-prepend" style={{marginRight: "0"}}>
                                        <span class="input-group-text" style={{border: "none", background: "none", paddingLeft: "0", paddingRight: "0"}}>
                                            <i class="fas fa-user-circle" style={{fontSize: "24px"}}></i>
                                        </span>
                                    </div>
                                    <input type="text" class="form-control Activity-input" placeholder="Username" readOnly={true} value="maryrobelo@gmail.com" />
                                </div>
                            </div>
                            <div className="Activity-info">
                                <label className="Activity-label">
                                    Due Date:
                                </label>
                                <div class="input-group">
                                    <div class="input-group-prepend" style={{marginRight: "0"}}>
                                        <span class="input-group-text" style={{border: "none", background: "none", paddingLeft: "0", paddingRight: "0"}}>
                                            <i class="fas fa-calendar-alt" style={{fontSize: "24px"}}></i>                                            
                                        </span>
                                    </div>
                                    <input type="text" class="form-control Activity-input" placeholder="Username" readOnly={true} value="11/02/2019 13:00 PM" />
                                </div>
                            </div>
                        </div>
                        <p className="Activity-description">
                            Regarding note logged on Monday, November 4th, 2019. This is a generic description text.
                        </p>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default ActivityCard;