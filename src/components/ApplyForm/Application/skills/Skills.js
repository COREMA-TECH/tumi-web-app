import React, { Component } from 'react';
import withApollo from 'react-apollo/withApollo';
import InputRange from '../../ui/InputRange/InputRange';
import { ADD_SKILL, REMOVE_APPLICANT_SKILL } from '../../Mutations';
import { GET_APPLICATION_SKILLS_BY_ID } from '../../Queries';
import CircularProgressLoading from '../../../material-ui/CircularProgressLoading';
import withGlobalContent from '../../../Generic/Global';
import SkillCard from '../../../ui-components/SkillCard/SkillCard';

const menuSpanish = require(`../languagesJSON/${localStorage.getItem('languageForm')}/menuSpanish`);
const spanishActions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);

const skillsLabels = require(`../languagesJSON/${localStorage.getItem('languageForm')}/skills`);

const uuidv4 = require('uuid/v4');

class Skills extends Component {
	constructor(props) {
		super(props);

		this.state = {
			// Editing state properties - To edit general info
			editing: false,
			applicationId: null,

			// Skills array
			skills: [],
			newSkills: [],

			// skills dialog state
			open: false,
			loading: false,
			percent: 50
		};
	}

	// To open the skill dialog
	handleClickOpen = () => {
		this.setState({ open: true });
	};

	// To close the skill dialog
	handleClose = () => {
		this.setState({
			open: false,
			editing: false
		});
	};

	// To get a list of languages saved from API
	getSkillsList = (id) => {
		this.setState(
			{
				loading: true
			},
			() => {
				this.props.client
					.query({
						query: GET_APPLICATION_SKILLS_BY_ID,
						variables: {
							id: id
						},
						fetchPolicy: 'no-cache'
					})
					.then(({ data }) => {
						this.setState({
							skills: data.applications[0].skills,
							loading: false
						});

						document.getElementById('skill-form').reset();
					})
					.catch();
			}
		);
	};

	// To insert a list of skills
	insertSkillsApplication = () => {
		this.setState(
			{
				loading: true
			},
			() => {
				if (this.state.skills.length > 0) {
					// to remove all the uuid properties in the object
					this.state.skills.forEach((item) => {
						delete item.uuid;
					});

					this.state.skills.forEach((item) => {
						item.ApplicationId = this.state.applicationId;
					});

					this.setState(
						(prevState) => ({
							newSkills: this.state.skills.filter((_, i) => {
								return _.id === undefined;
							})
						}),
						() => {
							this.props.client
								.mutate({
									mutation: ADD_SKILL,
									variables: {
										application: this.state.newSkills
									}
								})
								.then(() => {
									this.setState({
										editing: false,
										newSkills: []
									});

									this.props.handleOpenSnackbar('success', 'Successfully created', 'bottom', 'right');

									this.getSkillsList(this.state.applicationId);
								})
								.catch((error) => {
									// Replace this alert with a Snackbar message error
									this.props.handleOpenSnackbar(
										'error',
										'Error to save skill. Please, try again!',
										'bottom',
										'right'
									);

									this.setState({
										loading: false
									});
								});
						}
					);
				}
			}
		);
	};

	removeSkillById = (id) => {
		this.props.client
			.mutate({
				mutation: REMOVE_APPLICANT_SKILL,
				variables: {
					id: id
				}
			})
			.then(({ data }) => {
				this.props.handleOpenSnackbar('success', 'Successfully removed', 'bottom', 'right');
				this.getSkillsList(this.state.applicationId);
			})
			.catch();
	};

	componentWillMount() {
		this.setState(
			{
				applicationId: this.props.applicationId
			},
			() => {
				this.getSkillsList(this.state.applicationId);
			}
		);
	}

	render() {
		// To render the skills section
		let renderSkillsSection = () => (
			<div className="">
				<div className="row">
					<div className="row-skill">
						{this.state.skills.map((skillItem) => (
							<SkillCard
								skillDescription={skillItem.description}
								skillLevel={skillItem.level}
								removeSkill={() => {
									this.setState(
										(prevState) => ({
											skills: this.state.skills.filter((_, i) => {
												return _.uuid !== skillItem.uuid;
											})
										}),
										() => {
											if (skillItem.id !== undefined) {
												this.removeSkillById(skillItem.id);
											}
										}
									);
								}}
							/>
						))}
					</div>
					<div className="col-md-12">
						<hr />
						{renderSkillsDialog()}
					</div>
				</div>
			</div>
		);

		// To render the Skills Dialog
		let renderSkillsDialog = () => (
			<form
				autoComplete="off"
				id="skill-form"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();

					let item = {
						uuid: uuidv4(),
						description: document.getElementById('description').value,
						level: this.state.percent
					};

					this.setState(
						(prevState) => ({
							open: false,
							skills: [...prevState.skills, item]
						}),
						() => {
							this.insertSkillsApplication();
						}
					);
				}}
				className="apply-form row form-section-1"
			>
				<div className="col-md-6">
					<span className="primary">* {skillsLabels[0].label}</span>
					<br />
					<input
						id="description"
						name="description"
						type="text"
						className="form-control"
						required
						min="0"
						maxLength="20"
						minLength="1"
						pattern=".*[^ ].*"
						form="skill-form"
					/>
				</div>
				<div className="col-md-6">
					<span className="primary">{skillsLabels[1].label}</span>
					<br />
					<InputRange
						getPercentSkill={(percent) => {
							this.setState({
								percent: percent
							});
						}}
					/>
				</div>
				<br />
				<div className="form-section--center">
					<button className="applicant-card__cancel-button" type="reset" onClick={this.handleClose}>
						{spanishActions[10].label}
					</button>
					<button className="applicant-card__save-button" type="submit" form="skill-form">
						{spanishActions[0].label}
					</button>
				</div>
			</form>
		);

		return (
			<div className="Apply-container--application">
				<div className="">
					<div className="">
						<div className="applicant-card">
							<div className="applicant-card__header">
								<span className="applicant-card__title">{menuSpanish[5].label}</span>
							</div>
							<div className="card-body">
								<div className="row">
									{this.state.loading ? (
										<div className="loading-container">
											{renderSkillsSection()}
											<div className="circular-progress-container">
												<CircularProgressLoading />
											</div>
										</div>
									) : (
											<div className="col-md-12">{renderSkillsSection()}</div>
										)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withApollo(withGlobalContent(Skills));
