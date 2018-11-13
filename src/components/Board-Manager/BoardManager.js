import React, { Component } from 'react';
import './index.css';
import withGlobalContent from '../Generic/Global';
import withApollo from 'react-apollo/withApollo';
import PropTypes from 'prop-types';

//import { GET_WORK_ORDERS } from "./Mutations";
import { GET_POSTIONS_QUERY, GET_COMPANY_QUERY, GET_WORK_ORDERS, GET_MATCH } from "./Queries";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
//import Board from 'react-trello'
import { Board } from 'react-trello'
import ShiftsData from '../../data/shitfs.json';
import { InputLabel } from '@material-ui/core';
import Query from 'react-apollo/Query';
import SelectNothingToDisplay from '../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';
//import { withInfo } from '@storybook/addon-info'
//import { storiesOf } from '@storybook/react'


const CustomCard = props => {
    return (
        <div>
            <header
                style={{
                    borderBottom: '1px solid #eee',
                    paddingBottom: 0,
                    marginBottom: 0,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    color: props.cardColor
                }}>
                <div style={{ margin: 2, fontSize: 14, fontWeight: 'bold', color: '#3CA2C8' }}>{props.name}</div>
                <div style={{ margin: 2, fontWeight: 'bold', fontSize: 12 }}>{props.dueOn}</div>
                {props.dueOn && <div style={{ margin: 1, fontWeight: 'bold', fontSize: 12 }} ><i class="fas fa-cogs"></i></div>}
            </header>
            <div style={{ fontSize: 14, color: '#4C4C4C' }}>
                <div style={{ margin: 2, color: '#4C4C4C', fontWeight: 'bold' }}>{props.subTitle}</div>
                <div style={{ margin: 2, padding: '0px 0px' }}><i>{props.body}</i>
                </div>
                <header
                    style={{
                        paddingBottom: 0,
                        marginBottom: 0,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        color: props.cardColor
                    }}>
                    <div style={{ margin: 1, fontSize: 12, fontWeight: 'bold' }}>{props.escalationTextLeft}</div>
                    <div style={{ margin: 1, fontSize: 12, fontWeight: 'bold' }}>{props.escalationTextCenter}</div>
                    <div style={{ margin: 1, fontWeight: 'bold', fontSize: 12 }}>{props.escalationTextRight}  </div>
                </header>
                <header
                    style={{
                        paddingBottom: 0,
                        marginBottom: 0,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        color: props.cardColor
                    }}>
                    <div style={{ margin: 1, fontSize: 12, fontWeight: 'bold' }}>{props.escalationTextLeftMatch}</div>
                    <div style={{ margin: 1, fontSize: 12, fontWeight: 'bold' }}>{props.escalationTextCenterMatch}</div>
                    {props.escalationTextRightMatch && <div style={{ margin: 1, fontWeight: 'bold', fontSize: 12 }}><i class="fas fa-car-side"></i>{props.escalationTextRightMatch}  </div>}
                </header>
            </div>
        </div>
    )
}

class BoardManager extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            // workOrder: [{ id: '', title: '', description: '', label: '' }]
            workOrder: [],
            lane: [],

            matches: [],
            workOrders: [],
            Position: '',
            Hotel: ''
        }
    }


    handleDragStart = (cardId, laneId) => {
        console.log('drag started');
        console.log(`cardId: ${cardId}`);
        console.log(`laneId: ${laneId}`);
    };

    handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
        console.log('drag ended')
        console.log(`cardId: ${cardId}`)
        console.log(`sourceLaneId: ${sourceLaneId}`)
        console.log(`targetLaneId: ${targetLaneId}`)
    }



    componentWillMount() {
        this.setState(
            {
                loading: true
            }, () => {
                this.getWorkOrders();
            });
    }

    validateInvalidInput = () => {
        console.log("estoy en accion");
    };

    shouldReceiveNewData = nextData => {
        console.log('New card has been added')
        console.log(nextData)
    }

    handleCardAdd = (card, laneId) => {
        console.log(`New card added to lane ${laneId}`)
        console.dir(card)
    }

    addCardLink = (cardId, metadata, laneId) => {

        console.log("cardId ", cardId);
        console.log("metadata ", metadata);

        this.getMatches(true, true, true, laneId);
    }


    onCardClick = (cardId, metadata, laneId) => {

        console.log("cardId ", cardId);
        console.log("metadata ", metadata);

        this.getMatches(true, true, true, laneId);
    }

    getMatches = async (language, experience, location, laneId) => {
        let getmatches = [];
        let datas = [];

        if (laneId == "lane1") {

            await this.props.client.query({ query: GET_MATCH, variables: {} }).then(({ data }) => {
                data.applications.forEach((wo) => {

                    datas = {
                        id: wo.id,
                        name: wo.firstName + ' ' + wo.lastName,
                        subTitle: wo.cellPhone,
                        body: wo.cityInfo.DisplayLabel.trim() + ', ' + wo.stateInfo.DisplayLabel.trim(),
                        escalationTextLeftMatch: wo.generalComment,
                        escalationTextRightMatch: wo.car == true ? " Yes" : " No",
                        cardStyle: { borderRadius: 6, marginBottom: 15 }
                    };

                    getmatches.push(datas);
                });
            }).catch(error => { })

            this.setState({
                matches: getmatches
            });

            this.setState(
                {
                    workOrder: this.state.workOrders,
                    lane: [
                        {
                            id: 'lane1',
                            title: 'Work Orders',
                            label: ' ',
                            cards: this.state.workOrders,
                            laneStyle: { borderRadius: 10, marginBottom: 15 }
                        },
                        {
                            id: 'lane2',
                            title: 'Matches',
                            label: ' ',
                            cards: this.state.matches
                        },
                        {
                            id: 'lane3',
                            title: 'Notify',
                            label: ' ',
                            cards: []
                        },
                        {
                            id: 'lane4',
                            title: 'Accepted',
                            label: ' ',
                            cards: []
                        },
                        {
                            id: 'lane5',
                            title: 'Add to Schedule',
                            label: ' ',
                            cards: []
                        }
                    ],
                    loading: false
                });
        }
    };

    getWorkOrders = async () => {
        let getworkOrders = [];
        let datas = [];

        await this.props.client.query({ query: GET_WORK_ORDERS, variables: {} }).then(({ data }) => {
            data.workOrder.forEach((wo) => {
                const Hotel = data.getbusinesscompanies.find((item) => { return item.Id == wo.IdEntity });
                const Shift = ShiftsData.find((item) => { return item.Id == wo.shift });
                const Users = data.getusers.find((item) => { return item.Id == wo.userId });
                const Contacts = data.getcontacts.find((item) => { return item.Id == (Users != null ? Users.Id_Contact : 10) });

                datas = {
                    id: wo.id,
                    name: 'Title: ' + wo.position.Position,
                    dueOn: 'Q: ' + wo.quantity,
                    subTitle: 'ID: 000' + wo.id,
                    body: Hotel != null ? Hotel.Name : '',
                    escalationTextLeft: Contacts != null ? Contacts.First_Name + ' ' + Contacts.Last_Name : '',
                    escalationTextRight: Shift != null ? Shift.Name + '-Shift' : '',
                    cardStyle: { borderRadius: 6, marginBottom: 15 }
                };
                getworkOrders.push(datas);
            });

            this.setState({
                workOrders: getworkOrders
            });


        }).catch(error => { })

        this.setState(
            {
                workOrder: this.state.workOrders,
                lane: [
                    {
                        id: 'lane1',
                        title: 'Work Orders',
                        label: ' ',
                        cards: this.state.workOrders,
                        laneStyle: { borderRadius: 10, marginBottom: 15 }
                    },
                    {
                        id: 'lane2',
                        title: 'Matches',
                        label: ' ',
                        cards: this.state.matches
                    },
                    {
                        id: 'lane3',
                        title: 'Notify',
                        label: ' ',
                        cards: []
                    },
                    {
                        id: 'lane4',
                        title: 'Accepted',
                        label: ' ',
                        cards: []
                    },
                    {
                        id: 'lane5',
                        title: 'Add to Schedule',
                        label: ' ',
                        cards: []
                    }
                ],
                loading: false
            });
    };

    render() {
        return (
            <div className="App">
                <div className="App-header">
                </div>
                <div className="App-intro">
                    <Board
                        data={{ lanes: this.state.lane }}
                        draggable={true}
                        laneDraggable={false}
                        onDataChange={this.shouldReceiveNewData}
                        eventBusHandle={this.setEventBus}
                        handleDragStart={this.handleDragStart}
                        handleDragEnd={this.handleDragEnd}
                        onCardClick={this.onCardClick}
                        style={{
                            backgroundColor: '#f5f7f9'
                        }}
                        customCardLayout>
                        <CustomCard />

                    </Board>
                </div>
            </div>
        )
    }
}

export default withApollo(withGlobalContent(BoardManager));