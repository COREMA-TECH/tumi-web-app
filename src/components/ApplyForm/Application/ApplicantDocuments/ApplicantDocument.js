import React, { Component } from 'react';
import CircularProgressLoading from 'material-ui/CircularProgressLoading';

import './ApplicantDocumen.css';
import { GET_DOCUMENTS_TEMPLATE } from '../../Queries';
import withApollo from 'react-apollo/withApollo';
import withGlobalContent from '../../../Generic/Global';

const menuSpanish = require(`../languagesJSON/${localStorage.getItem('languageForm')}/menuSpanish`);
const spanishActions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);
const languagesTable = require(`../languagesJSON/${localStorage.getItem('languageForm')}/languagesTable`);

class ApplicantDocument extends Component {
	constructor(props) {
		super(props);

		this.state = {
			// Editing state properties - To edit general info
			editing: false,
			languages: [],
			languagesLoaded: [],
			newLanguages: [],
			applicationId: null,
			loading: false
		};
	}

	getTemplateDocuments = () => {
		this.setState(
			{
				loading: true
			},
			() => {
				this.props.client
					.query({
						query: GET_DOCUMENTS_TEMPLATE,
						fetchPolicy: 'no-cache'
					})
					.then(({ data }) => {
						this.setState({
							templates: data.getcatalogitem,
							loading: false
						});
					})
					.catch((error) => {
						this.setState({
							loading: false
						});
						this.props.handleOpenSnackbar(
							'error',
							'Error to show template document list. Please, try again!',
							'bottom',
							'right'
						);
					});
			}
		);
	};
	componentWillMount() {
		this.getTemplateDocuments();
	}
	renderList = () => {
		if (!this.state.templates) return false;
		return this.state.templates.map((item) => {
			return (
				<div key={item.Id} class="group-container">
					<span class="group-title">{item.Name}</span>
					<div class="image-upload-wrap">
						<input class="file-upload-input" type="file" onchange="readURL(this);" accept="image/*" />
						<div class="drag-text">
							<div>+</div>
						</div>
					</div>
					<div class="button-container">
						<button class="file-input">Download Template</button>
					</div>
				</div>
			);
		});
	};
	render() {
		return (
			<div className="Apply-container--application">
				<div className="row">
					<div className="col-12">
						<div className="applicant-card">
							<div className="applicant-card__header">
								<span className="applicant-card__title">{menuSpanish[6].label}</span>
							</div>
							<div className="row">
								{this.state.loading ? (
									<div className="form-section-1 form-section--center">
										<CircularProgressLoading />
									</div>
								) : (
									<div class="main-group-container">
										{this.renderList()}
										<div key={0} class="group-container">
											<span class="group-title">Cargado</span>
											<div class="image-show-wrap">
												<div class="drag-text">
													<i class="far fa-file-alt fa-7x" />
												</div>
											</div>
											<div class="button-container">
												<button class="file-input input-middle">
													<i class="fas fa-file-download fa-lg" />
												</button>
												<button class="file-input input-middle">
													<i class="fas fa-trash-alt fa-lg" />
												</button>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withApollo(withGlobalContent(ApplicantDocument));
