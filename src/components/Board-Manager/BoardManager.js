import React, { Component } from 'react';
import './index.css';
import withGlobalContent from '../Generic/Global';
import withApollo from 'react-apollo/withApollo';
import PropTypes from 'prop-types';

import { GET_WORK_ORDERS } from './Mutations';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
//import Board from 'react-trello'
import { Board } from 'react-trello';

import { InputLabel } from '@material-ui/core';
import Query from 'react-apollo/Query';
import SelectNothingToDisplay from '../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';

const handleDragStart = (cardId, laneId) => {
	console.log('drag started');
	console.log(`cardId: ${cardId}`);
	console.log(`laneId: ${laneId}`);
};

const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
	console.log('drag ended');
	console.log(`cardId: ${cardId}`);
	console.log(`sourceLaneId: ${sourceLaneId}`);
	console.log(`targetLaneId: ${targetLaneId}`);
};

class BoardManager extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			// workOrder: [{ id: '', title: '', description: '', label: '' }]
			workOrder: [],
			lane: []
		};

		console.log('Inicializacion de variables');
	}

	/* const Cards = {
         
  
     };*/

	componentWillMount() {
		this.setState(
			{
				loading: true
			},
			() => {
				this.getWorkOrders();
			}
		);
	}

	validateInvalidInput = () => {
		console.log('estoy en accion');
	};

	shouldReceiveNewData = (nextData) => {
		console.log('New card has been added');
		console.log(nextData);
	};

	handleCardAdd = (card, laneId) => {
		console.log(`New card added to lane ${laneId}`);
		console.dir(card);
	};

	getWorkOrders = () => {
		this.props.client
			.query({ query: GET_WORK_ORDERS, variables: {} })
			.then(({ data }) => {
				let datas = [];
				let workOrders = [];

				data.workOrder.forEach((wo) => {
					datas = {
						id: wo.id,
						title: wo.comment,
						description: wo.comment,
						label: '30 mins'
					};
					workOrders.push(datas);
				});
				this.setState({
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
			})
			.catch((error) => {});
	};

	render() {
		return (
			<div className="App">
				<div className="App-header" />
				<div className="App-intro">
					<Board
						// editable
						onCardAdd={this.handleCardAdd}
						data={{ lanes: this.state.lane }}
						draggable
						onDataChange={this.shouldReceiveNewData}
						eventBusHandle={this.setEventBus}
						handleDragStart={handleDragStart}
						handleDragEnd={handleDragEnd}
						style={{
							backgroundColor: 'white'
						}}
						// onClick={alert("aqui estoy")}
					/>
				</div>
			</div>
		);
		/* return <
             Board data={
                 { lanes: this.state.lane }
             }
 
         />*/
	}
}

export default withApollo(withGlobalContent(BoardManager));
