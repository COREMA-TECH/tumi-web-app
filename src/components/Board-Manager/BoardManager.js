import React, { Component } from 'react';
import './index.css'
import withGlobalContent from "../Generic/Global";
import withApollo from "react-apollo/withApollo";
import PropTypes from 'prop-types';

import { GET_WORK_ORDERS } from "./Mutations";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Board from 'react-trello'
import { InputLabel } from '@material-ui/core';
import Query from 'react-apollo/Query';
import SelectNothingToDisplay from '../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';



class BoardManager extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            // workOrder: [{ id: '', title: '', description: '', label: '' }]
            workOrder: [],
            lane: [],
        }

        console.log("Inicializacion de variables");


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



    getWorkOrders = () => {
        this.props.client.query({ query: GET_WORK_ORDERS, variables: {} }).then(({ data }) => {

            let datos = [];
            let workOrders = [];

            data.workOrder.forEach((wo) => {
                datos = {
                    id: wo.id, title: wo.comment,
                    description: wo.comment, label: '30 mins'
                };
                workOrders.push(datos);
            });
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
                            cards: []
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
        console.log("Datos", this.state.workOrder)
        return <
            Board data={
                {
                    lanes: this.state.lane
                }
            }

        />
    }
}

export default withApollo(withGlobalContent(BoardManager));