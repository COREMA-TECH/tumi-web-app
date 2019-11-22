import React, { Fragment, Component } from 'react';
import SideBar from '../../../Generic/SideBar';
import ApplicationFilters from '../ApplicationFilters';

class ApplicationSideBar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <SideBar>
                    <div className="SidebarIconList-list">
                        <div className="SidebarIconList-item">
                            <i className="fas fa-user-plus"></i>
                            <span className="SidebarIconList-title withBadge" data-value="20">Leads</span>
                        </div>
                        <div className="SidebarIconList-item">
                            <i className="fas fa-user-plus"></i>
                            <span className="SidebarIconList-title withBadge" data-value="20">Applicant</span>
                        </div>
                        <div className="SidebarIconList-item">
                            <i className="fas fa-user-plus"></i>
                            <span className="SidebarIconList-title withBadge" data-value="20">Candidate</span>
                        </div>
                        <div className="SidebarIconList-item">
                            <i className="fas fa-user-plus"></i>
                            <span className="SidebarIconList-title withBadge" data-value="20">Employee</span>
                        </div>
                        <div className="SidebarIconList-item">
                            <i className="fas fa-user-plus"></i>
                            <span className="SidebarIconList-title withBadge" data-value="20">Active</span>
                        </div>
                        <div className="SidebarIconList-item">
                            <i className="fas fa-user-plus"></i>
                            <span className="SidebarIconList-title withBadge" data-value="20">Inactive</span>
                        </div>
                    </div>
                    <div className="SidebarList border-top pt-2">
                        <ul>
                            <li className="SidebarList-item">
                                <input type="checkbox"/>
                                <label htmlFor="">Website</label>
                            </li>
                            <li className="SidebarList-item">
                                <input type="checkbox"/>
                                <label htmlFor="">Recruiter</label>
                            </li>
                            <li className="SidebarList-item">
                                <input type="checkbox"/>
                                <label htmlFor="">Walk-in</label>
                            </li>
                        </ul>
                    </div>
                    <div className="border-top pt-3 mt-3">
                        <button className="btn btn-light" onClick={this.props.handleOpenModal}>
                            Filters
                        </button>
                    </div>
                </SideBar>
                <ApplicationFilters />
            </Fragment>
        );
    }

}

export default ApplicationSideBar;