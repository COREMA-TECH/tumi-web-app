import React, { Component } from "react";
import TransactionTable from "./TransactionTable";
import withGlobalContent from 'Generic/Global';
import { GET_TRANSACTION_LOGS } from './queries';
import withApollo from 'react-apollo/withApollo';
import { withStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';

import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import ErrorMessageComponent from 'ui-components/ErrorMessageComponent/ErrorMessageComponent';


const styles = (theme) => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto'
    },
    table: {
        minWidth: 500
    },
    tableWrapper: {
        overflowX: 'auto'
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default
        },
        '&:hover': {
            cursor: 'pointer'
        }
    },
    fab: {
        margin: theme.spacing.unit * 2
    },
    absolute: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 3
    },
    th: {
        backgroundColor: '#3da2c7'
    }
});

class Transactions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            openModal: false,
            openLife: false,
            item: null,
            refresh: false,
			filterText: '',
        };
    }

    handleClickOpenModal = () => {
        this.setState({ openModal: true, item: null });
    };

    handleCloseModal = (event) => {
        // event.preventDefault();
        this.setState({
            openModal: false

        });
    };

    onEditHandler = (item) => {

        this.setState({
            openModal: true,
            item: item
        });
    };

    toggleRefresh = () => {
        this.setState((prevState) => { return { refresh: !prevState.refresh } })
    }

    render() {
        return (
            <div>
                <div className="row">
                <div className="col-md-3 col-xl-2">
					<div className="input-group mb-2">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon1">
								<i className="fa fa-search icon" />
							</span>
						</div>
						<input
							onChange={(text) => {
								this.setState({
									filterText: text.target.value
								});
							}}
							value={this.state.filterText}
							type="text"
							placeholder="Transaction Search"
							className="form-control"
						/>
					</div>
				</div>
                    <div className="col-md-12">
                        {/*<button className="btn btn-success float-right" onClick={this.handleClickOpenModal}>
                            Add Region <i className="fas fa-plus"></i>
                        </button> */}
                    </div>
                </div>

                <div className="main-application">
              
				<div className="main-contract__content">
					<Query query={GET_TRANSACTION_LOGS}  >
						{({ loading, error, data, refetch, networkStatus }) => {

							if (this.state.filterText === '') {
								if (loading && !this.state.opendialog) return <LinearProgress />;
							}

							if (error)
								return (
									<ErrorMessageComponent
										title="Oops!"
										message={'Error loading Transaction Logs'}
										type="Error-danger"
										icon="danger"
									/>
								);

							if (data.transactionLogs != null && data.transactionLogs.length > 0) {
								const dataTransaction =
									this.state.filterText === ''
										? data.transactionLogs
										: data.transactionLogs.filter((_, i) => {
											if (
												(_.nameUser +
													_.affectedObject +
													_.action )
													.toLocaleLowerCase()
													.indexOf(this.state.filterText.toLocaleLowerCase()) > -1
											) {
												return true;
											}
										});

								return (
									<div className="row pt-0">
										<div className="col-md-12">
											<div className="card">		
                                            <TransactionTable
                                                filter={0}
                                                data={dataTransaction}
                                                onEditHandler={this.onEditHandler}
                                                handleOpenSnackbar={this.props.handleOpenSnackbar}
                                                toggleRefresh={this.toggleRefresh}
                                                handleCloseModal={this.handleCloseModal}
                                            //dataRegions={this.state.data}
                                            />
											</div>
										</div>
									</div>
								);
							}
							return (
								<NothingToDisplay
									title="Oops!"
									message={'There are no applications'}
									type="Error-success"
									icon="wow"
								/>
							);
						}}
					</Query>
				</div>
                </div>

               
                
            </div>
        );
    }

}

export default withStyles(styles)(withApollo(withGlobalContent(Transactions)));

//export default withGlobalContent(Transactions);
//export default withStyles(styles)(withApollo(Region));
