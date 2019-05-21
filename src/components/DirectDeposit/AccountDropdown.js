import React, {Component} from 'react';

class AccountDropdown extends Component{

    constructor(props){
        super(props);

        this.state = {
            isOpen: false
        }
    }

    handleCollapse = _ => {
        this.setState({
            isOpen: !this.state.isOpen
        }, _ => console.log("Click"));
    }

    render(){
        return(
            <div className="Dropdown">
                <div className="Dropdown-header" onClick={this.handleCollapse}>
                    <span className="Dropdown-title">
                        {this.props.title || 'Default Title'}
                    </span>
                    <span className="Dropdown-caret">
                        <i class={`fas ${this.state.isOpen ? 'fa-angle-up' : 'fa-angle-down'}`}></i>
                    </span>
                </div>
                <div className={`Dropdown-body ${ this.state.isOpen ? 'open' : '' }`}>
                    <div className="Dropdown-contentWrapper">
                        <div className="row pt-0 pb-0">
                            <div className="col-12 col-md-5">
                                <div className="Dropdown-item">
                                    <label className="Dropdown-itemLabel">Name:</label>
                                    <span className="Dropdown-itemDesc">
                                        {/* {this.props.name} */}
                                        Jorge Corea
                                    </span>
                                </div>
                            </div>
                            <div className="col-12 col-md-7">
                                <div className="Dropdown-item">
                                    <label className="Dropdown-itemLabel">Address:</label>
                                    <span className="Dropdown-itemDesc">
                                        {/* {this.props.address} */}
                                        Some address
                                    </span>
                                </div>
                            </div>
                            <div className="col-12 col-md-5">
                                <div className="Dropdown-item">
                                    <label className="Dropdown-itemLabel">Account #:</label>
                                    <span className="Dropdown-itemDesc">
                                        {/* {this.props.account} */}
                                        23156465456789
                                    </span>
                                </div>
                            </div>
                            <div className="col-12 col-md-7">
                                <div className="Dropdown-item">
                                    <label className="Dropdown-itemLabel">Type:</label>
                                    <span className="Dropdown-itemDesc">
                                        {/* {this.props.type} */}
                                        Checking
                                    </span>
                                </div>
                            </div>
                            <div className="col-12 col-md-5">
                                <div className="Dropdown-item">
                                    <label className="Dropdown-itemLabel">Routin:</label>
                                    <span className="Dropdown-itemDesc">
                                        {/* {this.props.routin} */}
                                        00120245
                                    </span>
                                </div>
                            </div>
                            <div className="col-12 col-md-7">
                                <div className="Dropdown-item">
                                    <label className="Dropdown-itemLabel">Amount:</label>
                                    <span className="Dropdown-itemDesc">
                                        {/* {`$ ${this.props.amount}`} */}
                                        $115465456456
                                    </span>
                                </div>
                            </div>
                            <div className="col-12">
                                <a href="#" className="Dropdown-attachments">
                                    View Attachments
                                    <i class="fas fa-paperclip pl-1"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountDropdown;