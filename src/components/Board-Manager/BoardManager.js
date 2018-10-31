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
            workOrder: []
        }

        console.log("Inicializacion de variables");


    }

    /* const Cards = {
         
  
     };*/

    componentWillMount() {
        this.setState(
            {
                loading: true
            });
        console.log("mandamos a llenar el array");
        this.getWorkOrders();
        console.log("Ya el array esta lleno");
        console.log("aqui esta el array ", this.state.workOrder);

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
                    loading: false
                });

            console.log("esta es la variable ya hecha ", this.state.workOrder);
        }).catch(error => { })
    };

    render() {
        console.log("ya esta activo el render");
        return <
            Board data={
                {
                    lanes: [
                        {
                            id: 'lane1',
                            title: 'Work Orders',
                            label: ' ',
                            cards: [this.state.workOrder]
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
                    ]
                }
            }

        />
    }
}

export default withApollo(withGlobalContent(BoardManager));