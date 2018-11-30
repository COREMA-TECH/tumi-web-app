import React, { Component } from 'react';
import withGlobalContent from 'Generic/Global';

class Holidays extends Component {

    days = [
        'MON', 'TUE', 'WED', 'TU', 'FRY', 'SAT', 'SUN'
    ];

    months = [
        'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'OCT', 'NOV', 'DIC'
    ];

    numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

    render() {
        return (
            <div className="row Holidays">
                <div className="col-md-12">
                    <div className="card">
                        <div className="row pt-0 pb-0">
                            <div className="col-lg-12 col-xl-8">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <label htmlFor="">Name</label>
                                            <input type="text" className="form-control" />
                                        </div>
                                        <div className="col-md-8">
                                            <label htmlFor="">Description</label>
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="DaysWeekMonth-wrapper">
                                        <div className="Days">
                                            <ul className="Days-list">
                                                {this.days.map((day) => {
                                                    return (
                                                        <li className="Days-item">
                                                            {day}
                                                            <i class="fas fa-check-circle selected"></i>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                        <div className="Weeks">
                                            <ul className="Weeks-list">
                                                <li className="Weeks-item">
                                                    <span className="Weeks-title">Weeks:</span>
                                                </li>
                                                <li className="Weeks-item">
                                                    <span>1st</span>
                                                </li>
                                                <li className="Weeks-item">
                                                    <span>2nd</span>
                                                </li>
                                                <li className="Weeks-item">
                                                    <span>3rd</span>
                                                </li>
                                                <li className="Weeks-item">
                                                    <span>4rt</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="Months">
                                            <ul className="Months-list">
                                                {this.months.map((month) => {
                                                    return (
                                                        <li className="Months-item">
                                                            {month}
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 col-xl-4 CalendarCol">
                                <div className="Calendar">
                                    <h2 className="Calendar-title">
                                        Days of Calendar
                                    </h2>
                                    <ul className="CalendarNumbers">
                                        {this.numbers.map((number) => {
                                            return (
                                                <li className="CalendarNumbers-item">{number}</li>
                                            );
                                        })}
                                    </ul>
                                    <div className="Anually">
                                        <span className="Anually-label">Anually</span>
                                        <label class="check">
                                            <input type="checkbox" />
                                            <div class="box"></div>
                                        </label>
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

export default withGlobalContent(Holidays);
