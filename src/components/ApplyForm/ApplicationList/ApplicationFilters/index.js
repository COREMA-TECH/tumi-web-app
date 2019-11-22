import React, {Fragment, Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import makeAnimated from 'react-select/lib/animated';
import Select from 'react-select';
import { GET_PROPERTIES_QUERY, GET_DEPARTMENTS_QUERY } from '../Queries';
import withApollo from 'react-apollo/withApollo';

const DEFAULT_PROPERTY = { value: '', label: 'Property(All)' };
const DEFAULT_DEPARTMENT = { value: '', label: 'Department(All)' };
const DEFAULT_STATUS = { value: 1, label: 'Active' };

class ApplicationFilters extends Component {

    constructor(props) {
		super(props);

		this.state = {
			applications: [],
			property: DEFAULT_PROPERTY,
			department: DEFAULT_DEPARTMENT,
			properties: [],
			departments: [],
			statu: DEFAULT_STATUS,
			statusValue: [{
				value: 1,
				label: 'Status'
			}],
			status: [{
				value: 1,
				label: "Active"
			}, {
				value: 2,
				label: "Inactive"
			}, {
				value: 3,
				label: "All"
			}],
		};
    }

    /**
     * @return {Void}
     */
    getProperties = () => {
		this.setState(() => ({ loadingProperties: true }), () => {
			this.props.client
				.query({
					query: GET_PROPERTIES_QUERY,
					fetchPolicy: 'no-cache'
				})
				.then(({ data }) => {
					let options = [];

					//Add first record
					options.push(DEFAULT_PROPERTY);

					//Create structure based on property data
					data.getbusinesscompanies.map((property) => {
						options.push({ value: property.Id, label: property.Code + " | " + property.Name });
					});

					//Set values to state
					this.setState(() => ({
						properties: options,
						loadingProperties: false
					}));

				})
				.catch(error => {
					this.setState(() => ({ loadingProperties: false }));
				});
		})
	}

    /**
     * @return {Void}
     */
	getDepartments = () => {
		this.setState(() => ({ loadingDepartments: true }), () => {
			var variables = {};

			if (this.state.property.value)
				variables = { Id_Entity: this.state.property.value };

			this.props.client
				.query({
					query: GET_DEPARTMENTS_QUERY,
					variables,
					fetchPolicy: 'no-cache'
				})
				.then(({ data }) => {
					let options = [];

					//Add first record
					options.push({ value: '', label: 'Department(All)' });

					//Create structure based on department data
					data.catalogitem.map(({ Id, DisplayLabel }) => {
						options.push({ value: Id, label: DisplayLabel })
					});

					this.setState(() => ({
						departments: options,
						loadingDepartments: false
					}));
				})
				.catch(error => {
					this.setState(() => ({ loadingDepartments: false }));
				});
		})
	}
    
    componentWillMount() {
        this.getProperties();
    }
    
    /**
     * @param {Object} property
     * @return {Void}
     */
    handlePropertyChange = (property) => {
		this.setState((prevState) => ({
			property,
			department: prevState.property.value != property.value ? DEFAULT_DEPARTMENT : prevState.department,
			departments: prevState.property.value != property.value ? [] : prevState.departments
		}), () => {
			this.getDepartments();
		});
    }
    
    /**
     * @param {Object} department
     * @return {Void}
     */
	handleDepartmentChange = (department) => {
		this.setState(() => ({ department }));
    }
    
    /**
     * @param {Object} statu
     * @return {Void}
     */
	handleStatusChange = (statu) => {
		this.setState(() => ({ statu }));
    }
    
    /**
     * @param {*} event
     * @return {Void}
     */
    handleSubmit = (event) => {
        event.preventDefault();
        let property = this.state.property.value;
        let department = this.state.department.value;
        let status = this.state.statu.value;
        this.props.getApplications(property, department, status);
        this.props.handleOpenModal();
    }

    render() {
        return (
            <Fragment>
                <Dialog fullWidth maxWidth="sm" open={this.props.open} >
                    <form action="" onSubmit={this.handleSubmit}>
                        <DialogTitle>
                            Apply Filters
                        </DialogTitle>
                        <DialogContent>
                            <div className="row">
                                <div className="col-md-12">
                                    <Select
                                        name="property"
                                        options={this.state.properties}
                                        value={this.state.property}
                                        onChange={this.handlePropertyChange}
                                        components={makeAnimated()}
                                        closeMenuOnSelect
                                    />
                                </div>
                                <div className="col-md-12 mt-2">
                                    <Select
                                        name="department"
                                        options={this.state.departments}
                                        value={this.state.department}
                                        onChange={this.handleDepartmentChange}
                                        components={makeAnimated()}
                                        closeMenuOnSelect
                                    />
                                </div>
                                <div className="col-md-12 mt-2">
                                    <Select
                                        name="status"
                                        options={this.state.status}
                                        value={this.state.statu}
                                        onChange={this.handleStatusChange}
                                        components={makeAnimated()}
                                        closeMenuOnSelect
                                    />
                                </div>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <button className="btn btn-success  btn-not-rounded mr-1 ml-2 mb-2" type="submit">
                                Apply
                            </button>
                            <button className="btn btn-info  btn-not-rounded mb-2" type="button" onClick={this.props.handleOpenModal}>
                                Cancel
                            </button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Fragment>
        )
    }
}

export default withApollo(ApplicationFilters);