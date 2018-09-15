import React, {Component} from 'react';
import InputForm from "ui-components/InputForm/InputForm";
import './index.css';
import Button from "@material-ui/core/es/Button/Button";

class ContactsProperty extends Component {
    render() {
        return (
            <div>
                <div className="contact-form">
                    <div className="contact-form-row">
                      <InputForm placeholder="Company Name"/>
                    </div>
                    <div className="contact-form-row">
                        <InputForm placeholder="Address"/>
                    </div>
                    <div className="contact-form-row">
                       <InputForm placeholder="Address 2"/>
                    </div>
                    <div className="contact-form-row">
                       <InputForm placeholder="Company Name"/>
                    </div>
                    <div className="contact-form-row">
                       <InputForm placeholder="Address"/>
                    </div>
                    <div className="contact-form-row">
                       <InputForm placeholder="Address 2"/>
                    </div>
                    <div className="contact-form-row">
                        <div className="add-property">Add Contact</div>
                    </div>
                </div>
            </div>
        );
    }
}

ContactsProperty.propTypes = {};

export default ContactsProperty;