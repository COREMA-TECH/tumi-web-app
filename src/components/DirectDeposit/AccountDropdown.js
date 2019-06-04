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
        });
    }

    render(){
        const { firstName, lastName, accountNumber, address, routingNumber, accountType, amount, amountType } = this.props;
        return(
            <div className={`Dropdown ${ this.state.isOpen ? 'open' : '' }`}>
                <div className="Dropdown-header" onClick={this.handleCollapse}>
                    <span className="Dropdown-title">
                        <strong>Account #</strong>
                        <span>{ `${accountNumber}` }</span>
                    </span>
                    <span className="Dropdown-caret">
                        <i class={`fas ${this.state.isOpen ? 'fa-angle-up' : 'fa-angle-down'}`}></i>
                    </span>
                </div>
                <div className={`Dropdown-body`}>
                    <div className="Dropdown-contentWrapper">
                        <div className="row pt-0 pb-0">
                            <div className="col-12 col-md-5">
                                <div className="Dropdown-item">
                                    <label className="Dropdown-itemLabel">Name:</label>
                                    <span className="Dropdown-itemDesc">
                                        { `${firstName} ${lastName}` }
                                    </span>
                                </div>
                            </div>
                            <div className="col-12 col-md-7">
                                <div className="Dropdown-item">
                                    <label className="Dropdown-itemLabel">Address:</label>
                                    <span className="Dropdown-itemDesc">
                                        { `${address}` }
                                    </span>
                                </div>
                            </div>
                            <div className="col-12 col-md-5">
                                <div className="Dropdown-item">
                                    <label className="Dropdown-itemLabel">Account #:</label>
                                    <span className="Dropdown-itemDesc">
                                        { `${accountNumber}` }
                                    </span>
                                </div>
                            </div>
                            <div className="col-12 col-md-7">
                                <div className="Dropdown-item">
                                    <label className="Dropdown-itemLabel">Type:</label>
                                    <span className="Dropdown-itemDesc">
                                        { `${accountType}` }
                                    </span>
                                </div>
                            </div>
                            <div className="col-12 col-md-5">
                                <div className="Dropdown-item">
                                    <label className="Dropdown-itemLabel">Routing:</label>
                                    <span className="Dropdown-itemDesc">
                                        { `${routingNumber}` }
                                    </span>
                                </div>
                            </div>
                            <div className="col-12 col-md-7">
                                <div className="Dropdown-item">
                                    <label className="Dropdown-itemLabel">Amount:</label>
                                    <span className="Dropdown-itemDesc">
                                        {`${amountType === 'quantity' ? '$' : ''}${amount}${amountType === 'percentage' ? '%' : ''}`}
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