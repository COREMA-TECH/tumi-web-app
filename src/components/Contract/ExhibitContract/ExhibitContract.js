import React, { Component } from 'react';
import './index.css';
import TextAreaForm from '../../ui-components/InputForm/TextAreaForm';
import withApollo from 'react-apollo/withApollo';
import { gql } from 'apollo-boost';
import PositionsCompanyForm from '../../Company/PositionsCompanyForm/';
import { Snackbar } from '@material-ui/core';
import { MySnackbarContentWrapper } from '../../Generic/SnackBar';

class ExhibitContract extends Component {
	constructor(props) {
		super(props);

		this.state = {
			exhibitA: '',
			exhibitB: '',
			exhibitC: '',
			exhibitD: '',
			exhibitE: '',
			exhibitF: '',
			openSnackbar: false,
			variantSnackbar: 'info',
			messageSnackbar: 'Dummy text!'
		};
	}

	ADD_EXHIBIT = gql`
		mutation updcontracstexhibit(
			$Id: Int
			$Exhibit_B: String
			$Exhibit_C: String
			$Exhibit_D: String
			$Exhibit_E: String
			$Exhibit_F: String
		) {
			updcontracstexhibit(
				Id: $Id
				Exhibit_B: $Exhibit_B
				Exhibit_C: $Exhibit_C
				Exhibit_D: $Exhibit_D
				Exhibit_E: $Exhibit_E
				Exhibit_F: $Exhibit_F
			) {
				Id
				Exhibit_B
				Exhibit_C
				Exhibit_D
				Exhibit_E
				Exhibit_F
			}
		}
	`;

	insertExhibit = () => {
		this.props.client.mutate({
			mutation: this.ADD_EXHIBIT,
			variables: {
				Id: parseInt(this.props.contractId),
				Exhibit_B: `'${this.state.exhibitB}'`,
				Exhibit_C: `'${this.state.exhibitC}'`,
				Exhibit_D: `'${this.state.exhibitD}'`,
				Exhibit_E: `'${this.state.exhibitE}'`,
				Exhibit_F: `'${this.state.exhibitF}'`
			}
		});
	};

	handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		this.setState({ openSnackbar: false });
	};

	handleOpenSnackbar = (variant, message) => {
		this.setState({
			openSnackbar: true,
			variantSnackbar: variant,
			messageSnackbar: message
		});
	};

	render() {
		return (
			<div className="contract-container">
				<Snackbar
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center'
					}}
					open={this.state.openSnackbar}
					autoHideDuration={3000}
					onClose={this.handleCloseSnackbar}
				>
					<MySnackbarContentWrapper
						onClose={this.handleCloseSnackbar}
						variant={this.state.variantSnackbar}
						message={this.state.messageSnackbar}
					/>
				</Snackbar>
				<div className="contract-body">
					<div className="contract-body__content">
						<div className="contract-body-row">
							<div className="contract-body-row__content">
								<div className="contract-body-row__header">
									<span className="contract-body__subtitle">Exhibit A (Rates & Positions)</span>
								</div>
								<div className="contract-body-row__form contract-body-row__form--lg">
									<PositionsCompanyForm
										idCompany={this.props.idCompany}
										idContract={this.props.idContract}
										handleOpenSnackbar={this.handleOpenSnackbar}
										showStepper={false}
									/>
								</div>
							</div>

							<div className="contract-body-row__content">
								<div className="contract-body-row__header">
									<span className="contract-body__subtitle">Exhibit B</span>
								</div>
								<div className="contract-body-row__form">
									<div className="card-form-body">
										<div className="card-form-row">
											<span className="input-label primary">Contract Terms</span>
											<TextAreaForm
												value={this.state.exhibitB}
												change={(text) => {
													this.setState({
														exhibitB: text
													});
												}}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="contract-body-row__content">
								<div className="contract-body-row__header">
									<span className="contract-body__subtitle">Exhibit C</span>
								</div>
								<div className="contract-body-row__form">
									<div className="card-form-body">
										<div className="card-form-row">
											<span className="input-label primary">Contract Terms</span>
											<TextAreaForm
												value={this.state.exhibitC}
												change={(text) => {
													this.setState({
														exhibitC: text
													});
												}}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="contract-body-row__content">
								<div className="contract-body-row__header">
									<span className="contract-body__subtitle">Exhibit D</span>
								</div>
								<div className="contract-body-row__form">
									<div className="card-form-body">
										<div className="card-form-row">
											<span className="input-label primary">Contract Terms</span>
											<TextAreaForm
												value={this.state.exhibitD}
												change={(text) => {
													this.setState({
														exhibitD: text
													});
												}}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="contract-body-row__content">
								<div className="contract-body-row__header">
									<span className="contract-body__subtitle">Exhibit E</span>
								</div>
								<div className="contract-body-row__form">
									<div className="card-form-body">
										<div className="card-form-row">
											<span className="input-label primary">Contract Terms</span>
											<TextAreaForm
												value={this.state.exhibitE}
												change={(text) => {
													this.setState({
														exhibitE: text
													});
												}}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="contract-body-row__content">
								<div className="contract-body-row__header">
									<span className="contract-body__subtitle">Exhibit F</span>
								</div>
								<div className="contract-body-row__form">
									<div className="card-form-body">
										<div className="card-form-row">
											<span className="input-label primary">Contract Terms</span>
											<TextAreaForm
												value={this.state.exhibitF}
												change={(text) => {
													this.setState({
														exhibitF: text
													});
												}}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="contract-footer">
							<div
								className="contract-next-button"
								onClick={() => {
									// Insert Exhibits
									this.insertExhibit();
								}}
							>
								Save
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withApollo(ExhibitContract);
