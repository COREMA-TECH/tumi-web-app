import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import Select from '../../material-ui/Select';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import Redirect from 'react-router-dom/es/Redirect';

const styles = (theme) => ({
	container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex: start',
		flexWrap: 'wrap',
		marginBottom: '30px'
	},
	formControl: {
		margin: theme.spacing.unit,
		width: '30%'
	},
	addressControl: {
		width: '47%'
	},
	formSelect: {
		margin: theme.spacing.unit,
		width: '23%'
	},
	divStyle: {
		width: '80%'
	}
});

class ComposedTextField extends React.Component {
	state = {
		name: '',
		legalName: '',
		description: '',
		location: '',
		address: '',
		optionalAddress: '',
		businessType: '',
		country: 6,
		state: 0,
		region: '',
		city: '',
		management: '',
		phoneNumber: '',
		startDate: '',
		startWeek: '',
		endWeek: '',
		workWeek: '',
		avatar: 'url',
		otherPhoneNumber: '',
		room: ''
	};

	getCountriesQuery = gql`
		{
			getcatalogitem(Id: null, IsActive: 1, Id_Parent: null, Id_Catalog: 2) {
				Id
				Name
				IsActive
			}
		}
	`;

	getStatesQuery = gql`
		query States($parent: Int!) {
			getcatalogitem(Id: null, IsActive: 1, Id_Parent: $parent, Id_Catalog: 3) {
				Id
				Name
				IsActive
			}
		}
	`;

	getCitiesQuery = gql`
		query Cities($parent: Int!) {
			getcatalogitem(Id: null, IsActive: 1, Id_Parent: $parent, Id_Catalog: 5) {
				Id
				Name
				IsActive
			}
		}
	`;

	//Query to get data of a specific company using the id received by props
	getCompanyQuery = gql`
		query getCompany($id: Int!) {
			getcompanies(Id: $id, IsActive: 1) {
				Id
				Code
				Code01
				Id_Company
				BusinessType
				Name
				Description
				Start_Week
				End_Week
				Start_Date
				Legal_Name
				Country
				State
				Region
				City
				Id_Parent
				IsActive
				User_Created
				User_Updated
				Date_Created
				Date_Updated
				ImageURL
			}
		}
	`;

	updateStateCountry = (id) => {
		this.setState({
			country: id
		});
	};

	updateStateState = (id) => {
		this.setState({
			state: id
		});
	};

	updateStateCity = (id) => {
		this.setState({
			city: id
		});
	};

	componentWillMount() {}

	render() {
		const { classes } = this.props;
		const ADD_TODO = gql`
			mutation insertCompanies($input: iParamBC!) {
				inscompanies(input: $input) {
					Id
					Name
					Description
				}
			}
		`;

		const UPDATE_COMPANIES = gql`
			mutation updateCompanies($input: iParamBC!) {
				updcompanies(input: $input) {
					Id
					Name
					Description
				}
			}
		`;

		if (this.state.name === '') {
			//lert("ID " + this.props.idCompany);
			return (
				<div className={classes.container}>
					<Query query={this.getCompanyQuery} variables={{ id: this.props.idCompany }}>
						{({ loading, error, data, refetch }) => {
							if (loading) return <LinearProgress />;
							if (error) return <p>Error </p>;
							if (data.getcompanies != null && data.getcompanies.length > 0) {
								data.getcompanies.map((item) => {
									this.setState({
										name: item.Name,
										legalName: item.Legal_Name,
										startWeek: item.Start_Week,
										endWeek: item.End_Week,
										description: item.Description,
										country: item.Country,
										state: item.State,
										city: item.City
									});
								});

								return true;
							}
							return <p>Nothing to display </p>;
						}}
					</Query>
					<div className={classes.divStyle}>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="name-simple">Company Name</InputLabel>
							<Input
								id="name-simple"
								value={this.state.name}
								onChange={(text) => this.setState({ name: text.target.value })}
							/>
						</FormControl>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="name-simple">Legal Name</InputLabel>
							<Input
								id="name-simple"
								value={this.state.legalName}
								onChange={(text) => this.setState({ legalName: text.target.value })}
							/>
						</FormControl>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="name-simple">Description</InputLabel>
							<Input
								id="name-simple"
								value={this.state.description}
								onChange={(text) => this.setState({ description: text.target.value })}
							/>
						</FormControl>
					</div>

					<div className={classes.divStyle}>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="name-simple">Management Company</InputLabel>
							<Input
								id="name-simple"
								value={this.state.management}
								onChange={(text) => this.setState({ management: text.target.value })}
							/>
						</FormControl>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="name-simple">Phone Number</InputLabel>
							<Input
								id="name-simple"
								value={this.state.phoneNumber}
								onChange={(text) => this.setState({ phoneNumber: text.target.value })}
							/>
						</FormControl>
					</div>
					<div className={classes.divStyle}>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="name-simple">Start Date</InputLabel>
							<Input
								id="name-simple"
								value={this.state.startWeek}
								onChange={(text) => this.setState({ startWeek: text.target.value })}
							/>
						</FormControl>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="name-simple">End Week</InputLabel>
							<Input
								id="name-simple"
								value={this.state.endWeek}
								onChange={(text) => this.setState({ endWeek: text.target.value })}
							/>
						</FormControl>
					</div>

					<div className={classes.divStyle}>
						<br />
						<br />
						<br />
						<h4>Address</h4>
						<FormControl className={[ classes.formControl, classes.addressControl ]}>
							<InputLabel htmlFor="name-simple">Address No. 1</InputLabel>
							<Input
								id="name-simple"
								value={this.state.address}
								onChange={(text) => this.setState({ address: text.target.value })}
							/>
						</FormControl>
						<FormControl className={[ classes.formControl, classes.addressControl ]}>
							<InputLabel htmlFor="name-simple">Address No. 2</InputLabel>
							<Input
								id="name-simple"
								value={this.state.optionalAddress}
								onChange={(text) => this.setState({ optionalAddress: text.target.value })}
							/>
						</FormControl>
					</div>
					<div className={classes.divStyle}>
						<FormControl className={classes.formSelect}>
							<Query query={this.getCountriesQuery}>
								{({ loading, error, data, refetch, networkStatus }) => {
									//if (networkStatus === 4) return <LinearProgress />;
									if (loading) return <LinearProgress />;
									if (error) return <p>Error </p>;
									if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
										return (
											<Select
												label={'Country'}
												values={data.getcatalogitem}
												value={this.state.country}
												update={this.updateStateCountry}
											/>
										);
									}
									return <p>Nothing to display </p>;
								}}
							</Query>
						</FormControl>
						<FormControl className={classes.formSelect}>
							<Query query={this.getStatesQuery} variables={{ parent: this.state.country }}>
								{({ loading, error, data, refetch, networkStatus }) => {
									//if (networkStatus === 4) return <LinearProgress />;
									if (loading) return <LinearProgress />;
									if (error) return <p>Error </p>;
									if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
										return (
											<Select
												label={'States'}
												update={this.updateStateState}
												value={this.state.state}
												values={data.getcatalogitem}
											/>
										);
									}
									return <p>Nothing to display </p>;
								}}
							</Query>
						</FormControl>
						<FormControl className={classes.formSelect}>
							<Query query={this.getCitiesQuery} variables={{ parent: this.state.state }}>
								{({ loading, error, data, refetch, networkStatus }) => {
									//if (networkStatus === 4) return <LinearProgress />;
									if (loading) return <LinearProgress />;
									if (error) return <p>Error </p>;
									if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
										return (
											<Select
												label={'Cities'}
												update={this.updateStateCity}
												value={this.state.city}
												values={data.getcatalogitem}
											/>
										);
									}
									return <p>Nothing to display </p>;
								}}
							</Query>
						</FormControl>
					</div>

					<div className={classes.divStyle}>
						<br />
						<br />
						<h4>Others</h4>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="name-simple">Phone Number</InputLabel>
							<Input
								id="name-simple"
								value={this.state.otherPhoneNumber}
								onChange={(text) =>
									this.setState({
										otherPhoneNumber: text.target.value
									})}
							/>
						</FormControl>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="name-simple">Rooms</InputLabel>
							<Input
								id="name-simple"
								value={this.state.room}
								onChange={(text) =>
									this.setState({
										room: text.target.value
									})}
							/>
						</FormControl>
						<Mutation mutation={ADD_TODO}>
							{(inscompanies, { loading, error }) => (
								<Button
									variant="contained"
									color="primary"
									className={classes.button}
									onClick={() => {
										inscompanies({
											variables: {
												input: {
													Id: 150,
													Code: "'SSAS'",
													Code01: "'SSAS'",
													Id_Company: 1,
													BusinessType: 1,
													Name: `'${this.state.name}'`,
													Description: `'${this.state.description}'`,
													Start_Week: this.state.startWeek,
													End_Week: this.state.endWeek,
													Legal_Name: `'${this.state.legalName}'`,
													Country: parseInt(this.state.country),
													State: parseInt(this.state.state),
													Region: 5,
													City: parseInt(this.state.city),
													Id_Parent: 1,
													IsActive: 1,
													User_Created: 1,
													User_Updated: 1,
													Date_Created: "'2018-08-14 16:10:25+00'",
													Date_Updated: "'2018-08-14 16:10:25+00'",
													ImageURL: `'${this.state.avatar}'`,
													Start_Date: "'2018-08-14'"
												}
											}
										});
									}}
								>
									Add Contact
								</Button>
							)}
						</Mutation>
					</div>
				</div>
			);
		} else {
			return (
				<div className={classes.container}>
					<div className={classes.divStyle}>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="name-simple">Company Name</InputLabel>
							<Input
								id="name-simple"
								value={this.state.name}
								onChange={(text) => this.setState({ name: text.target.value })}
							/>
						</FormControl>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="name-simple">Legal Name</InputLabel>
							<Input
								id="name-simple"
								value={this.state.legalName}
								onChange={(text) => this.setState({ legalName: text.target.value })}
							/>
						</FormControl>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="name-simple">Description</InputLabel>
							<Input
								id="name-simple"
								value={this.state.description}
								onChange={(text) => this.setState({ description: text.target.value })}
							/>
						</FormControl>
					</div>

					<div className={classes.divStyle}>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="name-simple">Management Company</InputLabel>
							<Input
								id="name-simple"
								value={this.state.management}
								onChange={(text) => this.setState({ management: text.target.value })}
							/>
						</FormControl>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="name-simple">Phone Number</InputLabel>
							<Input
								id="name-simple"
								value={this.state.phoneNumber}
								onChange={(text) => this.setState({ phoneNumber: text.target.value })}
							/>
						</FormControl>
					</div>
					<div className={classes.divStyle}>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="name-simple">Start Date</InputLabel>
							<Input
								id="name-simple"
								value={this.state.startWeek}
								onChange={(text) => this.setState({ startWeek: text.target.value })}
							/>
						</FormControl>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="name-simple">End Week</InputLabel>
							<Input
								id="name-simple"
								value={this.state.endWeek}
								onChange={(text) => this.setState({ endWeek: text.target.value })}
							/>
						</FormControl>
					</div>

					<div className={classes.divStyle}>
						<br />
						<br />
						<br />
						<h4>Address</h4>
						<FormControl className={[ classes.formControl, classes.addressControl ]}>
							<InputLabel htmlFor="name-simple">Address No. 1</InputLabel>
							<Input
								id="name-simple"
								value={this.state.address}
								onChange={(text) => this.setState({ address: text.target.value })}
							/>
						</FormControl>
						<FormControl className={[ classes.formControl, classes.addressControl ]}>
							<InputLabel htmlFor="name-simple">Address No. 2</InputLabel>
							<Input
								id="name-simple"
								value={this.state.optionalAddress}
								onChange={(text) => this.setState({ optionalAddress: text.target.value })}
							/>
						</FormControl>
					</div>
					<div className={classes.divStyle}>
						<FormControl className={classes.formSelect}>
							<Query query={this.getCountriesQuery}>
								{({ loading, error, data, refetch, networkStatus }) => {
									//if (networkStatus === 4) return <LinearProgress />;
									if (loading) return <LinearProgress />;
									if (error) return <p>Error </p>;
									if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
										return (
											<Select
												label={'Country'}
												values={data.getcatalogitem}
												update={this.updateStateCountry}
											/>
										);
									}
									return <p>Nothing to display </p>;
								}}
							</Query>
						</FormControl>
						<FormControl className={classes.formSelect}>
							<Query query={this.getStatesQuery} variables={{ parent: this.state.country }}>
								{({ loading, error, data, refetch, networkStatus }) => {
									//if (networkStatus === 4) return <LinearProgress />;
									if (loading) return <LinearProgress />;
									if (error) return <p>Error </p>;
									if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
										return (
											<Select
												label={'States'}
												update={this.updateStateState}
												values={data.getcatalogitem}
											/>
										);
									}
									return <p>Nothing to display </p>;
								}}
							</Query>
						</FormControl>
						<FormControl className={classes.formSelect}>
							<Query query={this.getCitiesQuery} variables={{ parent: this.state.state }}>
								{({ loading, error, data, refetch, networkStatus }) => {
									//if (networkStatus === 4) return <LinearProgress />;
									if (loading) return <LinearProgress />;
									if (error) return <p>Error </p>;
									if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
										return (
											<Select
												label={'Cities'}
												update={this.updateStateCity}
												values={data.getcatalogitem}
											/>
										);
									}
									return <p>Nothing to display </p>;
								}}
							</Query>
						</FormControl>
					</div>

					<div className={classes.divStyle}>
						<br />
						<br />
						<h4>Others</h4>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="name-simple">Phone Number</InputLabel>
							<Input
								id="name-simple"
								value={this.state.otherPhoneNumber}
								onChange={(text) =>
									this.setState({
										otherPhoneNumber: text.target.value
									})}
							/>
						</FormControl>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="name-simple">Rooms</InputLabel>
							<Input
								id="name-simple"
								value={this.state.room}
								onChange={(text) =>
									this.setState({
										room: text.target.value
									})}
							/>
						</FormControl>
						<Mutation mutation={ADD_TODO}>
							{(inscompanies, { loading, error }) => (
								<Button
									variant="contained"
									color="primary"
									className={classes.button}
									onClick={() => {
										inscompanies({
											variables: {
												input: {
													Id: 150,
													Code: "'SSAS'",
													Code01: "'SSAS'",
													Id_Company: 1,
													BusinessType: 1,
													Name: `'${this.state.name}'`,
													Description: `'${this.state.description}'`,
													Start_Week: this.state.startWeek,
													End_Week: this.state.endWeek,
													Legal_Name: `'${this.state.legalName}'`,
													Country: parseInt(this.state.country),
													State: parseInt(this.state.state),
													Region: 5,
													City: parseInt(this.state.city),
													Id_Parent: 1,
													IsActive: 1,
													User_Created: 1,
													User_Updated: 1,
													Date_Created: "'2018-08-14 16:10:25+00'",
													Date_Updated: "'2018-08-14 16:10:25+00'",
													ImageURL: `'${this.state.avatar}'`,
													Start_Date: "'2018-08-14'"
												}
											}
										});
									}}
								>
									Add Company
								</Button>
							)}
						</Mutation>

						<Mutation mutation={UPDATE_COMPANIES}>
							{(updcompanies, { loading, error }) => (
								<Button
									variant="contained"
									color="primary"
									className={classes.button}
									onClick={() => {
										updcompanies({
											variables: {
												input: {
													Id: this.props.idCompany,
													Code: "'SSAS'",
													Code01: "'SSAS'",
													Id_Company: 1,
													BusinessType: 1,
													Name: `'${this.state.name}'`,
													Description: `'${this.state.description}'`,
													Start_Week: this.state.startWeek,
													End_Week: this.state.endWeek,
													Legal_Name: `'${this.state.legalName}'`,
													Country: parseInt(this.state.country),
													State: parseInt(this.state.state),
													Region: 5,
													City: parseInt(this.state.city),
													Id_Parent: 1,
													IsActive: 1,
													User_Created: 1,
													User_Updated: 1,
													Date_Created: "'2018-08-14 16:10:25+00'",
													Date_Updated: "'2018-08-14 16:10:25+00'",
													ImageURL: `'${this.state.avatar}'`,
													Start_Date: "'2018-08-14'"
												}
											}
										});

										<Redirect
											to={{
												pathname: '/Company'
											}}
										/>;
									}}
								>
									Edit Company
								</Button>
							)}
						</Mutation>
					</div>
				</div>
			);
		}
	}
}

ComposedTextField.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ComposedTextField);
