import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withApollo from 'react-apollo/withApollo';
import withGlobalContent from '../../Generic/Global';
import { GET_ROLES_FORMS } from '../MobileMenu/Queries';

class MobileMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userLoggedRol: 1,
            dataRolForm: [],
            dataForm: []
        };
    }

    componentWillMount() {
        this.getRolesFormsInfo();
        localStorage.setItem('permissionWO', false);
        localStorage.setItem('permissionManager', false);
        localStorage.setItem('permissionProperty', false);
        localStorage.setItem('permissionContract', false);
    }

    getRolesFormsInfo = () => {
        let WO;
        this.setState(
            {
                loading: true
            },
            () => {
                this.props.client
                    .query({
                        query: GET_ROLES_FORMS,
                        variables: {
                            IdRoles: localStorage.getItem('IdRoles')
                        }
                    })
                    .then(({ data }) => {

                        this.setState({
                            dataRolForm: data.rolesforms,
                            loading: false
                        });
                    })
                    .catch((error) => {
                        this.setState({
                            loading: false
                        });

                        this.props.handleOpenSnackbar(
                            'error',
                            'Error to get data. Please, try again!',
                            'bottom',
                            'right'
                        );
                    });
            }
        );
    };

    handleItemMenuAction = (event) => {
        event.preventDefault();
        let selfHtml = event.currentTarget;
        let submenu = selfHtml.nextSibling;
        if (selfHtml.classList.contains('selected')) {
            selfHtml.classList.remove('selected');
            submenu.classList.remove('SubMenu-show');
        } else {
            selfHtml.classList.add('selected');
            submenu.classList.add('SubMenu-show');
        }
    }

    render() {
        let items = this.state.dataRolForm;
        return (
            <div className="MenuMobile">
                <ul className="MainMenu-container">
                    <li className="MainMenu-option">
                        <a className="closeIcon" onClick={this.props.handleCloseMenu}>
                            <i className="far fa-times-circle"></i>
                        </a>
                    </li>

                    {items.map(item => {
                        return item.Forms.Value == "/home/company" ?
                            <li className="MainMenu-option">
                                <Link to={`/home/Company`} className="MenuMobile-link"
                                    onClick={this.props.handleCloseMenu}>
                                    <i className={'fas fa-warehouse MenuMobile-icon'} title={'Companies'} />
                                    <span>Management Company</span>
                                </Link>
                            </li> : ''
                    })}

                    {items.map(item => {
                        return item.Forms.Value == "/home/Properties" ?
                            <li className="MainMenu-option">
                                <Link to={`/home/Properties`} className="MenuMobile-link"
                                    onClick={this.props.handleCloseMenu}>
                                    <i className={'fas fa-building MenuMobile-icon'} title={'Properties'} />
                                    <span>Properties</span>
                                </Link>
                            </li> : ""
                    })}
                    {items.map(item => {
                        return item.Forms.Value == "/home/Contracts" ?
                            <li className="MainMenu-option">
                                <Link to={`/home/Contracts`} className="MenuMobile-link"
                                    onClick={this.props.handleCloseMenu}>
                                    <i className={'far fa-handshake MenuMobile-icon'} title={'Contracts'} />
                                    <span>Contracts</span>
                                </Link>
                            </li> : ""
                    })}
                    {items.map(item => {
                        return item.Forms.Value == "Employee" ?
                            <li className="MainMenu-option">
                                <Link
                                    to={`/home/application`}
                                    className="MenuMobile-link"
                                    onClick={this.handleItemMenuAction}
                                    data-submenu="1"
                                >
                                    <i className="fas fa-users MenuMobile-icon" title={'Employee'} />
                                    <span>Employees</span>
                                </Link>
                                <ul className="SubMenu" id="1">
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/employees" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/employees">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> Quick Add
                                                </a>
                                            </li> : ""
                                    })}
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/application" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/application">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> New
                                                    Employees Package
                                                </a>
                                            </li> : ""
                                    })}
                                </ul>
                            </li> : ""
                    })}
                    {items.map(item => {
                        return item.Forms.Value == "Operations" ?
                            <li className="MainMenu-option">
                                <Link
                                    to={`/home/application`}
                                    className="MenuMobile-link"
                                    onClick={this.handleItemMenuAction}
                                    data-submenu="1"
                                >
                                    <i className="fas fa-user-cog MenuMobile-icon" title={'Operations'} />
                                    <span>Operations</span>
                                </Link>
                                <ul className="SubMenu" id="1">
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/dashboard/manager" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/dashboard/manager">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> Dashboard
                                                </a>
                                            </li> : ""
                                    })}
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/board/manager" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/board/manager">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> Board
                                                </a>
                                            </li> : ""
                                    })}
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/work-orders" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/work-orders">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> Work Order
                                                </a>
                                            </li> : ""
                                    })}
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/schedules" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/schedules">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> Schedules
                                                </a>
                                            </li> : ""
                                    })}
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/property/schedules" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/property/schedules">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> Manage
                                                    Schedules
                                                </a>
                                            </li> : ""
                                    })}
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/punches/report" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/punches/report">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> Punches
                                                    Report
                                                </a>
                                            </li> : ""
                                    })}
                                </ul>
                            </li> : ""
                    })}
                    {items.map(item => {
                        return item.Forms.Value == "HotelManager" ?
                            <li className="MainMenu-option">
                                <Link
                                    to={`/home/application`}
                                    className="MenuMobile-link"
                                    onClick={this.handleItemMenuAction}
                                    data-submenu="1"
                                >
                                    <i className="fas fa-chalkboard-teacher MenuMobile-icon" title={'Hotel Manager'} />
                                    <span>Hotel Manager</span>
                                </Link>
                                <ul className="SubMenu" id="1">
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/dashboard/hotel" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/dashboard/hotel">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> Dashboard
                                                </a>
                                            </li> : ""
                                    })}
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/work-orders" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/work-orders">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> Work Order
                                                </a>
                                            </li> : ""
                                    })}
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/approve-punches" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/approve-punches">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> Approve/Reject punches
                                                </a>
                                            </li> : ""
                                    })}
                                </ul>
                            </li> : ''
                    })}
                    {items.map(item => {
                        return item.Forms.Value == "HotelManager" ?
                            <li className="MainMenu-option">
                                <Link
                                    to={`/home/application`}
                                    className="MenuMobile-link"
                                    onClick={this.handleItemMenuAction}
                                    data-submenu="1"
                                >
                                    <i className="fas fa-chalkboard-teacher MenuMobile-icon" title={'Hotel Manager'} />
                                    <span>Sponsor</span>
                                </Link>
                                <ul className="SubMenu" id="1">
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/dashboard/sponsor" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/dashboard/sponsor">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> Dashboard
                                                </a>
                                            </li> : ""
                                    })}
                                </ul>
                            </li> : ''
                    })}
                    {items.map(item => {
                        return item.Forms.Value == "Recruiter" ?
                            <li className="MainMenu-option">
                                <Link
                                    to={`/home/application`}
                                    className="MenuMobile-link"
                                    onClick={this.handleItemMenuAction}
                                    data-submenu="1"

                                >
                                    <i className="far fa-address-card MenuMobile-icon" title={'Recruiter'} />
                                    <span>Recruiter</span>
                                </Link>
                                <ul className="SubMenu" id="1">
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/dashboard/recruiter" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/dashboard/recruiter">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> Dashboard
                                                </a>
                                            </li> : ""
                                    })}
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/board/recruiter" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/board/recruiter">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> Board
                                                </a>
                                            </li> : ""
                                    })}
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/Recruiter" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/Recruiter">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> New Lead
                                                </a>
                                            </li> : ""
                                    })}
                                </ul>
                            </li> : ''
                    })}
                    {items.map(item => {
                        return item.Forms.Value == "Reports" ?
                            <li className="MainMenu-option">
                                <Link
                                    to={`/home/application`}
                                    className="MenuMobile-link"
                                    onClick={this.handleItemMenuAction}
                                    data-submenu="1"

                                >
                                    <i className="fas fa-chart-bar MenuMobile-icon" title={'Recruiter'} />
                                    <span>Reports</span>
                                </Link>
                                <ul className="SubMenu" id="1">
                                </ul>
                            </li> : ''
                    })}
                    {items.map(item => {
                        return item.Forms.Value == "Security" ?
                            <li className="MainMenu-option">
                                <Link
                                    to={`/home/application`}
                                    className="MenuMobile-link"
                                    onClick={this.handleItemMenuAction}
                                    data-submenu="1"

                                >
                                    <i className="fas fa-user-lock MenuMobile-icon" title={'Recruiter'} />
                                    <span>Admin</span>
                                </Link>
                                <ul className="SubMenu" id="1">
                                    {items.map(item => {
                                        return item.Forms.Value == "/employment-application" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/employment-application">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> Public
                                                    Application
                                                </a>
                                            </li> : ""
                                    })}
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/Roles" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/roles">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> Roles
                                                </a>
                                            </li> : ""
                                    })}
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/Forms" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/forms">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> Forms
                                                </a>
                                            </li> : ""
                                    })}
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/RolesForms" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/rolesforms">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" />Roles & Forms
                                                </a>
                                            </li> : ""
                                    })}
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/Users" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/users">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> Users
                                                </a>
                                            </li> : ""
                                    })}
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/catalogs" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/catalogs">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> Catalogs
                                                </a>
                                            </li> : ""
                                    })}
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/region" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/region">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> Regions
                                                </a>
                                            </li> : ""
                                    })}
                                    {items.map(item => {
                                        return item.Forms.Value == "/home/payroll" ?
                                            <li className="SubMenu-item">
                                                <a className="SubMenu-link" href="/home/payroll">
                                                    <i className="fas fa-angle-double-right SubMenu-icon" /> PayRoll
                                                </a>
                                            </li> : ""
                                    })}
                                </ul>
                            </li> : ''
                    })}
                </ul>
            </div>
        );
    }
}

export default withApollo(withGlobalContent(MobileMenu));


