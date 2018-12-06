import React, { Component } from 'react';
import withGlobalContent from 'Generic/Global';
import { CREATE_HOLIDAY, UPDATE_HOLIDAY } from "./Mutations";
import { GET_HOLIDAYS } from './Queries';

import withApollo from "react-apollo/withApollo";

class Holidays extends Component {
    state = {
        id: 0,
        name: '',
        description: '',
        anually: false,
        weekDays: [{ id: 1, name: 'MON', selected: false, selected: false }, { id: 2, name: 'TUE', selected: false }, { id: 3, name: 'WED', selected: false }, { id: 4, name: 'TU', selected: false }, { id: 5, name: 'FRY', selected: false }, { id: 6, name: 'SAT', selected: false }, { id: 7, name: 'SUN', selected: false }],
        weekNumbers: [{ id: 1, name: '1st', selected: false }, { id: 2, name: '2nd', selected: false }, { id: 3, name: '3rd', selected: false }, { id: 4, name: '4rt', selected: false }],
        monthNumbers: [{ id: 1, name: 'JAN', selected: false }, { id: 2, name: 'FEB', selected: false }, { id: 3, name: 'MAR', selected: false }, { id: 4, name: 'APR', selected: false }, { id: 5, name: 'MAY', selected: false }, { id: 6, name: 'JUN', selected: false }, { id: 7, name: 'JUL', selected: false }, { id: 8, name: 'AUG', selected: false }, { id: 9, name: 'SEP', selected: false }, { id: 10, name: 'OCT', selected: false }, { id: 11, name: 'NOV', selected: false }, { id: 12, name: 'DIC', selected: false }],
        calendarDays: [{ id: 1, selected: false }, { id: 2, selected: false }, { id: 3, selected: false }, { id: 4, selected: false }, { id: 5, selected: false }, { id: 6, selected: false }, { id: 7, selected: false }, { id: 8, selected: false }, { id: 9, selected: false }, { id: 10, selected: false }, { id: 11, selected: false }, { id: 12, selected: false }, { id: 13, selected: false }, { id: 14, selected: false }, { id: 15, selected: false }, { id: 16, selected: false }, { id: 17, selected: false }, { id: 18, selected: false }, { id: 19, selected: false }, { id: 20, selected: false }, { id: 21, selected: false }, { id: 22, selected: false }, { id: 23, selected: false }, { id: 24, selected: false }, { id: 25, selected: false }, { id: 26, selected: false }, { id: 27, selected: false }, { id: 28, selected: false }, { id: 29, selected: false }, { id: 30, selected: false }, { id: 31, selected: false }]
    }

    inputChanged = (name) => (e) => {
        this.setState({ [name]: e.currentTarget.value })
    }

    weekDaysSelected = (e) => {
        let data = this.state.weekDays, id = e.currentTarget.id
        this.unselectComponents("weekDays", data, id)
        let weekDays = this.getNewData(data, id)
        //Update state with the new array
        this.setState({ weekDays })
    }
    monthNumbersSelected = (e) => {
        let data = JSON.parse(JSON.stringify(this.state.monthNumbers)), id = e.currentTarget.id
        let selected = data.find(item => item.id == id);

        let now = new Date()
        let date = new Date(now.getFullYear(), selected.id, 0);
        let calendarDays = JSON.parse(JSON.stringify(this.state.calendarDays));

        if (!selected.selected) {
            calendarDays.map(item => {
                if (item.id > date.getDate()) {
                    item.selected = false;
                }
            })
        }

        let monthNumbers = this.getNewData(data, id)
        //Update state with the new array
        this.setState({ monthNumbers, calendarDays })
    }
    weekNumbersSelected = (e) => {
        let data = this.state.weekNumbers, id = e.currentTarget.id
        this.unselectComponents("weekNumbers", data, id)
        let weekNumbers = this.getNewData(data, id)
        //Update state with the new array
        this.setState({ weekNumbers })
    }
    calendarDaysSelected = (e) => {
        let id = e.currentTarget.id, data = this.state.calendarDays;
        let selected = data.find(item => item.id == id);

        let month = JSON.parse(JSON.stringify(this.state.monthNumbers)).find(item => item.selected == true)
        let now = new Date()
        let date = new Date(now.getFullYear(), month.id, 0);

        if (!selected.selected && selected.id > date.getDate()) {
            return false;
        }

        this.unselectComponents("calendar", data, id)
        let calendarDays = this.getNewData(data, id, true)
        //Update state with the new array
        this.setState({ calendarDays })
    }

    unselectComponents = (name, data, id) => {
        //Getting array
        let arrayCopy = JSON.parse(JSON.stringify(data))

        //Find value in the array
        let item = arrayCopy[id - 1]
        if (name == "calendar") {
            if (!item.selected) {
                this.unselectWeeks()
            }

        } else {
            let cData = JSON.parse(JSON.stringify(this.state.calendarDays))
            cData.map(item => {
                item.selected = false//Unselect all items 
            })
            this.setState({ calendarDays: cData, anually: false })
        }
    }
    unselectWeeks = () => {
        //Unselect elements for Week Numbers and Week Days components when calendar day is selected
        let wnData = JSON.parse(JSON.stringify(this.state.weekNumbers))
        let wdData = JSON.parse(JSON.stringify(this.state.weekDays))
        wnData.map(item => {
            item.selected = false//Unselect all items except the clicked element
        })
        wdData.map(item => {
            item.selected = false//Unselect all items except the clicked element
        })
        this.setState({ weekDays: wdData, weekNumbers: wnData })
    }

    getNewData = (data, id, allowMultiple = false) => {
        //Getting array
        let arrayCopy = JSON.parse(JSON.stringify(data))
        if (!allowMultiple) {
            arrayCopy.map(item => {
                if (item.id == id)
                    item.selected = !item.selected;//Change status checked for clicked element
                else
                    item.selected = false//Unselect all items except the clicked element
            })

        } else {
            //Find value in the array
            let item = arrayCopy[id - 1]
            //Change selected value
            item.selected = !item.selected
        }

        return arrayCopy;
    }
    onCheckedChange = (e) => {
        this.setState({ anually: e.currentTarget.checked }, () => { if (this.state.anually) this.unselectWeeks() })
    }
    onHandleSave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { valid, type } = this.validateSelection();
        //D = Day of Week , C= Day of the calendar, W = Number of Week
        if (valid) {
            let startDate, endDate, result;
            result = this.getFinalDates(type);
            startDate = result.startDate;
            endDate = result.endDate;

            this.setState({ inserting: true })

            if (this.state.id) this.updateHoliday(startDate, endDate)
            else this.createHoliday(startDate, endDate)
        }
    }
    createHoliday(startDate, endDate) {
        this.props.client.mutate({
            mutation: CREATE_HOLIDAY,
            variables: {
                holidays: {
                    title: this.state.name,
                    description: this.state.description,
                    startDate: startDate,
                    endDate: endDate,
                    CompanyId: 1,
                    anually: this.state.anually,
                    weekDays: JSON.stringify(this.state.weekDays),
                    weekNumbers: JSON.stringify(this.state.weekNumbers),
                    months: JSON.stringify(this.state.monthNumbers),
                    calendarDays: JSON.stringify(this.state.calendarDays)
                }
            }
        }).then(({ data }) => {
            this.setState({ id: data.addHoliday[0].id, inserting: false })
            this.props.handleOpenSnackbar('success', "Holiday Inserted", 'bottom', 'right');
            this.props.handleClose();
        }).catch((error) => {
            this.setState({ inserting: false })
            this.props.handleOpenSnackbar(
                'error',
                'Error creating Holiday!',
                'bottom',
                'right'
            );
        });
    }

    updateHoliday(startDate, endDate) {
        this.props.client.mutate({
            mutation: UPDATE_HOLIDAY,
            variables: {
                holiday: {
                    id: this.state.id,
                    title: this.state.name,
                    description: this.state.description,
                    startDate: startDate,
                    endDate: endDate,
                    CompanyId: 1,
                    anually: this.state.anually,
                    weekDays: JSON.stringify(this.state.weekDays),
                    weekNumbers: JSON.stringify(this.state.weekNumbers),
                    months: JSON.stringify(this.state.monthNumbers),
                    calendarDays: JSON.stringify(this.state.calendarDays)
                }
            }
        }).then(({ data }) => {
            this.setState({ inserting: false })
            this.props.handleOpenSnackbar('success', "Holiday Updated", 'bottom', 'right');
            this.props.handleClose();
        }).catch((error) => {
            this.setState({ inserting: false })
            this.props.handleOpenSnackbar(
                'error',
                'Error updating Holiday!',
                'bottom',
                'right'
            );
        });
    }
    getFinalDates = (type) => {
        let now = new Date();
        let cMonth = JSON.parse(JSON.stringify(this.state.monthNumbers));
        let month = cMonth.find(item => item.selected).id;
        let range, startDate, endDate;
        let cData;
        switch (type) {
            case "C":
                cData = JSON.parse(JSON.stringify(this.state.calendarDays));
                let first = cData.find(item => item.selected).id;
                let last = cData.sort((a, b) => b.id - a.id).find(item => item.selected).id;
                startDate = new Date(now.getFullYear(), month - 1, first);
                endDate = new Date(now.getFullYear(), month - 1, last);

                break;
            case "W":
                range = this.calculateRange()

                startDate = range.startDate
                endDate = range.endDate

                break;
            case "D":
                range = this.calculateRange()
                cData = JSON.parse(JSON.stringify(this.state.weekDays));

                var selected = cData.find(item => item.selected).id;

                var dates = this.getDates(range.startDate, range.endDate);

                startDate = dates.find(item => (item.getDay() || 7) == selected)
                endDate = startDate

                break;
            default:
                startDate = now;
                endDate = now;
                break;
        }
        let sDate = this.addHours(startDate, 0, 0, 0), eDate = this.addHours(endDate, 23, 0, 0);

        return {
            startDate: sDate,
            endDate: eDate
        }
    }
    addHours = (date, hh, mm, ss) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hh, mm, ss)
    }
    calculateRange = () => {
        let cData = JSON.parse(JSON.stringify(this.state.weekNumbers));
        let wNumber = cData.find(item => item.selected).id, startDate, endDate;
        let now = new Date();
        let cMonth = JSON.parse(JSON.stringify(this.state.monthNumbers));
        let month = cMonth.find(item => item.selected).id;

        startDate = new Date(now.getFullYear(), month - 1, (wNumber * 8) - (6 + wNumber))
        if (wNumber < 4)
            endDate = new Date(now.getFullYear(), month - 1, (wNumber * 7))
        else
            endDate = new Date(now.getFullYear(), month, 0)
        return { startDate, endDate }
    }
    getDates = (startDate, endDate) => {
        var dates = [],
            currentDate = startDate,
            addDays = function (days) {
                var date = new Date(this.valueOf());
                date.setDate(date.getDate() + days);
                return date;
            };
        while (currentDate <= endDate) {
            dates.push(currentDate);
            currentDate = addDays.call(currentDate, 1);
        }
        return dates;
    }
    validateSelection = () => {
        let counter = 0, monthSelected = false, weekSelected = false, weekDaysSelected = false, calendarDaysSelected = false, indexSelected = -1;
        //Validate Month selection
        this.state.monthNumbers.map(item => { if (item.selected) counter++; })
        if (counter != 1) {
            this.props.handleOpenSnackbar('warning', "You need to select a month", 'bottom', 'right');
            return { valid: false, type: '' };
        }
        monthSelected = counter > 0, counter = 0;
        //Validate Week selection
        this.state.weekNumbers.map(item => { if (item.selected) counter++; })
        if (counter > 1) {
            this.props.handleOpenSnackbar('warning', "Only one Week must be selected", 'bottom', 'right');
            return { valid: false, type: '' };
        }
        weekSelected = counter > 0, counter = 0;
        //Validate Day of Week Selection
        this.state.weekDays.map(item => { if (item.selected) counter++; })
        if (counter > 1) {
            this.props.handleOpenSnackbar('warning', "Only one Week Day must be selected", 'bottom', 'right');
            return { valid: false, type: '' };
        }
        // this.state.weekDays.map(item => {
        //     if (item.selected) {
        //         if (indexSelected != -1) {
        //             let dif = item.id - indexSelected;
        //             if (dif != 1) {
        //                 this.props.handleOpenSnackbar('warning', "The days of the week can not be interleaved", 'bottom', 'right');
        //                 return { valid: false, type: '' };
        //             }
        //             else { indexSelected = item.id; }
        //         } else { indexSelected = item.id; }
        //         counter++;
        //     }
        // })
        weekDaysSelected = counter > 0, counter = 0;
        let breakEach = false;
        //Validate Calendar Day Selection
        this.state.calendarDays.map(item => {
            if (item.selected) {
                if (indexSelected != -1) {
                    let dif = item.id - indexSelected;
                    if (dif != 1) {
                        this.props.handleOpenSnackbar('warning', "The days of the caleandar can not be interleaved", 'bottom', 'right');
                        breakEach = true;
                        return;
                    }
                    else { indexSelected = item.id; }
                } else { indexSelected = item.id; }
                counter++;
            }
        })
        if (breakEach)
            return { valid: false, type: '' };

        calendarDaysSelected = counter > 0, counter = 0;

        //Validate that only Calendar Day and Month can be selected as one combination
        if ((monthSelected && calendarDaysSelected) && (weekSelected || weekDaysSelected)) {
            this.props.handleOpenSnackbar('warning', "Combination can't be done", 'bottom', 'right');
            return { valid: false, type: '' };
        }
        //Validate that must be selected a Week number when Month and Week Day have been selected
        if (monthSelected && weekDaysSelected && !weekSelected) {
            this.props.handleOpenSnackbar('warning', "Number of week need to be selected", 'bottom', 'right');
            return { valid: false, type: '' };
        }
        //Validate that must be selected a combination with a month 
        if (monthSelected && !weekDaysSelected && !weekSelected && !calendarDaysSelected) {
            this.props.handleOpenSnackbar('warning', "A combination need to be done", 'bottom', 'right');
            return { valid: false, type: '' };
        }
        //Valida Name and Desctiption
        if (!this.state.name.trim() || !this.state.description.trim()) {
            this.props.handleOpenSnackbar('warning', "You need to specify a name and a description", 'bottom', 'right');
            return { valid: false, type: '' };
        }
        let type = 'D';//D = Day of Week , C= Day of the calendar, W = Number of Week
        if (calendarDaysSelected)
            type = 'C'
        else
            if (!weekDaysSelected && this.weekNumbersSelected)
                type = 'W'

        return { valid: true, type };
    }

    loadHoliday = () => {
        this.props.client
            .query({
                query: GET_HOLIDAYS,
                fetchPolicy: 'no-cache',
                variables: {
                    id: this.state.id
                }
            })
            .then(({ data }) => {
                let { holidays } = data;
                if (holidays.length == 0)
                    this.props.handleOpenSnackbar('warning', "Holiday was not found", 'bottom', 'right');
                else {
                    let holiday = holidays[0];

                    this.setState({
                        anually: holiday.anually,
                        name: holiday.title,
                        description: holiday.description,
                        id: holiday.id
                    }, () => {
                        try {
                            this.setState({
                                monthNumbers: JSON.parse(holiday.months),
                                weekNumbers: JSON.parse(holiday.weekNumbers),
                                weekDays: JSON.parse(holiday.weekDays),
                                calendarDays: JSON.parse(holiday.calendarDays)
                            })
                        }
                        catch (e) {
                            this.props.handleOpenSnackbar('warning', e.message, 'bottom', 'right');
                        }
                    })
                }
            })
            .catch(e => {
                this.props.handleOpenSnackbar('warning', "Error loading holiday", 'bottom', 'right');
            });
    }

    componentWillMount() {
        console.log("will mount")
        let { idHoliday, idCompany } = this.props;
        this.setState({
            id: idHoliday,
            idCompany: idCompany
        }, () => {
            if (this.state.id)
                this.loadHoliday()
        })
    }
    getPrettyDates = () => {
        let selectedWeekDay = this.state.weekDays.find(item => item.selected == true)
        let selectedWeekNumber = this.state.weekNumbers.find(item => item.selected == true)
        let selectedMont = this.state.monthNumbers.find(item => item.selected == true)

        let calendarData = JSON.parse(JSON.stringify(this.state.calendarDays));
        let firstCalendarDay = calendarData ? this.state.calendarDays.find(item => item.selected == true) : null
        let lastCalendarDay = calendarData ? calendarData.sort((a, b) => b.id - a.id).find(item => item.selected == true) : null
        let prettyDate = "";



        if (firstCalendarDay)
            prettyDate += `From ${firstCalendarDay.id} `
        if (lastCalendarDay)
            prettyDate += `to ${lastCalendarDay.id} of `
        if (firstCalendarDay)
            if (firstCalendarDay.id == lastCalendarDay.id)
                prettyDate = `${firstCalendarDay.id} `


        if (selectedWeekDay)
            prettyDate += `${selectedWeekDay.name} of `
        if (selectedWeekNumber)
            prettyDate += `${selectedWeekNumber.name} Week of `
        if (selectedMont)
            prettyDate += selectedMont.name


        return prettyDate;

    }

    render() {
        return (
            <form autoComplete="off" id="holiday-form" onSubmit={this.onHandleSave}>
                <div className="row Holidays">
                    <div className="col-md-12">
                        <button className="btn btn-success float-right" type="submit">
                            Save
                             {!this.state.inserting && <i className="fas fa-save ml-1"></i>}
                            {this.state.inserting && <i className="fas fa-spinner fa-spin ml-1"></i>}
                        </button>
                    </div>
                    <div className="col-md-12">
                        <div className="card">
                            <div className="row pt-0 pb-0">
                                <div className="col-lg-12 col-xl-8">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <label htmlFor="">Name</label>
                                                <input type="text" className="form-control" value={this.state.name} onChange={this.inputChanged('name')} required maxLength={50} />
                                            </div>
                                            <div className="col-md-8">
                                                <label htmlFor="">Description</label>
                                                <input type="text" className="form-control" value={this.state.description} onChange={this.inputChanged('description')} required maxLength={100} />
                                            </div>
                                        </div>
                                        <div className="DaysWeekMonth-wrapper">
                                            <div className="Months">
                                                <ul className="Months-list">
                                                    {this.state.monthNumbers.map((item) => {
                                                        return (
                                                            <li id={item.id} key={item.id} data-selected={item.selected} className="Months-item" onClick={this.monthNumbersSelected}>
                                                                {item.name}
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
                                                            <li id={item.id} key={item.id} className="Weeks-item" data-selected={item.selected} onClick={this.weekNumbersSelected}>
                                                                <span> {item.name}</span>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                            <div className="Days">
                                                <ul className="Days-list">
                                                    {this.state.weekDays.map((item) => {
                                                        return (
                                                            <li id={item.id} key={item.id} className="Days-item" data-selected={item.selected} onClick={this.weekDaysSelected}>
                                                                {item.name}
                                                                <i className="fas fa-check-circle selected"></i>
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
                                            {this.state.calendarDays.map((item) => {
                                                return (
                                                    <li id={item.id} key={item.id} data-selected={item.selected} className="CalendarNumbers-item" onClick={this.calendarDaysSelected}>{item.id}</li>
                                                );
                                            })}
                                        </ul>
                                        <div className="Anually">
                                            <span className="Anually-label">Anually</span>
                                            <label className="check">
                                                <input type="checkbox" checked={this.state.anually} onChange={this.onCheckedChange} />
                                                <div className="box"></div>
                                            </label>
                                        </div>
                                        <div className="Summary">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <span className="Summary-head">
                                                        Name
                                                    </span>
                                                    <span className="Summary-content">
                                                        {this.state.name}
                                                    </span>
                                                    <span className="Summary-head">
                                                        Description
                                                    </span>
                                                    <span className="Summary-content">
                                                        {this.state.description}
                                                    </span>
                                                </div>
                                                <div className="col-md-6">
                                                    <span className="Summary-head">
                                                        Apply
                                                    </span>
                                                    <span className="Summary-content">
                                                        {this.getPrettyDates()}
                                                    </span>
                                                    <span className="Summary-head">
                                                        Anually
                                                    </span>
                                                    <span className="Summary-content">
                                                        {this.state.anually ? 'Yes' : 'No'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }

}

export default withApollo(Holidays);
