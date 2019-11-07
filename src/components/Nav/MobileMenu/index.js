import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withApollo from 'react-apollo/withApollo';
import withGlobalContent from '../../Generic/Global';
import { GET_ROLES_FORMS, GET_MENU } from '../MobileMenu/Queries';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';

class MobileMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userLoggedRol: 1,
            dataRolForm: [],
            dataForm: [],
            ParentId: 0,
            childrens: [],
            loading: true
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
        this.props.client.query({
            query: GET_MENU,
            variables: {
                parentId: this.state.ParentId,
                IdRole: localStorage.getItem('IdRoles')
            }
        })
        .then(({ data }) => {
            this.setState({
                dataRolForm: this.state.ParentId === 0 ? data.activeFormsByRole : this.state.dataRolForm,
                childrens: this.state.ParentId !== 0 ? data.activeFormsByRole : [],
                loading: false
            });
        })
        .catch((error) => {
            this.props.handleOpenSnackbar(
                'error',
                'Error to get data. Please, try again!',
                'bottom',
                'right'
            );
        });
    };

    handleItemMenuAction = (currentTarget, nextSibling) => {
        let selfHtml = currentTarget;
        let submenu = nextSibling;
        if (selfHtml.classList.contains('selected')) {
            selfHtml.classList.remove('selected');
            submenu.classList.remove('SubMenu-show');
        } else {
            selfHtml.classList.add('selected');
            submenu.classList.add('SubMenu-show');
        }
    }
    
    showSubMenu = (ParentId, Value, e) => {
        e.preventDefault();

        this.setState(_ => {
            return { loading : true }
        });

        let currentTarget = e.currentTarget;
        let nextSibling = currentTarget.nextSibling;

        if (Value !== "")
            window.location.href = Value;
        else {
            this.setState(() => {
                return { ParentId }
            }, _ => {
                this.getRolesFormsInfo();
                this.handleItemMenuAction(currentTarget, nextSibling);
            });
        }
    }

    loading = () => {
        return this.state.loading ? <LinearProgress /> : false;
    }

    render() {
        let items = this.state.dataRolForm;
        
        return (
            <div className="MenuMobile">
                <ul className="MainMenu-container">
                    {/* <li className="MainMenu-option">
                        <a className="closeIcon" onClick={this.props.handleCloseMenu}>
                            <i className="far fa-times-circle"></i>
                        </a>
                    </li> */}

                    {items.map((item, i) => {
                        return <li key={i} className="MainMenu-option">
                            <a href={item.Value} className="MenuMobile-link" onClick={e => {this.showSubMenu(item.Id, item.Value, e);}}>
                                <i className={`${item.icon} MenuMobile-icon`} title={item.Code} />
                                <span>{item.Name}</span>
                            </a>
                            <ul className="SubMenu">
                                {this.loading()}
                                {this.state.childrens.map((children, i) => {
                                    return children.ParentId === item.Id ?
                                        <li key={i} className="SubMenu-item">
                                            <a className="SubMenu-link" href={children.Value}>
                                                <i className="fas fa-angle-double-right SubMenu-icon" /> {children.Name}
                                            </a>
                                        </li> 
                                    : ''
                                })}
                            </ul>
                        </li> 
                    })}
                </ul>
            </div>
        );
    }
}

export default withApollo(withGlobalContent(MobileMenu));


