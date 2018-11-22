import React, {Component} from 'react';
import './preview-profile.css';
import './../index.css';
import withApollo from "react-apollo/withApollo";
import {GET_APPLICATION_PROFILE_INFO} from "./Queries";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";

class General extends Component {
    constructor(props){
        super(props);

        this.state = {
            loading: false,
            error: false,
            data: []
        }
    }

    getProfileInformation = (id) => {
        this.props.client
            .query({
                query: GET_APPLICATION_PROFILE_INFO,
                variables: {
                    id: id
                }
            })
            .then(({data}) => {
                this.setState({
                    data: data.applications[0]
                }, () => {
                    this.setState({
                        loading: false
                    })
                });
            })
            .catch(error => {
                this.setState({
                    loading: false,
                    error: true
                })
            })
    };

    componentWillMount(){
        this.setState({
            loading: true
        }, () => {
            this.getProfileInformation(this.props.applicationId);
        })
    }

    render() {
        if (this.state.loading) {
            return <LinearProgress />
        }


        if (this.state.error) {
            return <LinearProgress />
        }

        return (
            <div className="Apply-container--application">
                <div className="">
                    <div className="col-md-12">
                        <div className="applicant-card">
                            <div className="row">
                                <div className="item col-sm-12 col-md-3">
                                    <div className="row">
                                        <span className="username col-sm-12">{this.state.data.firstName + ' ' + this.state.data.lastName}</span>
                                        <span className="username-number col-sm-12">Emp #: TM-0000{this.state.data.id}</span>
                                    </div>
                                </div>
                                <div className="item col-sm-12 col-md-2">
                                    <div className="row">
                                        <span className="col-sm-6 col-lg-12">Title: {this.state.data.position.Name.trim()}</span>
                                        <span className="col-sm-6 col-lg-12">Department: Banquet</span>
                                    </div>
                                </div>
                                <div className="item col-sm-12  col-md-2">
                                    <div className="row">
                                        <span className="col-sm-12 font-weight-bold">Schedule Type</span>
                                        <span className="col-sm-12">Text</span>
                                    </div>
                                </div>
                                <div className="item col-sm-12  col-md-2">
                                    <div className="row">
                                        <span className="col-sm-12 font-weight-bold">Payroll Preference</span>
                                        <span className="col-sm-12">Text</span>
                                    </div>
                                </div>
                                <div className="item col-sm-12  col-md-1">
                                    <div className="row">
                                        <span className="col-sm-12 font-weight-bold">Active</span>
                                        <label className="switch">
                                            <input
                                                id="vehicleReportRequired"
                                                type="checkbox"
                                                className="form-control"
                                                min="0"
                                                maxLength="50"
                                                minLength="10"
                                                form="background-check-form"
                                                checked={this.state.data.isActive}
                                            />
                                            <p className="slider round"></p>
                                        </label>
                                    </div>
                                </div>
                                <div className="item col-sm-12  col-md-2">
                                    <button className="btn btn-info">Create Profile</button>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div className="applicant-card general-table-container">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">First</th>
                                    <th scope="col">Last</th>
                                    <th scope="col">Handle</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td>@mdo</td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>Larry</td>
                                    <td>the Bird</td>
                                    <td>@twitter</td>
                                </tr>
                                </tbody>
                            </table>
                            <br/>
                            <br/>
                            <div className="row">
                                <div className="col-sm-12">
                                    <h5>Titles</h5>
                                </div>
                                <div className="col-sm-12">
                                    <div className="row">
                                        <div className="btn btn-success btn-margin col-sm-12 col-md-6 col-lg-3">Banquet
                                            Server
                                        </div>
                                        <div className="btn btn-success btn-margin col-sm-12 col-md-6 col-lg-3">Banquet
                                            Server
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <h5>Location able to work</h5>
                                </div>
                                <div className="col-sm-12">
                                    <div className="row">
                                        <div className="btn btn-success btn-margin col-sm-12 col-md-6 col-lg-3">WJ
                                            Marriot
                                        </div>
                                        <div className="btn btn-success btn-margin col-sm-12 col-md-6 col-lg-3">Downtown
                                            Doubletree
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

/**/
General.propTypes = {};

export default withApollo(General);