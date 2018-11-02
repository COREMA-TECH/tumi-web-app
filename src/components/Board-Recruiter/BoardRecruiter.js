import React, { Component } from 'react';
import './index.css'
import withGlobalContent from "../Generic/Global";
import withApollo from "react-apollo/withApollo";
import PropTypes from 'prop-types';

import { UPDATE_APPLICANT } from "./Mutations";
import { GET_POSTIONS_QUERY, GET_COMPANY_QUERY, GET_OPENING, GET_LEAD } from "./Queries";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
//import Board from 'react-trello'
import { Board } from 'react-trello'
import ShiftsData from '../../data/shitfs.json';
import { InputLabel } from '@material-ui/core';
import Query from 'react-apollo/Query';
import SelectNothingToDisplay from '../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';



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
            </header>
            <div style={{ fontSize: 12, color: '#4C4C4C' }}>
                <div style={{ margin: 2, color: '#4C4C4C', fontWeight: 'bold' }}>{props.subTitle}</div>
                <div style={{ margin: 5, padding: '0px 0px' }}><i>{props.body}</i>
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
                    <div style={{ margin: 1, fontSize: 12, fontWeight: 'bold' }}>{props.escalationTextLeftLead}</div>
                    <div style={{ margin: 1, fontSize: 12, fontWeight: 'bold' }}>{props.escalationTextCenterLead}</div>
                    {props.escalationTextRightLead && <div style={{ margin: 1, fontWeight: 'bold', fontSize: 12 }}><i class="fas fa-car-side"></i>{props.escalationTextRightLead}  </div>}
                </header>
            </div>
        </div>
    )
}

class BoardRecruiter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            // workOrder: [{ id: '', title: '', description: '', label: '' }]
            Opening: [],
            lead: [],
            lane: [],
            Position: '',
            Hotel: '',
            checked: true
        }
    }

    handleDragStart = (cardId, laneId) => {
        console.log('drag started')
        console.log(`cardId: ${cardId}`)
        console.log(`laneId: ${laneId}`)
    }

    handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
        console.log('drag ended')
        console.log(`cardId: ${cardId}`)
        console.log(`sourceLaneId: ${sourceLaneId}`)
        console.log(`targetLaneId: ${targetLaneId}`)

        if (sourceLaneId == "lane2" && targetLaneId == "lane3") {
            this.updateApplicationInformation(cardId, false, 'Lead now is a Applicant');
        }
        if (sourceLaneId == "lane3" && targetLaneId == "lane2") {
            this.updateApplicationInformation(cardId, true, 'Applicant now is a Lead ');
        }

    }
    componentWillMount() {
        this.setState(
            {
                loading: true
            }, () => {

                this.getOpenings();

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

    updateApplicationInformation = (id, isLead, Message) => {
        this.setState(
            {
                insertDialogLoading: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: UPDATE_APPLICANT,
                        variables: {

                            id: id,
                            isLead: isLead

                        }
                    })
                    .then(({ data }) => {
                        this.setState({
                            editing: false
                        });

                        this.props.handleOpenSnackbar('success', Message, 'bottom', 'right');
                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar(
                            'error',
                            'Error to update applicant information. Please, try again!',
                            'bottom',
                            'right'
                        );
                    });
            }
        );
    };

    getOpenings = () => {
        let datas = [];
        let leads = [];

        this.props.client.query({ query: GET_LEAD, variables: {} }).then(({ data }) => {
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
                    escalationTextLeftLead: wo.generalComment,
                    //escalationTextCenter: Users.First_Name + ' ' + Users.Last_Name,
                    escalationTextRightLead: wo.car == true ? " Yes" : " No",
                    cardStyle: { borderRadius: 6, marginBottom: 15 }
                    //                    id: wo.id, title: wo.comment, description: wo.comment, label: '30 mins'
                };
                leads.push(datas);
            });
        }).catch(error => { })
        this.props.client.query({ query: GET_OPENING, variables: {} }).then(({ data }) => {
            //let datas = [];
            let Openings = [];


            data.workOrder.forEach((wo) => {
                const Hotel = data.getbusinesscompanies.find((item) => { return item.Id == wo.IdEntity });
                const Shift = ShiftsData.find((item) => { return item.Id == wo.shift });
                const Users = data.getcontacts.find((item) => { return item.Id == 10 });
                console.log("entro en el data ", data);
                datas = {
                    id: wo.id,
                    name: 'Title: ' + wo.position.Position,
                    dueOn: 'Q: ' + wo.quantity,
                    //subTitle: wo.comment,
                    subTitle: 'ID: 000' + wo.id,
                    //body: Users.First_Name + ' ' + Users.Last_Name,
                    escalationTextLeft: Hotel.Name,
                    //escalationTextCenter: Users.First_Name + ' ' + Users.Last_Name,
                    escalationTextRight: Shift.Name + '-Shift',
                    cardStyle: { borderRadius: 6, marginBottom: 15 }
                    //                    id: wo.id, title: wo.comment, description: wo.comment, label: '30 mins'
                };
                Openings.push(datas);
            });
            this.setState(
                {
                    Opening: Openings,
                    lane: [
                        {
                            id: 'lane1',
                            title: 'Openings',
                            label: ' ',
                            cards: Openings
                        },
                        {
                            id: 'lane2',
                            title: 'Leads',
                            label: ' ',
                            cards: leads
                        },
                        {
                            id: 'lane3',
                            title: 'Applied',
                            label: ' ',
                            cards: []
                        },
                        {
                            id: 'lane4',
                            title: 'Candidate',
                            label: ' ',
                            cards: []
                        },
                        {
                            id: 'lane5',
                            title: 'Placement',
                            label: ' ',
                            cards: []
                        }
                    ],
                    loading: false
                });
        }).catch(error => { })
    };

    handleSwitchView = (event) => {
        this.setState({ checked: false });
        window.setTimeout(function () {

            // Move to a new location or you can do something else
            window.location.href = "/home/board/manager"

        }, 1000);
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <div className="row">
                        <div className="col-md-12">
                            <label>View Like Recruiter?</label>
                            <div className="onoffswitch">
                                <input
                                    checked={this.state.checked == true ? true : false}
                                    type="checkbox"
                                    name="needEnglishggg"
                                    onChange={this.handleSwitchView}
                                    className="onoffswitch-checkbox"
                                    id="myonoffswitchSpeak1"
                                />
                                <label className="onoffswitch-label" htmlFor="myonoffswitchSpeak1">
                                    <span className="onoffswitch-inner" />
                                    <span className="onoffswitch-switch" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="App-intro">
                    <Board
                        //editable
                        onCardAdd={this.handleCardAdd}
                        data={{ lanes: this.state.lane }}
                        draggable
                        onDataChange={this.shouldReceiveNewData}
                        eventBusHandle={this.setEventBus}
                        handleDragStart={this.handleDragStart}
                        handleDragEnd={this.handleDragEnd}
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

export default withApollo(withGlobalContent(BoardRecruiter));