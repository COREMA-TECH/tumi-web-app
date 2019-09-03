import React, { Component } from 'react';
import './index.css';
import withGlobalContent from '../Generic/Global';
import withApollo from 'react-apollo/withApollo';
import PropTypes from 'prop-types';

import { ADD_APPLICATION_PHASES, UPDATE_APPLICANT, UPDATE_APPLICATION_STAGE } from "./Mutations";
import {
    GET_BOARD_SHIFT,
    GET_CITIES_QUERY,
    GET_COORDENADAS,
    GET_HOTEL_QUERY,
    GET_MATCH,
    GET_STATES_QUERY,
    GET_RESPONSE_QUERY
} from "./Queries";
//import Board from 'react-trello'
import { Board } from 'react-trello'

import Filters from './Filters';
import CardTemplate from './CardTemplate';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import { withRouter } from "react-router-dom";
import { red } from '@material-ui/core/es/colors';

import makeAnimated from "react-select/lib/animated";
import Select from 'react-select';

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
            status: 1,
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
            LaneOrigen: '',
            LaneDestino: '',
            statusOptions: [
                { value: null, label: "Status (All)" },
                { value: 1, label: "Open" },
                { value: 2, label: "Completed" },
                { value: 0, label: "Cancelled" },
            ]
        }
    }


    handleDragStart = (cardId, laneId) => {
    };

    handleDragEnd = (cardId, sourceLaneId, targetLaneId, position, cardDetails) => {
        let data;

        this.setState({
            LaneOrigen: sourceLaneId,
            LaneDestino: targetLaneId
        });

        if (sourceLaneId == "lane1") {

            this.props.handleOpenSnackbar('warning', "These cards can not be moved", 'bottom', 'right');
            this.KeepArray();
            this.onCardClick(this.state.ShiftId, null, 'lane1');

            this.setState({
                LaneOrigen: '',
                LaneDestino: ''
            });

        }
        else {

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

                if (sourceLaneId != 'lane1') {
                    if (targetLaneId != sourceLaneId) {
                        this.addApplicationPhase(cardId, IdLane);

                        if (targetLaneId != "Matches") {
                            this.updateApplicationInformation(cardId, false, 'Candidate has been notified');
                        }
                        if (targetLaneId == "Matches") {// && sourceLaneId == "Applied"
                            this.setState({
                                ApplicationId: cardId,
                                openReason: true
                            }, () => {
                            });
                            this.KeepArray();
                        }
                    }
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

            // this.props.handleOpenSnackbar('success', "Application Status Saved", 'bottom', 'right');
        }).catch((error) => {
            this.props.handleOpenSnackbar(
                'error',
                'Error to Add applicant Phase information. Please, try again!',
                'bottom',
                'right'
            );
        });
    }

    componentWillMount() {
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

    updateHotel = ({ value: id }) => {
        if (id != 0) {
            this.setState(
                {
                    hotel: id,
                    matches: []
                },
                () => {
                    this.loadStates();
                    // this.loadCities();
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
                    // this.loadCities(); 
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

    onCardClick = (cardId, metadata, laneId) => {

        let needEnglish, needExperience, Position, state;

        state = this.state.workOrders.find((item) => { return item.id == cardId })

        if ((laneId.trim() == "lane1") && cardId > 0 && state.Status != 0) {
            let cardSelected = document.querySelectorAll("article[data-id='" + cardId + "']");
            let anotherCards = document.querySelectorAll("article[data-id]");

            anotherCards.forEach((anotherCard) => {
                anotherCard.classList.remove("CardBoard-selected");
            });
            cardSelected[0].classList.add("CardBoard-selected");

            this.setState(
                {
                    Intopening: state.WorkOrderId,
                    ShiftId: cardId
                })

            if (this.state.LaneOrigen != "lane1" && this.state.LaneOrigen != "Notify") {
                this.clearArray();

                needEnglish = state.needEnglish;
                needExperience = state.needExperience;
                Position = state.Position;

                this.getLatLongHotel(1, state.Zipcode.substring(0, 5));//, () => {

                if (sessionStorage.getItem('NewFilterLead') === 'true') {
                    this.getMatches(sessionStorage.getItem('needEnglishLead'), sessionStorage.getItem('needExperienceLead'), sessionStorage.getItem('distances'), laneId, state.Position, state.WorkOrderId, cardId);
                } else {
                    this.getMatches(needEnglish, needExperience, 30, laneId, Position, state.WorkOrderId, cardId);
                }
                //});
            }
        }
    }

    KeepArray = () => {
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
                        draggable: false
                    },
                    {
                        id: 'Matches',
                        title: 'Matches',
                        label: ' ',
                        cards: this.state.matches,
                        droppable: true,
                        draggable: true
                    },
                    {
                        id: 'Interview',
                        title: 'Interview',
                        label: ' ',
                        cards: this.state.interview,
                        droppable: false,
                        draggable: true
                    },
                    {
                        id: 'Notify',
                        title: 'Notify',
                        label: ' ',
                        cards: this.state.notify,
                        droppable: true,
                        draggable: true
                    },
                    {
                        id: 'Accepted',
                        title: 'Accepted',
                        label: ' ',
                        cards: this.state.accepted,
                        droppable: true,
                        draggable: true
                    }
                ],
                loading: false
            });
    }
    clearArray() {
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
                        draggable: false
                    },
                    {
                        id: 'Matches',
                        title: 'Matches',
                        label: ' ',
                        cards: [],
                        droppable: true,
                        draggable: true
                    },
                    {
                        id: 'Interview',
                        title: 'Interview',
                        label: ' ',
                        cards: [],
                        droppable: false,
                        draggable: true
                    },
                    {
                        id: 'Notify',
                        title: 'Notify',
                        label: ' ',
                        cards: [],
                        droppable: true,
                        draggable: true
                    },
                    {
                        id: 'Accepted',
                        title: 'Accepted',
                        label: ' ',
                        cards: [],
                        droppable: true,
                        draggable: true
                    }
                ],
                loading: false

            });
    }

    getMatches = async (language, experience, location, laneId, PositionId, _WOID, _SHID) => {
        let getmatches = [];
        let getnotify = [];
        let getaccepted = [];
        let getinterview = [];
        let distances = 0;
        let varphase;

        if (laneId == "lane1") {
            this.setState(
                {
                    loading: true,
                },
                () => {
                    this.props.client.query({
                        query: GET_MATCH,
                        variables: {
                            language: language,
                            experience: experience,
                            Position: PositionId,
                            WorkOrderId: _WOID,
                            ShiftId: _SHID
                        },
                        fetchPolicy: 'no-cache'
                    }).then(({ data }) => {
                        let dataAPI = data.applicationsByMatches;

                        dataAPI.map(item => {
                            const Phases = item.Phases.sort().slice(-1).find((items) => {
                                return items.WorkOrderId == _WOID && items.ApplicationId == item.id && items.ShiftId == _SHID
                            });

                            if (item.Coordenadas) {
                                const { getDistance } = this.context;
                                const distance = getDistance(this.state.latitud1, this.state.longitud1, item.Coordenadas.Lat, item.Coordenadas.Long, 'M')


                                if (distance <= location) {

                                    if (typeof Phases == undefined || Phases == null) {
                                        varphase = 30469;
                                    } else {
                                        varphase = Phases.StageId
                                    }

                                    switch (varphase) {
                                        case 30469:
                                            if (item.isLead === false) {
                                                getmatches.push({
                                                    id: item.id,
                                                    name: item.firstName + ' ' + item.lastName,
                                                    subTitle: item.cellPhone,
                                                    body: item.cityInfo.DisplayLabel.trim() + ', ' + item.stateInfo.DisplayLabel.trim(),
                                                    escalationTextLeftLead: item.generalComment,
                                                    escalationTextRightLead: item.car == true ? " Yes" : " No",
                                                    cardStyle: { borderRadius: 6, marginBottom: 15 }
                                                });
                                            }
                                            break;
                                        case 30461:
                                            getinterview.push({
                                                id: item.id,
                                                name: item.firstName + ' ' + item.lastName,
                                                subTitle: item.cellPhone,
                                                body: item.cityInfo.DisplayLabel.trim() + ', ' + item.stateInfo.DisplayLabel.trim(),
                                                escalationTextLeftLead: item.generalComment,
                                                escalationTextRightLead: item.car == true ? " Yes" : " No",
                                                cardStyle: { borderRadius: 6, marginBottom: 15 },
                                                statusCompleted: item.statusCompleted
                                            });
                                            break;
                                        case 30464:

                                            getnotify.push({
                                                id: item.id,
                                                name: item.firstName + ' ' + item.lastName,
                                                subTitle: item.cellPhone,
                                                body: item.cityInfo.DisplayLabel.trim() + ', ' + item.stateInfo.DisplayLabel.trim(),
                                                escalationTextLeftLead: item.generalComment,
                                                escalationTextRightLead: item.car == true ? " Yes" : " No",
                                                cardStyle: { borderRadius: 6, marginBottom: 15 },
                                                response: 1
                                            });

                                            break;
                                        case 30463, 30465:
                                            getaccepted.push({
                                                id: item.id,
                                                name: item.firstName + ' ' + item.lastName,
                                                subTitle: item.cellPhone,
                                                body: item.cityInfo.DisplayLabel.trim() + ', ' + item.stateInfo.DisplayLabel.trim(),
                                                escalationTextLeftLead: item.generalComment,
                                                escalationTextRightLead: item.car == true ? " Yes" : " No",
                                                cardStyle: { borderRadius: 6, marginBottom: 15 }
                                            });
                                            break;
                                    }

                                }

                            }

                        });


                        this.setState({
                            matches: getmatches,
                            notify: getnotify,
                            interview: getinterview,
                            accepted: getaccepted,
                            loading: false
                        });

                        this.KeepArray();

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

    getDataFilters = () => {
        var variables;

        if (this.state.status == 0) {
            variables = {
                shift: {
                    status: [0]
                },
            };
        } else if (this.state.status == 1) {
            variables = {
                shift: {
                    status: [1, 2]
                },
            };
        } else if (this.state.status == 2) {
            variables = {
                shift: {
                    status: [3]
                },
            };
        }
        else {
            variables = {
                shift: {
                    status: [1, 2, 0]
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
            variables: { ...this.getDataFilters() },
            fetchPolicy: 'no-cache'
        }).then(({ data }) => {
            let _id = data.ShiftBoard.length === 0 ? 0 : data.ShiftBoard[0].workOrderId;
            let count = 0;
            let begin = true;
            data.ShiftBoard.forEach((ShiftBoard) => {
                if (_id == ShiftBoard.workOrderId)
                    count++;
                else {
                    count = 1;
                }

                datas = {
                    id: ShiftBoard.id,
                    name: 'Title: ' + ShiftBoard.positionName,
                    dueOn: 'Q: ' + ShiftBoard.count + '/' + ShiftBoard.quantity,
                    subTitle: 'ID: 000' + ShiftBoard.workOrderId,
                    body: ShiftBoard.CompanyName,
                    cardStyle: { borderRadius: 6, marginBottom: 15, color: red },
                    needExperience: ShiftBoard.needExperience,
                    needEnglish: ShiftBoard.needEnglish,
                    PositionApplyfor: ShiftBoard.Id_positionApplying,
                    Position: ShiftBoard.positionName,
                    Zipcode: ShiftBoard.zipCode,
                    WorkOrderId: ShiftBoard.workOrderId,
                    isOpening: ShiftBoard.isOpening,
                    Status: ShiftBoard.status,
                    Users: ShiftBoard.Users
                };
                getworkOrders.push(datas);
                _id = ShiftBoard.workOrderId;
            });

            this.setState({
                workOrders: getworkOrders,
            });

        }).catch(error => {
            console.log(error)
        })

        this.KeepArray();

    };

    handleCloseModal = (event) => {
        this.setState({ openModal: false });
    };

    goToEmployeePackage = (id) => {
        // window.location.href = '/employment-application';

        //FIXME: can't go back using this function
        this.props.history.push({
            pathname: '/home/application/info',
            state: { ApplicationId: id }
        });
    };

    //#region Dropdowns
    getHotelOptions = _ => {
        const defValue = { value: 0, label: "Select a Hotel" };

        const options = this.state.hotels.map(hotel => {
            return { value: hotel.Id, label: hotel.Name };
        });

        return [defValue, ...options];
    }

    findSelectedHotel = hotelId => {
        const defValue = { value: 0, label: "Select a Hotel" };

        const found = this.state.hotels.find(hotel => {
            return hotel.Id === hotelId;
        });

        return found ? { value: found.Id, label: found.Name } : defValue;
    }

    getStateOptions = _ => {
        const defValue = { value: 0, label: "Select a State" };

        const options = this.state.states.map(state => {
            return { value: state.Id, label: state.Name };
        });

        return [defValue, ...options];
    }

    findSelectedState = stateId => {
        const defValue = { value: 0, label: "Select a State" };

        const found = this.state.states.find(state => {
            return state.Id === stateId;
        });

        return found ? { value: found.Id, label: found.Name } : defValue;
    }

    handleStateFilterChange = ({ value }) => {
        this.setState({
            state: value,
            city: 0,
            cities: []
        }, () => {
            this.loadCities();
            this.getWorkOrders();
        })
    }

    getCityOptions = _ => {
        const defValue = { value: 0, label: "Select a City" };

        const options = this.state.cities.map(city => {
            return { value: city.Id, label: city.Name };
        });

        return [defValue, ...options];
    }

    findSelectedCity = cityId => {
        const defValue = { value: 0, label: "Select a City" };

        const found = this.state.cities.find(city => {
            return city.Id === cityId;
        });

        return found ? { value: found.Id, label: found.Name } : defValue;
    }

    handleCityFilterChange = ({ value }) => {
        this.setState({
            city: value
        }, () => {
            this.getWorkOrders();
        })
    }

    findSelectedStatus = statusId => {
        const defValue = { value: null, label: "Status (All)" };

        if (!statusId)
            return defValue;

        const found = this.state.statusOptions.find(status => {
            return status.value === statusId;
        });

        return found ? found : defValue;
    }

    handleStatusFilterChange = ({ value }) => {
        if (value == "null") {
            this.updateStatus(null);
        } else {
            this.updateStatus(value);
        }
    }
    //#endregion

    render() {

        const { classes } = this.props;

        let isLoading = this.state.loading;
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
                                            <div className="col-md-12">
                                                <div className="row">
                                                    <div className="col-md-3 col-xl-2 offset-xl-4 mb-2">
                                                        <Select
                                                            options={this.getHotelOptions()}
                                                            value={this.findSelectedHotel(this.state.hotel)}
                                                            onChange={this.updateHotel}
                                                            closeMenuOnSelect={true}
                                                            components={makeAnimated()}
                                                            isMulti={false}
                                                        />
                                                    </div>
                                                    <div className="col-md-3 col-xl-2 mb-2">
                                                        <Select
                                                            options={this.getStateOptions()}
                                                            value={this.findSelectedState(this.state.state)}
                                                            onChange={this.handleStateFilterChange}
                                                            closeMenuOnSelect={true}
                                                            components={makeAnimated()}
                                                            isMulti={false}
                                                        />
                                                    </div>
                                                    <div className="col-md-3 col-xl-2 mb-2">
                                                        <Select
                                                            options={this.getCityOptions()}
                                                            value={this.findSelectedCity(this.state.city)}
                                                            onChange={this.handleCityFilterChange}
                                                            closeMenuOnSelect={true}
                                                            components={makeAnimated()}
                                                            isMulti={false}
                                                        />
                                                    </div>
                                                    <div className="col-md-3 col-xl-2 mb-2">
                                                        <Select
                                                            options={this.state.statusOptions}
                                                            value={this.findSelectedStatus(this.state.status)}
                                                            onChange={this.handleStatusFilterChange}
                                                            closeMenuOnSelect={true}
                                                            components={makeAnimated()}
                                                            isMulti={false}
                                                        />
                                                    </div>
                                                    <div className="col-md-12 Filter-buttons">
                                                        <a
                                                            className="link-board Filter-button" onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();

                                                                this.setState({ openModal: true })
                                                            }}>
                                                            Advanced <i className="fas fa-filter link-icon-filter"></i>
                                                        </a>
                                                        <a
                                                            className="link-board Filter-button" onClick={(e) => {
                                                                this.setState({
                                                                    hotel: 0,
                                                                    state: 0,
                                                                    city: 0,
                                                                    status: 1
                                                                }, () => {
                                                                    this.getWorkOrders();
                                                                })
                                                            }}>
                                                            Clear <i className="fas fa-filter link-icon-filter"></i><i className="fas fa-times-circle text-danger clear-filter" />
                                                        </a>

                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="col-12 col-md-2"></div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="App-intro">
                        <Board
                            tagStyle={{ fontSize: '80%' }}
                            customCardLayout
                            data={{ lanes: this.state.lane }}
                            laneDraggable={false}
                            draggable={true}
                            onDataChange={this.shouldReceiveNewData}
                            eventBusHandle={this.setEventBus}
                            handleDragStart={this.handleDragStart}
                            handleDragEnd={this.handleDragEnd}
                            onCardClick={this.state.loading ? null : this.onCardClick}
                            style={{
                                backgroundColor: '#f5f7f9'
                            }}
                            customCardLayout>
                            <CardTemplate
                                history={this.props.history}
                                handleOpenSnackbar={this.props.handleOpenSnackbar}
                                getWorkOrders={this.getWorkOrders}
                                getnotify={() => { }}
                            />
                        </Board>
                    </div>
                    <Filters openModal={this.state.openModal} handleCloseModal={this.handleCloseModal} />

                </div>
            </div>
        )
    }

    static contextTypes = {
        getDistance: PropTypes.func,
    };
}

export default withApollo(withGlobalContent(withRouter(BoardManager)));