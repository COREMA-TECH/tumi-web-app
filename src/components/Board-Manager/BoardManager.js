import React, { Component } from 'react';
import './index.css';
import withGlobalContent from '../Generic/Global';
import withApollo from 'react-apollo/withApollo';
import PropTypes from 'prop-types';

//import { GET_WORK_ORDERS } from "./Mutations";
import { GET_STATES_QUERY, GET_CITIES_QUERY, GET_WORK_ORDERS, GET_MATCH, GET_HOTEL_QUERY, GET_COORDENADAS } from "./Queries";
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

import Filters from './Filters';


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
            workOrders: [],
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
            distance: 0

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
                this.loadhotel();
                this.getWorkOrders();
                // this.loadStates();
                //this.loadCities();
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
                    this.getWorkOrders();
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
                    this.getWorkOrders();
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
                this.getWorkOrders();
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
        console.log("esto es mio ", this.state.workOrders)
        if (sessionStorage.getItem('NewFilter') === false) {
            this.getMatches(this.state.workOrders.find((item) => { return item.id == cardId }).needEnglish, this.state.workOrders.find((item) => { return item.id == cardId }).needExperience, 50, laneId);
        } else {
            this.getMatches(sessionStorage.getItem('needEnglish'), sessionStorage.getItem('needExperience'), sessionStorage.getItem('NewDistances'), laneId);
        }

    }

    getMatches = async (language, experience, location, laneId) => {
        let getmatches = [];
        let datas = [];
        let SpeakEnglish;
        let Employment;

        if (laneId == "lane1") {
            await this.props.client.query({ query: GET_MATCH, variables: {} }).then(({ data }) => {
                data.applications.forEach((wo) => {

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

                    //const { getDistance } = this.context;
                    // const latitud1 = 25.485737, longitud1 = -80.546938, latitud2 = 25.458486, longitud2 = -80.475754;
                    //const distance = getDistance(latitud1, longitud1, latitud2, longitud2, 'K')

                    /*  this.props.client.query({ query: GET_COORDENADAS, variables: { Zipcode: wo.zipCode } }).then(({ data }) => {
                          data.applications.forEach((wo) => {
                              this.setState({
                                  latitud2: wo.Lat,
                                  longitud2: wo.Long,
                                  distance: getDistance(this.state.latitud1, this.state.longitud1, this.state.latitud2, this.state.longitud2, 'K')
                              });
                          });
                      }).catch(error => { })*/



                    // console.log("Estos son los data ", wo);
                    console.log("estos son los datos de la coordenaas ", this.state.latitud2, " longitud ", this.state.longitud2)
                    datas = {
                        id: wo.id,
                        name: wo.firstName + ' ' + wo.lastName,
                        subTitle: wo.cellPhone,
                        body: wo.cityInfo.DisplayLabel.trim() + ', ' + wo.stateInfo.DisplayLabel.trim(),
                        escalationTextLeftMatch: wo.generalComment,
                        escalationTextRightMatch: wo.car == true ? " Yes" : " No",
                        cardStyle: { borderRadius: 6, marginBottom: 15 }
                    };

                    if (SpeakEnglish == 1 && Employment >= 1) {
                        console.log("este es el speak", datas);
                        getmatches.push(datas);
                    }

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
        console.log("Este es el hotel ", this.state.hotel);

        if (this.state.hotel == 0) {
            await this.props.client.query({ query: GET_WORK_ORDERS, variables: { status: this.state.status } }).then(({ data }) => {
                data.workOrder.forEach((wo) => {

                    const Hotel = data.getbusinesscompanies.find((item) => { return item.Id == wo.IdEntity });
                    const Shift = ShiftsData.find((item) => { return item.Id == wo.shift });
                    const Users = data.getusers.find((item) => { return item.Id == wo.userId });
                    const Contacts = data.getcontacts.find((item) => { return item.Id == (Users != null ? Users.Id_Contact : 10) });

                    this.props.client.query({ query: GET_COORDENADAS, variables: { Zipcode: Hotel.Zipcode } }).then(({ data }) => {
                        data.applications.forEach((wo) => {
                            this.setState({
                                latitud1: wo.Lat,
                                longitud1: wo.Long,
                                // distance = getDistance(this.state.latitud1, this.state.longitud1, this.state.latitud2, this.state.longitud2, 'K')
                            });
                        });
                    }).catch(error => { })

                    datas = {
                        id: wo.id,
                        name: 'Title: ' + wo.position.Position,
                        dueOn: 'Q: ' + wo.quantity,
                        subTitle: 'ID: 000' + wo.id,
                        body: Hotel != null ? Hotel.Name : '',
                        escalationTextLeft: Contacts != null ? Contacts.First_Name.trim() + ' ' + Contacts.Last_Name.trim() : '',
                        escalationTextRight: Shift != null ? Shift.Name + '-Shift' : '',
                        cardStyle: { borderRadius: 6, marginBottom: 15 },
                        needExperience: wo.needExperience,
                        needEnglish: wo.needEnglish,
                        latitud1: this.state.latitud1,
                        longitud1: this.state.longitud1
                    };
                    getworkOrders.push(datas);
                });
                console.log("este es el work ", getworkOrders)
                this.setState({
                    workOrders: getworkOrders
                });
            }).catch(error => { })
        } else {
            await this.props.client.query({ query: GET_WORK_ORDERS, variables: { IdEntity: this.state.hotel, status: this.state.status } }).then(({ data }) => {
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
        }


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

    handleCloseModal = (event) => {
        event.preventDefault();
        this.setState({ openModal: false });
    };

    render() {
        const { getDistance } = this.context;
        const latitud1 = 25.485737, longitud1 = -80.546938, latitud2 = 25.458486, longitud2 = -80.475754;
        const distance = getDistance(latitud1, longitud1, latitud2, longitud2, 'K')


        console.log(`SW 219th Ave Zipcode [33030] and  South Dixie Highway Zipcode [33390] ${distance} Km`)

        return (
            <div className="App">
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

                                                    <option value={hotel.Id}>{hotel.Name}</option>

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
            </div >
        )
    }
    static contextTypes = {
        getDistance: PropTypes.func,
    };
}

export default withApollo(withGlobalContent(BoardManager));