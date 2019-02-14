import React, { Component } from 'react';
import './index.css';
import withGlobalContent from '../Generic/Global';
import withApollo from 'react-apollo/withApollo';
import PropTypes from 'prop-types';

import { UPDATE_APPLICANT, ADD_APPLICATION_PHASES, UPDATE_APPLICATION_STAGE } from "./Mutations";
import {
    GET_CITIES_QUERY,
    GET_COORDENADAS,
    GET_HOTEL_QUERY,
    GET_MATCH,
    GET_STATES_QUERY,
    GET_WORK_ORDERS,
    GET_BOARD_SHIFT
} from "./Queries";
//import Board from 'react-trello'
import { Board } from 'react-trello'
import ShiftsData from '../../data/shitfs.json';

import Filters from './Filters';
import CardTemplate from './CardTemplate';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';

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
                    {props.escalationTextRightLead && <div style={{ margin: 1, fontWeight: 'bold', fontSize: 12 }}><i
                        class="fas fa-car-side"></i>{props.escalationTextRightLead}  </div>}
                </header>
            </div>
        </div>
    )
}

//const { getDistance } = this.context

class BoardManager extends Component {
    constructor(props) {
        super(props);


        this.state = {
            loading: false,
            // workOrder: [{ id: '', title: '', description: '', label: '' }]
            workOrder: [],
            lane: [],

            matches: [],
            notify: [],
            accepted: [],
            interview: [],
            workOrders: [],
            workOrdersPositions: [],
            Position: '',
            Hotel: '',
            states: [],
            cities: [],
            hotels: [],
            country: 6,
            hotel: 0,
            state: 0,
            city: 0,
            region: 0,
            status: null,
            loadingCountries: false,
            loadingCities: false,
            loadingStates: false,
            loadingRegions: false,
            loadingCompanyProperties: false,
            openModal: false,

            latitud1: 0,
            longitud1: 0,
            latitud2: 0,
            longitud2: 0,
            distance: 0,
            showConfirm: true,
            ShiftId: 0,
            Intopening: 0,
            userId: localStorage.getItem('LoginId'),
            ReasonId: 30471,
            LaneOrigen: 'lane1',
            LaneDestino: ''

        }
    }


    handleDragStart = (cardId, laneId) => {
    };

    handleDragEnd = (cardId, sourceLaneId, targetLaneId, position, cardDetails) => {
        console.log("sourceLaneId ", sourceLaneId);
        console.log("targetLaneId ", targetLaneId);

        this.setState({
            LaneOrigen: sourceLaneId,
            LaneDestino: targetLaneId
        });

        if (targetLaneId !== "lane1") {
            let IdLane;
            switch (targetLaneId) {
                case "Notify":
                    IdLane = 30464
                    break;
                case "Accepted":
                    IdLane = 30465
                    break;
                case "Interview":
                    IdLane = 30461
                    break;
                case "Matches":
                    IdLane = 30469
                default:
                    IdLane = 30469
            }



            if (targetLaneId != sourceLaneId) {
                this.addApplicationPhase(cardId, IdLane);

                if (targetLaneId != "Matches") {
                    this.updateApplicationInformation(cardId, false, 'candidate was updated!');
                }

                if (targetLaneId == "Matches") {// && sourceLaneId == "Applied"
                    this.setState({
                        ApplicationId: cardId,
                        openReason: true
                    }, () => {
                    });

                    this.setState(
                        {
                            lane: [
                                {
                                    id: 'lane1',
                                    title: 'Work Orders',
                                    label: ' ',
                                    cards: this.state.workOrders,
                                    laneStyle: { borderRadius: 50, marginBottom: 15 },
                                    droppable: false,
                                    draggable: false,
                                    editable: false
                                },
                                {
                                    id: 'Matches',
                                    title: 'Matches',
                                    label: ' ',
                                    cards: this.state.matches
                                },
                                {
                                    id: 'Interview',
                                    title: 'Interview',
                                    label: ' ',
                                    cards: this.state.interview,
                                    droppable: false,
                                    draggable: false,
                                    editable: false
                                },
                                {
                                    id: 'Notify',
                                    title: 'Notify',
                                    label: ' ',
                                    cards: this.state.notify
                                },
                                {
                                    id: 'Accepted',
                                    title: 'Accepted',
                                    label: ' ',
                                    cards: this.state.accepted
                                }
                            ],
                            loading: false
                        });
                }
            }
        }
    }

    addApplicationPhase = (id, laneId) => {
        this.props.client.mutate({
            mutation: ADD_APPLICATION_PHASES,
            variables: {
                applicationPhases: {
                    Comment: " ",
                    UserId: parseInt(this.state.userId),
                    WorkOrderId: this.state.Intopening,
                    ShiftId: this.state.ShiftId,
                    ReasonId: this.state.ReasonId,
                    ApplicationId: id,
                    StageId: laneId
                }
            }
        }).then(({ data }) => {
            this.setState({
                editing: false
            });

            this.props.handleOpenSnackbar('success', "Application Status Saved", 'bottom', 'right');
        }).catch((error) => {
            this.props.handleOpenSnackbar(
                'error',
                'Error to Add applicant Phase information. Please, try again!',
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
                this.loadStates();
                this.getWorkOrders();

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
                    parent: 6
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                this.setState({
                    states: data.getcatalogitem
                }, () => {
                    this.loadCities();
                });
            })
            .catch();
    };

    loadCities = () => {
        this.props.client
            .query({
                query: GET_CITIES_QUERY,
                variables: {
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
                    matches: []
                },
                () => {
                    this.loadStates();
                    this.loadCities();
                    this.getWorkOrders();
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
                    this.getWorkOrders();
                    this.loadStates();
                    this.loadCities();
                }
            );

        }

    };

    updateStatus = (id) => {
        this.setState(
            {
                status: id
            },
            () => {
                this.getWorkOrders();
            }
        );
    };

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

    validateInvalidInput = () => {
    };

    shouldReceiveNewData = nextData => {
    }

    handleCardAdd = (card, laneId) => {
    }

    addCardLink = (cardId, metadata, laneId) => {
    }


    onCardClick = (cardId, metadata, laneId) => {
        let needEnglish, needExperience, Position;
        console.log("Entro en el onCardClick ", this.state.LaneOrigen, " ", this.state.LaneDestino)


        if (laneId.trim() == "lane1") {
            if (this.state.LaneDestino != "lane1") {
                console.log("Entro en el diferente del click ")
                this.clearArray();

                let cardSelected = document.querySelectorAll("article[data-id='" + cardId + "']");
                let anotherCards = document.querySelectorAll("article[data-id]");

                anotherCards.forEach((anotherCard) => {
                    anotherCard.classList.remove("CardBoard-selected");
                });
                cardSelected[0].classList.add("CardBoard-selected");

                this.setState(
                    {
                        Intopening: this.state.workOrders.find((item) => { return item.id == cardId }).WorkOrderId,
                        ShiftId: cardId
                    })


                needEnglish = this.state.workOrders.find((item) => { return item.id == cardId }).needEnglish;
                needExperience = this.state.workOrders.find((item) => { return item.id == cardId }).needExperience;
                Position = this.state.workOrders.find((item) => { return item.id == cardId }).Position;


                this.getLatLongHotel(1, this.state.workOrders.find((item) => { return item.id == cardId }).Zipcode);

                if (sessionStorage.getItem('NewFilterLead') === 'true') {
                    console.log("sessionStorage.getItem('NewFilterLead') ", sessionStorage.getItem('NewFilterLead'))
                    this.getMatches(sessionStorage.getItem('needEnglishLead'), sessionStorage.getItem('needExperienceLead'), sessionStorage.getItem('distances'), laneId, this.state.workOrders.find((item) => {
                        return item.id == cardId
                    }).Position);
                } else {
                    this.getMatches(needEnglish, needExperience, 30, laneId, Position);
                }
            }
        }
    }

    clearArray() {
        this.setState(
            {
                // workOrder: this.state.workOrders,
                lane: [
                    {
                        id: 'lane1',
                        title: 'Work Orders',
                        label: ' ',
                        cards: this.state.workOrders,
                        laneStyle: { borderRadius: 50, marginBottom: 15 },
                        droppable: false,
                        draggable: false,
                        editable: false
                    },
                    {
                        id: 'Matches',
                        title: 'Matches',
                        label: ' ',
                        cards: []
                    },
                    {
                        id: 'Interview',
                        title: 'Interview',
                        label: ' ',
                        cards: [],
                        droppable: false,
                        draggable: false,
                        editable: false
                    },
                    {
                        id: 'Notify',
                        title: 'Notify',
                        label: ' ',
                        cards: []
                    },
                    {
                        id: 'Accepted',
                        title: 'Accepted',
                        label: ' ',
                        cards: []
                    }
                ],
                loading: false

            });
    }


    getMatches = async (language, experience, location, laneId, PositionId) => {
        let getmatches = [];
        let getnotify = [];
        let getaccepted = [];
        let getinterview = [];
        let distances;
        let varphase;

        if (laneId == "lane1") {
            this.setState(
                {
                    loading: true
                },
                () => {
                    this.props.client.query({
                        query: GET_MATCH, variables: { language: language, experience: experience, Position: PositionId, WorkOrderId: this.state.Intopening, ShiftId: this.state.ShiftId }
                    }).then(({ data }) => {
                        data.applicationsByMatches.forEach((wo) => {

                            const Phases = wo.applicationPhases.sort().slice(-1).find((item) => { return item.WorkOrderId == this.state.Intopening && item.ApplicationId == wo.id && item.ShiftId == this.state.ShiftId });

                            this.getLatLong(2, wo.zipCode.substring(0, 5), () => {
                                const { getDistance } = this.context;
                                const distance = getDistance(this.state.latitud1, this.state.longitud1, this.state.latitud2, this.state.longitud2, 'M')


                                console.log("esta es la distancia de ", wo.id, " nombre ", wo.firstName + ' ' + wo.lastName, " distancias ", distance, " fase ", Phases)

                                if (distance >= location) {
                                    distances = 0;
                                } else {
                                    distances = 1;
                                }

                                if (distances >= 1) {

                                    if (typeof Phases == undefined || Phases == null) {
                                        varphase = 30469;
                                    } else { varphase = Phases.StageId }

                                    switch (varphase) {
                                        case 30469:
                                            if (wo.isLead === false) {
                                                getmatches.push({
                                                    id: wo.id,
                                                    name: wo.firstName + ' ' + wo.lastName,
                                                    subTitle: wo.cellPhone,
                                                    body: wo.cityInfo.DisplayLabel.trim() + ', ' + wo.stateInfo.DisplayLabel.trim(),
                                                    escalationTextLeftLead: wo.generalComment,
                                                    escalationTextRightLead: wo.car == true ? " Yes" : " No",
                                                    cardStyle: { borderRadius: 6, marginBottom: 15 }
                                                });
                                            }
                                            break;
                                        case 30461:
                                            getinterview.push({
                                                id: wo.id,
                                                name: wo.firstName + ' ' + wo.lastName,
                                                subTitle: wo.cellPhone,
                                                body: wo.cityInfo.DisplayLabel.trim() + ', ' + wo.stateInfo.DisplayLabel.trim(),
                                                escalationTextLeftLead: wo.generalComment,
                                                escalationTextRightLead: wo.car == true ? " Yes" : " No",
                                                cardStyle: { borderRadius: 6, marginBottom: 15 }
                                            });
                                            break;
                                        case 30464:

                                            getnotify.push({
                                                id: wo.id,
                                                name: wo.firstName + ' ' + wo.lastName,
                                                subTitle: wo.cellPhone,
                                                body: wo.cityInfo.DisplayLabel.trim() + ', ' + wo.stateInfo.DisplayLabel.trim(),
                                                escalationTextLeftLead: wo.generalComment,
                                                escalationTextRightLead: wo.car == true ? " Yes" : " No",
                                                cardStyle: { borderRadius: 6, marginBottom: 15 }
                                            });
                                            break;
                                        case 30465:
                                            getaccepted.push({
                                                id: wo.id,
                                                name: wo.firstName + ' ' + wo.lastName,
                                                subTitle: wo.cellPhone,
                                                body: wo.cityInfo.DisplayLabel.trim() + ', ' + wo.stateInfo.DisplayLabel.trim(),
                                                escalationTextLeftLead: wo.generalComment,
                                                escalationTextRightLead: wo.car == true ? " Yes" : " No",
                                                cardStyle: { borderRadius: 6, marginBottom: 15 }
                                            });
                                            break;
                                    }
                                }

                                this.setState({
                                    matches: getmatches,
                                    notify: getnotify,
                                    interview: getinterview,
                                    accepted: getaccepted
                                });

                                console.log()

                                this.setState(
                                    {
                                        lane: [
                                            {
                                                id: 'lane1',
                                                title: 'Work Orders',
                                                label: ' ',
                                                cards: this.state.workOrders,
                                                laneStyle: { borderRadius: 50, marginBottom: 15 },
                                                droppable: false,
                                                draggable: false,
                                                editable: false
                                            },
                                            {
                                                id: 'Matches',
                                                title: 'Matches',
                                                label: ' ',
                                                cards: this.state.matches
                                            },
                                            {
                                                id: 'Interview',
                                                title: 'Interview',
                                                label: ' ',
                                                cards: this.state.interview,
                                                droppable: false,
                                                draggable: false,
                                                editable: false
                                            },
                                            {
                                                id: 'Notify',
                                                title: 'Notify',
                                                label: ' ',
                                                cards: this.state.notify
                                            },
                                            {
                                                id: 'Accepted',
                                                title: 'Accepted',
                                                label: ' ',
                                                cards: this.state.accepted
                                            }
                                        ],
                                        loading: false

                                    });
                            });
                        });

                    }).catch(error => {
                        this.setState({
                            loading: false,
                        })
                    })
                });
        }
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

    getLatLongHotel = async (op, zipcode) => {
        await this.props.client.query({ query: GET_COORDENADAS, variables: { Zipcode: zipcode } }).then(({ data }) => {
            this.setState({
                latitud1: data.zipcode[0].Lat,
                longitud1: data.zipcode[0].Long
            });
        }).catch(error => {
        })
    };

    getLatLong = async (op, zipcode, fnc = () => {
    }) => {
        await this.props.client.query({ query: GET_COORDENADAS, variables: { Zipcode: zipcode } }).then(({ data }) => {
            this.setState({
                latitud2: data.zipcode[0].Lat,
                longitud2: data.zipcode[0].Long
            }, fnc);

        }).catch(error => {
        })
    };

    getDataFilters = () => {
        var variables;

        if (this.state.status !== null) {
            variables = {
                shift: {
                    status: [this.state.status]
                },
            };
        } else {
            variables = {
                shift: {
                    status: [1, 2]
                },
            };
        }
        var shiftEntity = {};
        if (this.state.hotel != 0) {
            shiftEntity = {
                Id: this.state.hotel,
                ...shiftEntity
            }
        }
        if (this.state.state != 0) {
            shiftEntity = {
                State: this.state.state,
                ...shiftEntity
            }
        }
        if (this.state.city != 0) {
            shiftEntity = {
                City: this.state.city,
                ...shiftEntity
            }
        }
        if (this.state.hotel != 0 || this.state.state != 0 || this.state.city != 0) {
            variables = {
                shiftEntity,
                ...variables
            };
        }
        return variables;
    }

    getWorkOrders = async () => {
        let getworkOrders = [];
        let datas = [];


        await this.props.client.query({
            query: GET_BOARD_SHIFT,
            variables: { ...this.getDataFilters() }
        }).then(({ data }) => {
            let _id = data.ShiftBoard.length === 0 ? 0 : data.ShiftBoard[0].workOrderId;
            let count = 1;
            let begin = true;
            data.ShiftBoard.forEach((ShiftBoard) => {
                if (_id == ShiftBoard.workOrderId)
                    count++;
                else {
                    count = 1;
                }

                if (begin) count = 1;
                datas = {
                    id: ShiftBoard.id,
                    name: 'Title: ' + ShiftBoard.title,
                    dueOn: 'Q: ' + count + '/' + ShiftBoard.quantity,
                    subTitle: 'ID: 000' + ShiftBoard.workOrderId,
                    body: ShiftBoard.CompanyName,
                    cardStyle: { borderRadius: 6, marginBottom: 15 },
                    needExperience: ShiftBoard.needExperience,
                    needEnglish: ShiftBoard.needEnglish,
                    PositionApplyfor: ShiftBoard.Id_positionApplying,
                    Position: ShiftBoard.positionName,
                    Zipcode: ShiftBoard.zipCode,
                    WorkOrderId: ShiftBoard.workOrderId,
                    isOpening: ShiftBoard.isOpening
                };
                getworkOrders.push(datas);

            });

            this.setState({
                workOrders: getworkOrders,
            });
        }).catch(error => {
            console.log(error)
        })

        this.setState({

            // workOrders: getworkOrders,
            lane: [
                {
                    id: 'lane1',
                    title: 'Work Orders',
                    label: ' ',
                    cards: getworkOrders,
                    laneStyle: { backgroundColor: '#f0f8ff', borderRadius: 50, marginBottom: 15 },
                    droppable: false,
                    draggable: false,
                    editable: false
                },
                {
                    id: 'Matches',
                    title: 'Matches',
                    label: ' ',
                    cards: []
                },
                {
                    id: 'Interview',
                    title: 'Interview',
                    label: ' ',
                    cards: [],
                    droppable: false,
                    draggable: false,
                    editable: false
                },
                {
                    id: 'Notify',
                    title: 'Notify',
                    label: ' ',
                    cards: []
                },
                {
                    id: 'Accepted',
                    title: 'Accepted',
                    label: ' ',
                    cards: []
                }
            ],
            loading: false
        });
    };

    handleCloseModal = (event) => {
        this.setState({ openModal: false });
    };

    abrirVentana() {
        document.getElementById("capaFondo1").style.visibility = "visible";
        /*   document.getElementById("capaFondo2").style.visibility = "visible";
         document.getElementById("capaFondo3").style.visibility = "hidden";
 
         document.getElementById("capaVentana").style.visibility = "visible";*/
        // alert("abrirVentana")

    }

    cerrarVentana() {
        document.getElementById("capaFondo1").style.visibility = "hidden";
        /* document.getElementById("capaFondo2").style.visibility="hidden";
         document.getElementById("capaFondo3").style.visibility="hidden";
         document.getElementById("capaVentana").style.visibility="hidden";
         document.formulario.bAceptar.blur();*/
        // alert("cerrarVentana")
    }

    render() {
        const { classes } = this.props;

        let isLoading = this.state.loading

        /* if (isLoading) {
             this.abrirVentana()
         }
         else { this.cerrarVentana() }*/
        return (
            <div>

                <div className="App">
                    {isLoading && <LinearProgress />}


                    <div className="App-header">
                        <div className="row">
                            <div className="col-md-12 col-lg-12">
                                <div class="card">
                                    <div class="card-header info">
                                        <div className="row">
                                            <div className="col-md-8">
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

                                                                <option value={hotel.Id}>{hotel.Name}</option>

                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <select
                                                            name="state"
                                                            className={'form-control'}
                                                            onChange={(event) => {
                                                                this.setState({
                                                                    state: event.target.value,
                                                                    city: 0,
                                                                    cities: []
                                                                }, () => {
                                                                    this.loadCities();
                                                                    this.getWorkOrders();
                                                                })
                                                            }}
                                                            value={this.state.state}
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
                                                            disabled={this.state.loadingCities}
                                                            onChange={(event) => {
                                                                this.setState({
                                                                    city: event.target.value
                                                                }, () => {
                                                                    this.getWorkOrders();
                                                                })
                                                            }}
                                                            //error={!this.state.cityValid}
                                                            value={this.state.city}
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
                                                                if (event.target.value == "null") {
                                                                    this.updateStatus(null);
                                                                } else {
                                                                    this.updateStatus(event.target.value);
                                                                }
                                                            }}
                                                            //error={!this.state.cityValid}
                                                            value={this.state.status}
                                                            showNone={false}
                                                        >
                                                            <option value={"null"}>All work orders</option>
                                                            <option value={"null"}>Active work orders</option>
                                                            <option value={3}>Closed work orders</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <a
                                                            className="link-board" onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();

                                                                this.setState({ openModal: true })
                                                            }}>
                                                            Advanced
                                                    </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="App-intro">
                        <Board
                            data={{ lanes: this.state.lane }}
                            editable={false}
                            draggable={true}
                            laneDraggable={false}
                            onDataChange={this.shouldReceiveNewData}
                            eventBusHandle={this.setEventBus}
                            handleDragStart={this.handleDragStart}
                            handleDragEnd={this.handleDragEnd}
                            onCardClick={this.state.loading ? console.log("Esta bloquedo") : this.onCardClick}
                            style={{
                                backgroundColor: '#f5f7f9'
                            }}

                            customCardLayout>
                            <CardTemplate handleOpenSnackbar={this.props.handleOpenSnackbar} getWorkOrders={this.getWorkOrders} />

                        </Board>
                    </div>
                    <Filters openModal={this.state.openModal} handleCloseModal={this.handleCloseModal} />

                </div>
            </div >
        )
    }

    static contextTypes = {
        getDistance: PropTypes.func,
    };
}

export default withApollo(withGlobalContent(BoardManager));