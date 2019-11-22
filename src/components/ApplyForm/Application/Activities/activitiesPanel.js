import React, {Component, Fragment} from 'react';
import ActivityCard from './activityCard';

class ActivitiesPanel extends Component{
    render(){
        return(
            <Fragment>
                <div className="ActivityTabs">
                    <span className="ActivityTabs-tab active">
                        Activities
                    </span>
                    <span className="ActivityTabs-tab">
                        Notes
                    </span>
                    <span className="ActivityTabs-tab">
                        Emails
                    </span>
                    <span className="ActivityTabs-tab">
                        Calls
                    </span> 
                    <span className="ActivityTabs-tab">
                        Text Messages
                    </span>
                    <span className="ActivityTabs-tab">
                        Tasks
                    </span>
                </div>
                <div className="Activities">
                    <ActivityCard />
                </div>
            </Fragment>
        )
    }
}

export default ActivitiesPanel;