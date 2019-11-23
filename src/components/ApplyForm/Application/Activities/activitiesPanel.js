import React, {Component, Fragment} from 'react';
import NotesContent from './notesContent'

class ActivitiesPanel extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedTab: "notes"
        }
    }

    selectTab = tab => event => {
        this.setState(_ => ({
            selectedTab: tab
        }));
    }

    renderPanel = _ => {
        switch (this.state.selectedTab) {
            case "notes":
                return <NotesContent />
            default:
                break;
        }
    }

    render(){
        return(
            <Fragment>
                <div className="ActivityTabs">
                    <span className={`ActivityTabs-tab ${this.state.selectedTab === "activities" ? 'active' : ''}`} onClick={this.selectTab("activities")}>
                        Activities
                    </span>
                    <span className={`ActivityTabs-tab ${this.state.selectedTab === "notes" ? 'active' : ''}`} onClick={this.selectTab("notes")}>
                        Notes
                    </span>
                    <span className={`ActivityTabs-tab ${this.state.selectedTab === "emails" ? 'active' : ''}`} onClick={this.selectTab("emails")}>
                        Emails
                    </span>
                    <span className={`ActivityTabs-tab ${this.state.selectedTab === "calls" ? 'active' : ''}`} onClick={this.selectTab("calls")}>
                        Calls
                    </span> 
                    <span className={`ActivityTabs-tab ${this.state.selectedTab === "messages" ? 'active' : ''}`} onClick={this.selectTab("messages")}>
                        Text Messages
                    </span>
                    <span className={`ActivityTabs-tab ${this.state.selectedTab === "tasks" ? 'active' : ''}`} onClick={this.selectTab("tasks")}>
                        Tasks
                    </span>
                </div>     
                {this.renderPanel()}          
            </Fragment>
        )
    }
}

export default ActivitiesPanel;