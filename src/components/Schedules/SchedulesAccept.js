import React, { Component } from 'react';
import withApollo from 'react-apollo/withApollo';
import { CHANGE_STATUS_SHIFT } from './Mutations';
import renderHTML from 'react-render-html';
import { stat } from 'fs';

class SchedulesAccept extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            msg: '',
            accept: true,
            comment: '',
            status: false,
            color: ''
        }
    }

    handleChangeStatusShifts = (status, color, comment) => {
        this.props.client
            .mutate({
                mutation: CHANGE_STATUS_SHIFT,
                variables: {
                    id: this.state.id,
                    status: status,
                    color: color,
                    comment: comment
                }
            })
            .then((data) => {
                if (status == 2) { this.props.handleOpenSnackbar('success', 'Shift approved successfully!'); }
                else { this.props.handleOpenSnackbar('success', 'Shift rejected successfully!'); }

            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error approved Shift');
            });
    };

    componentWillMount() {
        var accept = this.props.match.params.accept;
        var id = this.props.match.params.id;
        var status = 0;
        var color;
        var msg = '';

        if (accept == 'true') {
            status = 2
            color = "#114bff";
            msg = 'Thanks for Accept our offer, await for you soon :)';
        } else {
            status = 3
            color = "#cccccc";
            msg = 'We regret that you can not accept our offer :( <br/>';
            msg += '<span className="font-weight-bold">Tell us the reason</span>';
        }

        if (status != 0) {
            this.setState({
                id: id,
                msg: msg,
                accept: accept,
                status: status,
                color: color
            }, () => {
                if (status == 2)
                    this.handleChangeStatusShifts(status, color, '')
            });
        }
    }

    handleSendComment = () => {
        this.handleChangeStatusShifts(this.state.status, this.state.color, this.state.comment);
    }

    hanldeChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <div className="gradiant-overlay">
                <h2 className="gradiant-overlay-message">{renderHTML(this.state.msg)}</h2>
                {
                    this.state.accept != 'true' ? (
                        <div className="mt-1 reason-wrapper">
                            <textarea name="" id="" cols="30" rows="10" name="comment" className="form-control" onChange={this.hanldeChange}></textarea>
                            <button onClick={this.handleSendComment} className="btn btn-large btn-success mt-2">Send</button>
                        </div>
                    ) : ('')
                }
            </div>
        );
    }

}

export default withApollo(SchedulesAccept);