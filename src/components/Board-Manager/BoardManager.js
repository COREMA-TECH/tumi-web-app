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

const handleDragStart = (cardId, laneId) => {
    console.log('drag started');
    console.log(`cardId: ${cardId}`);
    console.log(`laneId: ${laneId}`);
};

const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
    console.log('drag ended')
    console.log(`cardId: ${cardId}`)
    console.log(`sourceLaneId: ${sourceLaneId}`)
    console.log(`targetLaneId: ${targetLaneId}`)
}

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
            Position: '',
            Hotel: ''
        }
    }

	/* const Cards = {
         
  
     };*/

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

    getWorkOrders = () => {
        let datas = [];
        let matches = [];

        this.props.client.query({ query: GET_MATCH, variables: {} }).then(({ data }) => {
            console.log("Esto es del lead ", data);
            data.applications.forEach((wo) => {
                //const Hotel = data.getbusinesscompanies.find((item) => { return item.Id == wo.IdEntity });
                //const Shift = ShiftsData.find((item) => { return item.Id == wo.shift });
                //const Users = data.getcontacts.find((item) => { return item.Id == 10 });
                console.log("entro en el data ", data);
                console.log("este es el wo ", wo);
                datas = {
                    id: wo.id,
                    name: wo.firstName + ' ' + wo.lastName,
                    // dueOn: 'Q: ',
                    //subTitle: wo.comment,
                    subTitle: wo.cellPhone,
                    body: wo.cityInfo.DisplayLabel.trim() + ', ' + wo.stateInfo.DisplayLabel.trim(),
                    escalationTextLeftMatch: wo.generalComment,
                    //escalationTextCenter: Users.First_Name + ' ' + Users.Last_Name,
                    escalationTextRightMatch: wo.car == true ? " Yes" : " No",
                    cardStyle: { borderRadius: 6, marginBottom: 15 }
                    //                    id: wo.id, title: wo.comment, description: wo.comment, label: '30 mins'
                };
                matches.push(datas);
            });
        }).catch(error => { })

        this.props.client.query({ query: GET_WORK_ORDERS, variables: {} }).then(({ data }) => {
            console.log("Esto es del wodata ", data);

            let workOrders = [];

            data.workOrder.forEach((wo) => {
                console.log("entramos en el foreach ");

                const Hotel = data.getbusinesscompanies.find((item) => { return item.Id == wo.IdEntity });
                console.log("entramos en hotel ", Hotel);
                const Shift = ShiftsData.find((item) => { return item.Id == wo.shift });
                console.log("entramos en Shift ", Shift);

                const Users = data.getusers.find((item) => { return item.Id == wo.userId });
                console.log("entramos en Users ", Users);

                const Contacts = data.getcontacts.find((item) => { return item.Id == Users.Id_Contact });
                console.log("entramos en Contacts ", Contacts);

                /*                console.log("este es el user ", Users.Id_Contact);
                                console.log("entro en el data ", data);
                                console.log("entro en el contacts ", Contacts);
                */
                datas = {
                    id: wo.id,
                    name: 'Title: ' + wo.position.Position,
                    dueOn: 'Q: ' + wo.quantity,
                    //subTitle: wo.comment,
                    subTitle: 'ID: 000' + wo.id,
                    body: Hotel.Name,
                    //escalationTextLeft: Hotel.Name,
                    escalationTextLeft: Contacts.First_Name + ' ' + Contacts.Last_Name,
                    escalationTextRight: Shift.Name + '-Shift',
                    cardStyle: { borderRadius: 6, marginBottom: 15 }
                    //                    id: wo.id, title: wo.comment, description: wo.comment, label: '30 mins'
                };
                workOrders.push(datas);
            });
            console.log("datos workOrders ", workOrders);
            console.log("datos matches ", matches);

            this.setState(
                {
                    workOrder: workOrders,
                    lane: [
                        {
                            id: 'lane1',
                            title: 'Work Orders',
                            label: ' ',
                            cards: workOrders
                        },
                        {
                            id: 'lane2',
                            title: 'Matches',
                            label: ' ',
                            cards: matches
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
        }).catch(error => { })
    };

    render() {
        return (
            <div className="App">
                <div className="App-header">

                </div>
                <div className="App-intro">
                    <Board
                        //editable
                        onCardAdd={this.handleCardAdd}
                        data={{ lanes: this.state.lane }}
                        draggable
                        onDataChange={this.shouldReceiveNewData}
                        eventBusHandle={this.setEventBus}
                        handleDragStart={handleDragStart}
                        handleDragEnd={handleDragEnd}
                        //onCardClick={() => alert("ola")}
                        //onCardAdd={() => alert("NadaS")}
                        style={{
                            backgroundColor: '#f5f7f9'
                        }}
                        customCardLayout>
                        <CustomCard />
                    </Board>
                </div>
            </div>
        )
        /* return <
             Board data={
                 { lanes: this.state.lane }
             }
     
         />*/
    }
}

export default withApollo(withGlobalContent(BoardManager));