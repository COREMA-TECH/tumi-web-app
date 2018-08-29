import React, {Component} from 'react';
import './index.css';
import FullWithTabs from './../FullWidthTabs/FullWidthTabs'

class CreateCompany extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //idCompany: this.props.location.state.idCompany
        };
    }

    render() {
        return (
            <div className="create-company-container">
                <FullWithTabs/>
            </div>
        );
    }
}

export default CreateCompany;
