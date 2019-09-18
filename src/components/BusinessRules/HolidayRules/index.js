import React, {Component, Fragment} from 'react';

import withApollo from 'react-apollo/withApollo';
import withGlobalContent from "../../Generic/Global";

import moment from 'moment';
import {GET_HOLIDAYS} from './queries';

class HolidayRules extends Component{
    INITIAL_STATE = {
        multiplier: 1,
        holidays: []
    }

    constructor(props){
        super(props);
        this.state = { ...this.INITIAL_STATE }
        
        this.fetchHolidays();
    }

    handleChange = ({target: {name, value}}) => {
        this.setState(_ => ({
            [name]: value
        }));
    }

    fetchHolidays = _ => {
        this.props.client.query({
            query: GET_HOLIDAYS,
            fetchPolicy: "no-cache"
        })
        .then(({data: {holidays}}) => {
            this.setState(_ => ({
                holidays
            }));
        })
        .catch(error => {
            this.props.handleOpenSnackbar(
                'error',
                `${error}`,
                'bottom',
                'center'
            );
        });
    }

    render(){
        return(
            <Fragment>
                <div className="BRModal-section form-group form-row tumi-row-vert-center">
                    <label className="col-sm-2">Multiplier</label>
                    <div className="col-sm-10">
                        <div className="form-row">
                            <input className="form-control col-sm-2 text-center" value={this.state.multiplier} onChange={this.handleChange} name="multiplier" type="number" min='1' step="1" pattern="[0-9]" id="multiplier"/>
                            <label className="pl-2 col-sm-4" htmlFor="multiplier">x base pay</label>
                        </div>
                    </div>                                
                </div>
                <div className="BRModal-holidays BRModal-section no-border">
                    <div className="form-row">
                        <div className="col-sm-12">
                            <a type="submit" style={{color: "#FFFFFF"}} className="btn btn-success mr-2">+ Add Holiday</a> 
                            <table className="table table-responsive" style={{display: "table"}}>
                                <thead>
                                    <tr>
                                        <th>Holyday</th>
                                        <th>Active Date</th>
                                    </tr>                                    
                                </thead>
                                <tbody>                                        
                                    {
                                        this.state.holidays.map(item => {
                                            return (
                                                <tr>
                                                    <td>{item.title}</td>
                                                    <td>{`${moment(item.startDate).format("DD MMM, YYYY")}`}{item.endDate ? ` - ${moment(item.endDate).format("DD MMM, YYYY")}` : ''}</td>
                                                </tr>
                                            )
                                        })
                                    }                                        
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div> 
            </Fragment>
        )
    }
}

export default withApollo(withGlobalContent(HolidayRules));