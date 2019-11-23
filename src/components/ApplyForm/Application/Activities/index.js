import React, {Fragment, Component} from 'react';
import Sidebar from '../../../Generic/SideBar';
import ActivitiesPanel from './activitiesPanel';
import ApplicationStage from '../ApplicationStage';

class Activities extends Component {

    componentWillMount(){
        // alert(this.props.location.state.ApplicationId);
    }

    render(){
        return (
            <Fragment>
                <div className="withSidebar-wrapper">
                    <Sidebar bodyType="full">
                        <div className="ActionButtons">
                            <span className="ActionButton">
                                <button className="ActionButton-item">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <span className="ActionButton-text">
                                    Note
                                </span>
                            </span>
                            <span className="ActionButton">
                                <button className="ActionButton-item">
                                    <i class="fas fa-plus"></i>
                                </button>
                                <span className="ActionButton-text">
                                    Log
                                </span>
                                <ul className="ActionButton-submenu">
                                    <li className="ActionButton-submenu-item">
                                        Log a Call
                                    </li>
                                    <li className="ActionButton-submenu-item">
                                        Log an Email
                                    </li>
                                    <li className="ActionButton-submenu-item">
                                        Log a text message
                                    </li>
                                </ul>
                            </span>
                            <span className="ActionButton">
                                <button className="ActionButton-item">
                                    <i class="far fa-sticky-note"></i>
                                </button>
                                <span className="ActionButton-text">
                                    Task
                                </span>
                            </span>
                            <span className="ActionButton">
                                <button className="ActionButton-item">
                                    <i class="fas fa-calendar-alt"></i>
                                </button>
                                <span className="ActionButton-text">
                                    Meet
                                </span>
                            </span>
                        </div>
                        <div className="ApplicationStage">
                            <ApplicationStage />
                        </div>
                    </Sidebar>
					<div className="withSidebar-extended-content">
                        <ActivitiesPanel />						
					</div>
				</div>                
            </Fragment>
        )
    }
}

export default Activities;