import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import events from './events';
import moment from 'moment';
import { GET_HOLIDAYS } from './queries';
import { withApollo } from 'react-apollo';
import Query from 'react-apollo/Query';

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

const localizer = BigCalendar.momentLocalizer(moment);


class Calendar extends Component {

    constructor() {
        super();
        this.state = {
            events: []
        }
    }

    UNSAFE_componentWillMount() {
        this.props.client
            .query({
                query: GET_HOLIDAYS
            })
            .then(({ data }) => {
                this.setState({
                    events: data.holidays
                }, () => { console.log(this.state.events) });
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
                            onSelectEvent={event => alert(event.resource)}
                        //  components={components}
                        />
                    </div>
                </div>
            </div>

        );

    }
}
export default withApollo(Calendar);