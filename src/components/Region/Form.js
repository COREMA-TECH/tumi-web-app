import React, { Component } from "react";

class Form extends Component {

    render() {
        return (
            <form action="">
                <header className="RegionForm-header">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="">* Region's Name</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="">* Region's Code</label>
                                <input type="text" className="form-control" />
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-4">
                                    <label htmlFor="">Regional Manager</label>
                                    <select name="" className="form-control" id=""></select>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="">Regional Manager</label>
                                    <input type="text" className="form-control" />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="">Regional Recruiter</label>
                                    <select name="" className="form-control" id=""></select>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4">
                                    <label htmlFor="">Property Name</label>
                                    <div class="input-group">
                                        <input type="text" className="form-control" placeholder="Enter Name/Code" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                        <div class="input-group-append">
                                            <span class="input-group-text" id="basic-addon2">
                                                <i className="fa fa-search"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="PropertiesTags">
                                <ul className="row">
                                    <li className="col-md-2 PropertiesTags-item">
                                        <div class="input-group">
                                            <span className="form-control">
                                                Este es el property
                                            </span>
                                            <div class="input-group-append">
                                                <button class="btn btn-outline-secondary" type="button">
                                                    <i className="fa fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="button" className="btn btn-danger float-right">Cancel</button>
                            <button type="submit" className="btn btn-success float-right mr-1">Save</button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }

}

export default Form;