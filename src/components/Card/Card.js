import React, {Component} from 'react';
import './index.css';

export default class Card extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="card-form-company">
                    <div className="card-form-header">{this.props.titlecard}</div>
                    <div className="card-form-body">

                    </div>
            </div>
        )
    }
}