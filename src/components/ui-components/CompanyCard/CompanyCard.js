import React from 'react';
import './index.css';
import DeleteIcon from '@material-ui/icons/Delete';
import Route from 'react-router-dom/es/Route';
import { gql } from 'apollo-boost';
import Mutation from 'react-apollo/Mutation';
import CircularProgress from '../../material-ui/CircularProgress';
import AlertDialogSlide from 'Generic/AlertDialogSlide';

const DELETE_COMPANY = gql`
	mutation DeleteCompany($Id: Int!, $IsActive: Int!) {
		delbusinesscompanies(Id: $Id, IsActive: $IsActive) {
			Code
			Name
		}
	}
`;

class CompanyCard extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			deleted: false
		};

		this.Login = {
			LoginId: localStorage.getItem('LoginId'),
			IsAdmin: localStorage.getItem('IsAdmin'),
			AllowEdit: localStorage.getItem('AllowEdit') === 'true',
			AllowDelete: localStorage.getItem('AllowDelete') === 'true',
			AllowInsert: localStorage.getItem('AllowInsert') === 'true',
			AllowExport: localStorage.getItem('AllowExport') === 'true'
		};
	}

	render() {
		return (
			<Route
				render={({ history }) => (
					<div
						className="company-card"
						onClick={() => {
							history.push({
								pathname: '/home/company/edit',
								state: { idCompany: this.props.idCompany, idContract: this.props.idContract }
							});
						}}
					>
						<div className="company-card__header">
							<div className="company-card__header-options">
								<Mutation mutation={DELETE_COMPANY}>
									{(delbusinesscompanies, { loading, error }) => {
										if (loading) return <CircularProgress />;

										return (
											<DeleteIcon
												//disable={!true}
												disabled={
													this.state.idToEdit != null &&
													this.state.idToEdit != '' &&
													this.state.idToEdit != 0 ? (
														!this.Login.AllowEdit
													) : (
														!this.Login.AllowInsert
													)
												}
												className="delete-company-icon"
												onClick={(event) => {
													/*delbusinesscompanies({
														variables: {
															Id: this.props.idCompany,
															IsActive: 0
														}
													});

													this.setState({
														deleted: true
													});*/

													event.stopPropagation();
													return this.props.delete(this.props.idCompany);
												}}
											/>
										);
									}}
								</Mutation>
							</div>
							<img src={this.props.url} alt="" className="avatar" />
						</div>
						<div className="company-card__body">
							<div className="company-card__title">{this.props.name}</div>
							<div className="company-card__description">{this.props.description}</div>
						</div>
					</div>
				)}
			/>
		);
	}
}

export default CompanyCard;
