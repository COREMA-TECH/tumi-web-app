import React, { Component } from 'react';
import './index.css'
import withGlobalContent from "../Generic/Global";
import withApollo from "react-apollo/withApollo";
import PropTypes from 'prop-types';

import { ADD_APPLICATION_PHASES, UPDATE_APPLICANT, UPDATE_APPLICATION_STAGE } from "./Mutations";
import { GET_CITIES_QUERY, GET_COORDENADAS, GET_HOTEL_QUERY, GET_LEAD, GET_OPENING, GET_STATES_QUERY, GET_BOARD_SHIFT } from "./Queries";
//import Board from 'react-trello'
import { Board } from 'react-trello'
import ShiftsData from '../../data/shitfsWorkOrder.json';
import Filters from './Filters';
import ApplicationPhasesForm from './ApplicationPhasesForm';
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

class BoardRecruiter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            // workOrder: [{ id: '', title: '', description: '', label: '' }]
            Opening: [],
            Openings: [],
            leads: [],
            Candidate: [],
            Applied: [],
            Placement: [],
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
            ApplicationId: 0,

            latitud1: 0,
            longitud1: 0,
            latitud2: 0,
            longitud2: 0,
            distance: 0,
            ShiftId: 0,
            LaneOrigen: '',
            LaneDestino: ''
        }
    }

    handleDragStart = (cardId, laneId) => {

    }

    handleDragEnd = (cardId, sourceLaneId, targetLaneId, position, cardDetails) => {

        this.setState({
            LaneOrigen: sourceLaneId,
            LaneDestino: targetLaneId
        });

        if ("lane1||Placement||Candidate".includes(sourceLaneId)) {
            this.props.handleOpenSnackbar('warning', "These cards can not be moved", 'bottom', 'right');
            this.KeepArray();
            this.onCardClick(this.state.ShiftId, null, sourceLaneId);

            this.setState({
                LaneOrigen: '',
                LaneDestino: ''
            });
        }
        else {

            let IdLane;
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
                    IdLane = 30460
            }

            console.log(this.state.openReason)
            if (!this.state.openReason) {
                if (targetLaneId != sourceLaneId) {
                    this.addApplicationPhase(cardId, IdLane);

                    if (targetLaneId != "Leads") {
                        this.updateApplicationInformation(cardId, true, 'candidate was updated!');
                    }

                    if (targetLaneId == "Leads") {// && sourceLaneId == "Applied"
                        this.setState({
                            ApplicationId: cardId,
                            openReason: true
                        }, () => {
                        });

                        this.setState(
                            {
                                Opening: this.state.Openings,
                                lane: [
                                    {
                                        id: 'lane1',
                                        title: 'Openings',
                                        label: ' ',
                                        cards: this.state.Openings,
                                        droppable: false,
                                        draggable: false,
                                        editable: false
                                    },
                                    {
                                        id: 'Leads',
                                        title: 'Leads',
                                        label: ' ',
                                        cards: this.state.leads
                                    },
                                    {
                                        id: 'Applied',
                                        title: 'Sent to Interview',
                                        label: ' ',
                                        cards: this.state.Applied
                                    },
                                    {
                                        id: 'Candidate',
                                        title: 'Candidate',
                                        label: ' ',
                                        cards: this.state.Candidate,
                                        droppable: false,
                                        draggable: false,
                                        editable: false
                                    },
                                    {
                                        id: 'Placement',
                                        title: 'Placement',
                                        label: ' ',
                                        cards: this.state.Placement,
                                        droppable: false,
                                        draggable: false,
                                        editable: false
                                    }
                                ],
                                loading: false
                            });
                    }

                }

            }
        }
    };

    handleCloseModal = () => {
        this.setState({ openModal: false });


        this.setState(
            {
                Opening: this.state.Openings,
                lane: [
                    {
                        id: 'lane1',
                        title: 'Openings',
                        label: ' ',
                        cards: this.state.Openings,
                        droppable: false,
                        draggable: false,
                        editable: false
                    },
                    {
                        id: 'Leads',
                        title: 'Leads',
                        label: ' ',
                        cards: this.state.leads
                    },
                    {
                        id: 'Applied',
                        title: 'Sent to Interview',
                        label: ' ',
                        cards: this.state.Applied
                    },
                    {
                        id: 'Candidate',
                        title: 'Candidate',
                        label: ' ',
                        cards: this.state.Candidate,
                        droppable: false,
                        draggable: false,
                        editable: false
                    },
                    {
                        id: 'Placement',
                        title: 'Placement',
                        label: ' ',
                        cards: this.state.Placement,
                        droppable: false,
                        draggable: false,
                        editable: false
                    }
                ],
                loading: false
            });


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
                    state: this.state.hotels.find((item) => {
                        return item.Id == id
                    }).State,
                    city: this.state.hotels.find((item) => {
                        return item.Id == id
                    }).City,
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

    validateInvalidInput = () => {
    };

    shouldReceiveNewData = nextData => {
    }

    handleCardAdd = (card, laneId) => {
    }

    clearArray() {
        this.setState({

            Opening: this.state.Openings,
            lane: [
                {
                    id: 'lane1',
                    title: 'Openings',
                    label: ' ',
                    cards: this.state.Openings,
                    droppable: false,
                    draggable: false,
                    editable: false
                },
                {
                    id: 'Leads',
                    title: 'Leads',
                    label: ' ',
                    cards: []
                },
                {
                    id: 'Applied',
                    title: 'Sent to Interview',
                    label: ' ',
                    cards: []
                },
                {
                    id: 'Candidate',
                    title: 'Candidate',
                    label: ' ',
                    cards: [],
                    droppable: false,
                    draggable: false,
                    editable: false
                },
                {
                    id: 'Placement',
                    title: 'Placement',
                    label: ' ',
                    cards: [],
                    droppable: false,
                    draggable: false,
                    editable: false
                }
            ],
            loading: false
        });
    }

    onCardClick = (cardId, metadata, laneId) => {
        let needEnglish, needExperience, Position;

        if (laneId.trim() == "lane1" && cardId > 0) {

            let cardSelected = document.querySelectorAll("article[data-id='" + cardId + "']");
            let anotherCards = document.querySelectorAll("article[data-id]");

            anotherCards.forEach((anotherCard) => {
                anotherCard.classList.remove("CardBoard-selected");
            });
            cardSelected[0].classList.add("CardBoard-selected");

            if (laneId.trim() == "lane1") {
                this.clearArray();

                let cardSelected = document.querySelectorAll("article[data-id='" + cardId + "']");
                let anotherCards = document.querySelectorAll("article[data-id]");

                anotherCards.forEach((anotherCard) => {
                    anotherCard.classList.remove("CardBoard-selected");
                });
                cardSelected[0].classList.add("CardBoard-selected");

                this.setState(
                    {
                        Intopening: this.state.Openings.find((item) => { return item.id == cardId }).WorkOrderId,
                        ShiftId: cardId
                    })

                needEnglish = this.state.Openings.find((item) => { return item.id == cardId }).needEnglish;
                needExperience = this.state.Openings.find((item) => { return item.id == cardId }).needExperience;
                Position = this.state.Openings.find((item) => { return item.id == cardId }).Position;

                console.log(this.state.Openings.find((item) => { return item.id == cardId }))

                this.getLatLongHotel(1, this.state.Openings.find((item) => { return item.id == cardId }).Zipcode);


                if (sessionStorage.getItem('NewFilterLead') === 'true') {
                    console.log("Estoy aqui con los nuevos filtros");
                    this.getMatches(sessionStorage.getItem('needEnglishLead'), sessionStorage.getItem('needExperienceLead'), sessionStorage.getItem('distances'), laneId, this.state.Openings.find((item) => { return item.id == cardId }).PositionApplyfor);
                } else {
                    this.getMatches(needEnglish, needExperience, 30, laneId, Position);
                }
            }
        }
    }


    KeepArray() {
        this.setState(
            {
                Opening: this.state.Openings,
                lane: [
                    {
                        id: 'lane1',
                        title: 'Openings',
                        label: ' ',
                        cards: this.state.Openings,
                        droppable: false,
                        draggable: false,
                        editable: false
                    },
                    {
                        id: 'Leads',
                        title: 'Leads',
                        label: ' ',
                        cards: this.state.leads
                    },
                    {
                        id: 'Applied',
                        title: 'Sent to Interview',
                        label: ' ',
                        cards: this.state.Applied
                    },
                    {
                        id: 'Candidate',
                        title: 'Candidate',
                        label: ' ',
                        cards: this.state.Candidate,
                        droppable: false,
                        draggable: false,
                        editable: false
                    },
                    {
                        id: 'Placement',
                        title: 'Placement',
                        label: ' ',
                        cards: this.state.Placement,
                        droppable: false,
                        draggable: false,
                        editable: false
                    }
                ],
                loading: false
            });
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
                            idWorkOrder: this.state.Intopening,
                            positionApplyingFor: this.state.Intopening
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

    getMatches = async (language, experience, location, laneId, PositionId) => {
        let getleads = [];
        let getApplied = [];
        let getCandidate = [];
        let getPlacement = [];


        let distances;
        let varphase;


        if (laneId == "lane1") {
            this.setState(
                {
                    loading: true
                },
                () => {
                    this.props.client.query({
                        query: GET_LEAD, variables: { language: language, experience: experience, Position: PositionId, WorkOrderId: this.state.Intopening, ShiftId: this.state.ShiftId }
                    }).then(({ data }) => {
                        data.applicationsByMatches.forEach((wo) => {

                            const Phases = wo.applicationPhases.sort().slice(-1).find((item) => { return item.WorkOrderId == this.state.Intopening && item.ApplicationId == wo.id && item.ShiftId == this.state.ShiftId });

                            this.getLatLong(2, wo.zipCode.substring(0, 5), () => {
                                const { getDistance } = this.context;
                                const distance = getDistance(this.state.latitud1, this.state.longitud1, this.state.latitud2, this.state.longitud2, 'M')

                                if (distance >= location) {
                                    distances = 0;
                                } else {
                                    distances = 1;
                                }

                                if (distances >= 1) {

                                    if (typeof Phases == undefined || Phases == null) {
                                        varphase = 30460;
                                    } else { varphase = Phases.StageId }

                                    switch (varphase) {
                                        case 30460:
                                            if (wo.isLead === true) {
                                                getleads.push({
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
                                            getApplied.push({
                                                id: wo.id,
                                                name: wo.firstName + ' ' + wo.lastName,
                                                subTitle: wo.cellPhone,
                                                body: wo.cityInfo.DisplayLabel.trim() + ', ' + wo.stateInfo.DisplayLabel.trim(),
                                                escalationTextLeftLead: wo.generalComment,
                                                escalationTextRightLead: wo.car == true ? " Yes" : " No",
                                                cardStyle: { borderRadius: 6, marginBottom: 15 }
                                            });
                                            break
                                        case 30462, 30464:
                                            getCandidate.push({
                                                id: wo.id,
                                                name: wo.firstName + ' ' + wo.lastName,
                                                subTitle: wo.cellPhone,
                                                body: wo.cityInfo.DisplayLabel.trim() + ', ' + wo.stateInfo.DisplayLabel.trim(),
                                                escalationTextLeftLead: wo.generalComment,
                                                escalationTextRightLead: wo.car == true ? " Yes" : " No",
                                                cardStyle: { borderRadius: 6, marginBottom: 15 }
                                            });
                                            break
                                        case 30463, 30465:
                                            getPlacement.push({
                                                id: wo.id,
                                                name: wo.firstName + ' ' + wo.lastName,
                                                subTitle: wo.cellPhone,
                                                body: wo.cityInfo.DisplayLabel.trim() + ', ' + wo.stateInfo.DisplayLabel.trim(),
                                                escalationTextLeftLead: wo.generalComment,
                                                escalationTextRightLead: wo.car == true ? " Yes" : " No",
                                                cardStyle: { borderRadius: 6, marginBottom: 15 }
                                            });
                                            break
                                    }
                                }

                                this.setState({
                                    leads: getleads,
                                    Applied: getApplied,
                                    Candidate: getCandidate,
                                    Placement: getPlacement
                                });

                                this.setState(
                                    {
                                        Opening: this.state.Openings,
                                        lane: [
                                            {
                                                id: 'lane1',
                                                title: 'Openings',
                                                label: ' ',
                                                cards: this.state.Openings,
                                                droppable: false,
                                                draggable: false,
                                                editable: false
                                            },
                                            {
                                                id: 'Leads',
                                                title: 'Leads',
                                                label: ' ',
                                                cards: getleads
                                            },
                                            {
                                                id: 'Applied',
                                                title: 'Sent to Interview',
                                                label: ' ',
                                                cards: getApplied
                                            },
                                            {
                                                id: 'Candidate',
                                                title: 'Candidate',
                                                label: ' ',
                                                cards: getCandidate,
                                                droppable: false,
                                                draggable: false,
                                                editable: false
                                            },
                                            {
                                                id: 'Placement',
                                                title: 'Placement',
                                                label: ' ',
                                                cards: getPlacement,
                                                droppable: false,
                                                draggable: false,
                                                editable: false
                                            }
                                        ],
                                        loading: false
                                    });
                            });
                        });

                        if (data.applicationsByMatches.length === 0) {
                            this.props.handleOpenSnackbar(
                                'warning',
                                'No matches were found',
                                'bottom',
                                'right'
                            );
                        }
                        this.setState({
                            loading: false
                        })
                    }).catch(error => {
                        this.setState({
                            loading: false,
                        })
                    })
                });
        }
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

    getOpenings = async () => {
        let datas = [];
        let getleads = [];
        let getOpenings = [];


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
                    WorkOrderId: ShiftBoard.workOrderId
                };
                getOpenings.push(datas);

            });

            this.setState({
                Openings: getOpenings
            });
        }).catch(error => {
            console.log(error)
        })

        this.setState({

            Opening: this.state.Openings,
            lane: [
                {
                    id: 'lane1',
                    title: 'Openings',
                    label: ' ',
                    cards: this.state.Openings,
                    droppable: false,
                    draggable: false,
                    editable: false
                },
                {
                    id: 'Leads',
                    title: 'Leads',
                    label: ' ',
                    cards: []
                },
                {
                    id: 'Applied',
                    title: 'Sent to Interview',
                    label: ' ',
                    cards: []
                },
                {
                    id: 'Candidate',
                    title: 'Candidate',
                    label: ' ',
                    cards: [],
                    droppable: false,
                    draggable: false,
                    editable: false
                },
                {
                    id: 'Placement',
                    title: 'Placement',
                    label: ' ',
                    cards: [],
                    droppable: false,
                    draggable: false,
                    editable: false
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
        const { classes } = this.props;

        let isLoading = this.state.loading
        return (
            <div className="App">
                {isLoading && <LinearProgress />}
                <div className="App-header">
                    <div className="row">
                        <div className="col-md-12 col-lg-12">
                            <div class="card">
                                <div class="card-header info">
                                    <div className="row">
                                        <div className="col-md-9">
                                            <div className="row">
                                                <div className="col-md-2">
                                                    <select
                                                        required
                                                        name="IdEntity"
                                                        className="form-control"
                                                        id=""
                                                        onChange={(event) => {
                                                            this.updateHotel(event.target.value);
                                                        }}
                                                        value={this.state.hotel}
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
                                                                this.getOpenings();
                                                                this.getMatches();
                                                            })
                                                        }}
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
                                                        onChange={(event) => {
                                                            this.setState({
                                                                city: event.target.value
                                                            }, () => {
                                                                this.getOpenings();
                                                                this.getMatches();
                                                            })
                                                        }}
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
                                                            if (event.target.value == "null") {
                                                                this.updateStatus(null);
                                                            } else {
                                                                this.updateStatus(event.target.value);
                                                            }
                                                        }}
                                                        //error={!this.state.cityValid}
                                                        value={this.state.city}
                                                        showNone={false}
                                                    >

                                                        <option value={0}>Active work orders</option>
                                                        <option value={1}>Closed work orders</option>
                                                        <option value={2}>All work orders</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-4">
                                                    <a
                                                        className="link-board" onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();

                                                            this.setState({ openModal: true })
                                                        }}>
                                                        Advanced
                                                    </a>
                                                    <a
                                                        className="link-board" onClick={(e) => {
                                                            this.setState({
                                                                hotel: 0,
                                                                state: 0,
                                                                city: 0,
                                                                status: null
                                                            }, () => {
                                                                this.getOpenings();
                                                            })
                                                        }}>
                                                        Clear
                                                    </a>

                                                </div>
                                                {/*<div className="col-md-1">*/}
                                                    {/*<button className="btn btn-danger" onClick={() => {*/}
                                                        {/*this.setState({*/}
                                                            {/*hotel: 0,*/}
                                                            {/*state: 0,*/}
                                                            {/*city: 0,*/}
                                                            {/*status: null*/}
                                                        {/*}, () => {*/}
                                                            {/*this.getOpenings();*/}
                                                        {/*})*/}
                                                    {/*}}>Clear</button>*/}
                                                {/*</div>*/}
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="row">
                                                <div className="col-sm-0 col-md-2 col-lg-1"></div>
                                                <div className="col-sm-12 col-md-10 col-lg-11">
                                                    <button
                                                        className="btn btn-outline-info btn-sm float-right"
                                                        onClick={() => {
                                                            this.props.history.push({
                                                                pathname: '/home/application/Form',
                                                                state: { ApplicationId: 0 }
                                                            });
                                                        }}>New Lead
                                                    </button>
                                                </div>
                                            </div>
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

    static contextTypes = {
        getDistance: PropTypes.func,
    };
}

export default withApollo(withGlobalContent(BoardRecruiter));