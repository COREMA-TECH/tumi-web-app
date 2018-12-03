import React, { Component } from 'react';
import withGlobalContent from 'Generic/Global';

class Holidays extends Component {
    state = {
        name: '',
        description: '',
        weekDays: [{ id: 1, name: 'MON', selected: false }, { id: 2, name: 'TUE', selected: false }, { id: 3, name: 'WED', selected: false }, { id: 4, name: 'TU', selected: false }, { id: 5, name: 'FRY', selected: false }, { id: 6, name: 'SAT', selected: false }, { id: 7, name: 'SUN', selected: false }],
        weekNumbers: [{ id: 1, name: '1st', selected: false }, { id: 2, name: '2nd', selected: false }, { id: 3, name: '3rd', selected: false }, { id: 4, name: '4rt', selected: false }],
        monthNumbers: [{ id: 1, name: 'JAN', selected: false }, { id: 2, name: 'FEB', selected: false }, { id: 3, name: 'MAR', selected: false }, { id: 4, name: 'APR', selected: false }, { id: 5, name: 'MAY', selected: false }, { id: 6, name: 'JUN', selected: false }, { id: 7, name: 'JUL', selected: false }, { id: 8, name: 'AUG', selected: false }, { id: 9, name: 'SEP', selected: false }, { id: 10, name: 'OCT', selected: false }, { id: 11, name: 'NOV', selected: false }, { id: 12, name: 'DIC', selected: false }]
    }

    numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

    inputChanged = (name) => (e) => {
        this.setState({ [name]: e.currentTarget.value })
    }

    weekDaysSelected = (e) => {
        let weekDays = this.getNewData(this.state.weekDays, e.currentTarget.id)
        //Update state with the new array
        this.setState({ weekDays })
    }
    monthNumbersSelected = (e) => {
        let monthNumbers = this.getNewData(this.state.monthNumbers, e.currentTarget.id)
        //Update state with the new array
        this.setState({ monthNumbers })
    }
    weekNumbersSelected = (e) => {
        let weekNumbers = this.getNewData(this.state.weekNumbers, e.currentTarget.id)
        //Update state with the new array
        this.setState({ weekNumbers })
    }
    getNewData = (data, id) => {
        //Getting array
        let arrayCopy = JSON.parse(JSON.stringify(data))
        //Find Day of the week in the array
        let item = arrayCopy[id - 1]
        //Change selected value
        item.selected = !item.selected
        //Update state with the new array
        return arrayCopy;
    }
    render() {
        console.log("this is my state", this.state)
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
                                            <input type="text" className="form-control" onChange={this.inputChanged('name')} />
                                        </div>
                                        <div className="col-md-8">
                                            <label htmlFor="">Description</label>
                                            <input type="text" className="form-control" onChange={this.inputChanged('description')} />
                                        </div>
                                    </div>
                                    <div className="DaysWeekMonth-wrapper">
                                        <div className="Days">
                                            <ul className="Days-list">
                                                {this.state.weekDays.map((item) => {
                                                    return (
                                                        <li id={item.id} className="Days-item" data-selected={item.selected} onClick={this.weekDaysSelected}>
                                                            {item.name}
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
                                                {this.state.weekNumbers.map((item) => {
                                                    return (
                                                        <li id={item.id} className="Weeks-item" data-selected={item.selected} onClick={this.weekNumbersSelected}>
                                                            <span> {item.name}</span>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                        <div className="Months">
                                            <ul className="Months-list">
                                                {this.state.monthNumbers.map((item) => {
                                                    return (
                                                        <li id={item.id} data-selected={item.selected} className="Months-item" onClick={this.monthNumbersSelected}>
                                                            {item.name}
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
