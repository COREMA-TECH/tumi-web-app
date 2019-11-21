import React, {Fragment, Component} from 'react';
import Sidebar from '../../../Generic/SideBar';
import ActivitiesPanel from './activitiesPanel';

class Activities extends Component {

    componentWillMount(){
        alert(this.props.location.state.ApplicationId);
    }

    render(){
        return (
            <Fragment>
                <Sidebar bodyType="full">
                    <h1>This area will contain the buttons</h1>
                </Sidebar>
                <ActivitiesPanel />
            </Fragment>
        )
    }
}

export default Activities;