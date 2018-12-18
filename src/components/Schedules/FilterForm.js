import React, { Component } from 'react';
import Options from './Options';

class Form extends Component {

    render() {
        return (
            <div className="MasterShiftForm">
                <Options />
                <form action="">
                    <div className="row">
                        <div className="col-md-12">
                            <label htmlFor="">Employess</label>
                            <input type="text" name="employees" className="form-control" />
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="">Start Date</label>
                            <input type="date" name="start-date" className="form-control" />
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="">End Date</label>
                            <input type="date" name="end-date" className="form-control" />
                        </div>
                        <div className="col-md-5">
                            <label htmlFor="">Start Time</label>
                            <input type="time" name="start-hour" className="form-control" />
                        </div>
                        <div className="col-md-5">
                            <label htmlFor="">End Time</label>
                            <input type="time" name="end-hour" className="form-control" />
                        </div>
                        <div className="col-md-2">
                            <span className="MasterShiftForm-hour" data-hour="4h"></span>
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="">Location</label>
                            <input type="text" className="form-control" name="location" />
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="">Color</label>
                            <input type="text" className="form-control" name="location" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <button className="btn btn-success float-right" type="submit">
                                Publish
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

}

export default Form;