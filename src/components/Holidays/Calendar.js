import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import events from './events';
import moment from 'moment';
import { GET_HOLIDAYS } from './Queries';
import { withApollo } from 'react-apollo';
import Query from 'react-apollo/Query';
import Holidays from './index';
import { GenericDialog } from 'ui-components/ProfilePicture/Dialog';

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

const localizer = BigCalendar.momentLocalizer(moment);


class Calendar extends Component {

    constructor() {
        super();
        this.state = {
            events: [],
            idHoliday: 0,
            open: false
        }
    }

    UNSAFE_componentWillMount() {
        this.getHolidays();
    }

    getHolidays = () => {
        this.props.client
            .query({
                query: GET_HOLIDAYS
            })
            .then(({ data }) => {
                this.setState({
                    events: data.holidays
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    MyEvent = () => {
        //alert(' hola');
    }

    handleSelect = ({ start, end }) => {

    }

    handleClose = () => {
        this.setState({
            open: false
        }, this.getHolidays);
    }


    render() {
        let components = {
            event: this.MyEvent // used by each view (Month, Day, Week)
        };
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="MainCalendar">
                        <BigCalendar
                            localizer={localizer}
                            events={this.state.events}
                            startAccessor="start"
                            endAccessor="end"
                            onSelectEvent={event => {
                                this.setState({
                                    idHoliday: event.id,
                                    open: true
                                }, event.stopPropagation)
                            }}
                        //  components={components}
                        />
                    </div>
                </div>
                <GenericDialog
                    open={this.state.open}
                    handleClose={this.handleClose}
                    title=""
                    maxWidth={'lg'}
                >
                    <Holidays idCompany={this.props.idCompany} idHoliday={this.state.idHoliday} handleOpenSnackbar={this.props.handleOpenSnackbar} handleClose={this.handleClose} />
                </GenericDialog>
            </div>
        );

    }
}
export default withApollo(Calendar);