import React, { Component } from 'react';
import './index.css'
import withGlobalContent from "../Generic/Global";
import withApollo from "react-apollo/withApollo";
import PropTypes from 'prop-types';

import { UPDATE_APPLICANT, UPDATE_APPLICATION_STAGE, ADD_APPLICATION_PHASES } from "./Mutations";
import { GET_POSTIONS_QUERY, GET_COMPANY_QUERY, GET_OPENING, GET_LEAD, GET_HOTEL_QUERY, GET_STATES_QUERY, GET_CITIES_QUERY } from "./Queries";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
//import Board from 'react-trello'
import { Board } from 'react-trello'
import ShiftsData from '../../data/shitfsWorkOrder.json';
import { InputLabel } from '@material-ui/core';
import Query from 'react-apollo/Query';
import SelectNothingToDisplay from '../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';
import Filters from './Filters';
import ApplicationPhasesForm from './ApplicationPhasesForm';


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
            Openings: [],
            leads: [],
            lane: [],
            Position: '',
            Hotel: '',
            checked: true,
            states: [],
            cities: [],
            hotels: [],
            country: 6,
            hotel: 0,
            state: 0,
            city: 0,
            region: 0,
            status: 2,
            loadingCountries: false,
            loadingCities: false,
            loadingStates: false,
            loadingRegions: false,
            loadingCompanyProperties: false,
            openModal: false,
            Intopening: 0,
            userId: localStorage.getItem('LoginId'),
            openReason: false,
            ReasonId: 30471,
            ApplicationId: 0
        }
    }

    handleDragStart = (cardId, laneId) => {

    }

    handleDragEnd = (cardId, sourceLaneId, targetLaneId, position, cardDetails) => {
        let IdLane;
        console.log("Card Details", cardDetails)
        switch (targetLaneId) {
            case "Leads":
                IdLane = 30460
                break;
            case "Applied":
                IdLane = 30461
                break;
            case "Candidate":
                IdLane = 30462
                break;
            case "Placement":
                IdLane = 30463
                break;
            case "Notify":
                IdLane = 30464
                break;
            case "Accepted":
                IdLane = 30465
                break;
            case "Add to Schedule":
                IdLane = 30466
                break;
            case "Matches":
                IdLane = 30466
            default:
                IdLane = 1000
        }

        this.updateApplicationStages(cardId, IdLane, 'Lead now is a Candidate');

        if (targetLaneId != "Leads") {
            this.addApplicationPhase(cardId, IdLane);
        }


        if (targetLaneId == "Leads" && sourceLaneId == "Applied") {
            this.setState({
                ApplicationId: cardId,
                openReason: true
            }, () => {
                this.onCardClick = (cardId, null, targetLaneId)
            });
        }

        if (targetLaneId == "Candidate") {
            this.updateApplicationInformation(cardId, false, 'Lead now is a Candidate');
            // this.addApplicationPhase(cardId, IdLane);
        }
        if ((sourceLaneId == "Candidate" && targetLaneId == "Applied") || (sourceLaneId == "Candidate" && targetLaneId == "Leads")) {
            this.updateApplicationInformation(cardId, true, 'Candidate now is a Lead ');
        }

    }

    handleCloseModal = (event) => {
        event.preventDefault();
        this.setState({
            openReason: false

        });
    };

    addApplicationPhase = (id, laneId) => {
        this.props.client.mutate({
            mutation: ADD_APPLICATION_PHASES,
            variables: {
                applicationPhases: {
                    Comment: " ",
                    UserId: parseInt(this.state.userId),
                    WorkOrderId: this.state.Intopening,
                    ReasonId: this.state.ReasonId,
                    ApplicationId: id,
                    StageId: laneId
                }
            }
        }).then(({ data }) => {
            this.setState({
                editing: false
            });

            this.props.handleOpenSnackbar('success', "Message", 'bottom', 'right');
        }).catch((error) => {
            this.props.handleOpenSnackbar(
                'error',
                'Error to Add applicant information. Please, try again!',
                'bottom',
                'right'
            );
        });
    }

    UNSAFE_componentWillMount() {
        this.setState(
            {
                loading: true
            }, () => {
                this.loadhotel();
                this.getOpenings();

            });
    }

    loadhotel = () => {
        this.props.client
            .query({
                query: GET_HOTEL_QUERY
            })
            .then(({ data }) => {
                this.setState({
                    hotels: data.getbusinesscompanies
                });
            })
            .catch();
    }

    loadStates = () => {
        this.props.client
            .query({
                query: GET_STATES_QUERY,
                variables: {
                    id: this.state.state,
                    parent: this.state.country
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                this.setState({
                    states: data.getcatalogitem
                });
            })
            .catch();
    };

    loadCities = () => {
        this.props.client
            .query({
                query: GET_CITIES_QUERY,
                variables: {
                    id: this.state.city,
                    parent: this.state.state
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                this.setState({
                    cities: data.getcatalogitem
                });
            })
            .catch();
    };

    updateHotel = (id) => {

        if (id != 0) {
            this.setState(
                {
                    hotel: id,
                    state: this.state.hotels.find((item) => { return item.Id == id }).State,
                    city: this.state.hotels.find((item) => { return item.Id == id }).City,
                    matches: []
                },
                () => {
                    // this.validateField('state', id);
                    this.loadStates();
                    this.loadCities();
                    this.getOpenings();
                    this.getMatches();
                }
            );

        } else {
            this.setState(
                {
                    hotel: 0,
                    state: 0,
                    city: 0,
                    matches: []
                },
                () => {
                    // this.validateField('state', id);
                    this.getOpenings();
                    this.loadStates();
                    this.loadCities();
                    this.getMatches();
                }
            );

        }

    };

    updateStatus = (id) => {
        this.setState(
            {
                state: id
            },
            () => {
                this.getOpenings();
            }
        );
    };

    /* updateCity = (id) => {
         this.setState(
             {
                 city: id
             },
             () => {
                 // this.validateField('city', id);
             }
         );
     };*/


    validateInvalidInput = () => {
    };

    shouldReceiveNewData = nextData => {
    }

    handleCardAdd = (card, laneId) => {
    }

    onCardClick = (cardId, metadata, laneId) => {
        this.setState(
            {
                Intopening: cardId
            })

        if (sessionStorage.getItem('NewFilterLead') === false) {
            this.getMatches(this.state.workOrders.find((item) => { return item.id == cardId }).needEnglish, this.state.workOrders.find((item) => { return item.id == cardId }).needExperience, true, laneId, this.state.workOrders.find((item) => { return item.id == cardId }).PositionRateId);
        } else {
            this.getMatches(sessionStorage.getItem('needEnglishLead'), sessionStorage.getItem('needExperienceLead'), true, laneId, this.state.workOrders.find((item) => { return item.id == cardId }).PositionRateId);
        }
        //        alert("La session es " + sessionStorage.getItem('myData'))
        //alert("La session es " + sessionStorage.getItem('NewFilter'))

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
                            isLead: isLead,
                            idRecruiter: this.state.userId,
                            idWorkOrder: this.state.Intopening

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

    updateApplicationStages = (id, idStages, Message) => {
        this.setState(
            {
                insertDialogLoading: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: UPDATE_APPLICATION_STAGE,
                        variables: {

                            id: id,
                            idStages: idStages

                        }
                    })
                    .then(({ data }) => {
                        this.setState({
                            editing: false
                        });

                        // this.props.handleOpenSnackbar('success', Message, 'bottom', 'right');
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

    getMatches = async (language, experience, location, laneId, PositionId) => {
        let getleads = [];
        let datas = [];
        let SpeakEnglish;
        let Employment;

        if (laneId == "lane1") {
            await this.props.client.query({ query: GET_LEAD, variables: {} }).then(({ data }) => {
                data.applications.forEach((wo) => {

                    //  console.log("Verifico el dataset", wo);
                    if (language == 'true') {
                        SpeakEnglish = wo.languages.find((item) => { return item.language == 194 }) != null ? 1 : 0;
                    } else {
                        SpeakEnglish = 1;
                    }

                    if (experience == 'true') {
                        Employment = wo.employments.length;

                    } else {
                        Employment = 1;
                    }


                    //const Hotel = data.getbusinesscompanies.find((item) => { return item.Id == wo.IdEntity });
                    //const Shift = ShiftsData.find((item) => { return item.Id == wo.shift });
                    //const Users = data.getcontacts.find((item) => { return item.Id == 10 });
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
                    if (SpeakEnglish == 1 && Employment >= 1) {
                        getleads.push(datas);
                    }
                });
            }).catch(error => { })

            this.setState({
                leads: getleads
            });

            this.setState(
                {
                    Opening: this.state.Openings,
                    lane: [
                        {
                            id: 'lane1',
                            title: 'Openings',
                            label: ' ',
                            cards: this.state.Openings
                        },
                        {
                            id: 'Leads',
                            title: 'Leads',
                            label: ' ',
                            cards: this.state.leads
                        },
                        {
                            id: 'Applied',
                            title: 'Applied',
                            label: ' ',
                            cards: []
                        },
                        {
                            id: 'Candidate',
                            title: 'Candidate',
                            label: ' ',
                            cards: []
                        },
                        {
                            id: 'Placement',
                            title: 'Placement',
                            label: ' ',
                            cards: []
                        }
                    ],
                    loading: false
                });
        }
    };

    getOpenings = async () => {
        let datas = [];
        let getleads = [];
        let getOpenings = [];

        if (this.state.hotel == 0) {
            await this.props.client.query({ query: GET_OPENING, variables: { status: this.state.status } }).then(({ data }) => {
                data.workOrder.forEach((wo) => {
                    const Hotel = data.getbusinesscompanies.find((item) => { return item.Id == wo.IdEntity });
                    const Shift = ShiftsData.find((item) => { return item.Id == wo.shift });
                    const Users = data.getusers.find((item) => { return item.Id == wo.userId });
                    const Contacts = data.getcontacts.find((item) => { return item.Id == (Users != null ? Users.Id_Contact : 10) });

                    datas = {
                        id: wo.id,
                        name: 'Title: ' + wo.position.Position,
                        dueOn: 'Q: ' + wo.quantity,
                        //subTitle: wo.comment,
                        subTitle: 'ID: 000' + wo.id,
                        body: Hotel != null ? Hotel.Name : '',
                        //escalationTextLeft: Hotel.Name,
                        escalationTextLeft: Contacts != null ? Contacts.First_Name.trim() + ' ' + Contacts.Last_Name.trim() : '',
                        escalationTextRight: Shift.Name + '-Shift',
                        cardStyle: { borderRadius: 6, marginBottom: 15 },
                        needExperience: wo.needExperience,
                        needEnglish: wo.needEnglish
                    };
                    getOpenings.push(datas);
                });
                this.setState({
                    Openings: getOpenings
                });
            }).catch(error => { })
        } else {
            await this.props.client.query({ query: GET_OPENING, variables: { IdEntity: this.state.hotel, status: this.state.status } }).then(({ data }) => {
                data.workOrder.forEach((wo) => {
                    const Hotel = data.getbusinesscompanies.find((item) => { return item.Id == wo.IdEntity });
                    const Shift = ShiftsData.find((item) => { return item.Id == wo.shift });
                    const Users = data.getusers.find((item) => { return item.Id == wo.userId });
                    const Contacts = data.getcontacts.find((item) => { return item.Id == Users.Id_Contact });

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
                    };
                    getOpenings.push(datas);
                });
                this.setState({
                    Openings: getOpenings
                });
            }).catch(error => { })
        }
        this.setState(
            {

                Opening: this.state.Openings,
                lane: [
                    {
                        id: 'lane1',
                        title: 'Openings',
                        label: ' ',
                        cards: this.state.Openings
                    },
                    {
                        id: 'Leads',
                        title: 'Leads',
                        label: ' ',
                        cards: this.state.leads
                    },
                    {
                        id: 'Applied',
                        title: 'Applied',
                        label: ' ',
                        cards: []
                    },
                    {
                        id: 'Candidate',
                        title: 'Candidate',
                        label: ' ',
                        cards: []
                    },
                    {
                        id: 'Placement',
                        title: 'Placement',
                        label: ' ',
                        cards: []
                    }
                ],
                loading: false
            });
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
                {/*<div className="App-header">
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
                </div> */}
                <div className="App-header">
                    <div className="row">
                        <div className="col-md-12 col-lg-12">
                            <div class="card">
                                <div class="card-header info">

                                    <div className="row">
                                        <div className="col-md-3">
                                            <select
                                                required
                                                name="IdEntity"
                                                className="form-control"
                                                id=""
                                                onChange={(event) => {
                                                    this.updateHotel(event.target.value);
                                                }}
                                                value={this.state.IdEntity}
                                                //disabled={!isAdmin}
                                                onBlur={this.handleValidate}
                                            >
                                                <option value={0}>Select a Hotel</option>
                                                {this.state.hotels.map((hotel) => (
                                                    <option value={hotel.Id} label={hotel.State}>{hotel.Name}</option>

                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-2">
                                            <select
                                                name="state"
                                                className={'form-control'}
                                                /* onChange={(event) => {
                                                     this.updateState(event.target.value);
                                                 }}*/
                                                value={this.state.state}
                                                showNone={false}
                                            >
                                                <option value="">Select a state</option>
                                                {this.state.states.map((item) => (
                                                    <option value={item.Id}>{item.Name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-2">
                                            <select
                                                name="city"
                                                className={'form-control'}
                                                // disabled={this.state.loadingCities}
                                                /* onChange={(event) => {
                                                     this.updateCity(event.target.value);
                                                 }}*/
                                                //error={!this.state.cityValid}
                                                value={this.state.city}
                                                showNone={false}
                                            >
                                                <option value="">Select a city</option>
                                                {this.state.cities.map((item) => (
                                                    <option value={item.Id}>{item.Name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-2">
                                            <select
                                                name="city"
                                                className={'form-control'}
                                                // disabled={this.state.loadingCities}
                                                onChange={(event) => {
                                                    this.updateStatus(event.target.value);
                                                }}
                                                //error={!this.state.cityValid}
                                                value={this.state.city}
                                                showNone={false}
                                            >

                                                <option value={0}>Work Order Active</option>
                                                <option value={1}>Work Order Close</option>
                                                <option value={2}>All Work Order</option>
                                            </select>
                                        </div>
                                        <div className="col-md-2">
                                            <button className="btn btn-success" type="submit" onClick={() => {
                                                this.setState({ openModal: true })
                                            }}>
                                                Filter<i className="fas fa-filter ml2" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                <Filters openModal={this.state.openModal} handleCloseModal={this.handleCloseModal} />
                <ApplicationPhasesForm
                    WorkOrderId={this.state.Intopening}
                    ApplicationId={this.state.ApplicationId}
                    openReason={this.state.openReason}
                    handleOpenSnackbar={this.props.handleOpenSnackbar}
                    handleCloseModal={this.handleCloseModal}
                />
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