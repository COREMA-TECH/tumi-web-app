import React, {Component} from 'react';
import InputForm from "../../../ui-components/InputForm/InputForm";
import './index.css';

class DepartmentsProperty extends Component {
    render() {
        return (
            <div>
                <div className="department-form">
                    <div className="contact-form-row">
                        <InputForm placeholder="Code"/>
                    </div>
                    <div className="contact-form-row">
                        <InputForm placeholder="Description"/>
                    </div>

                    <div className="contact-form-row">
                        <div className="add-property">Add Department</div>
                    </div>
                </div>
            </div>
        );
    }
}

DepartmentsProperty.propTypes = {};

export default DepartmentsProperty;