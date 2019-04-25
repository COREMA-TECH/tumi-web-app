import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GET_USER, GET_PROPERTY_BY_REGION } from './queries';
import withApollo from 'react-apollo/withApollo';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    paper: { overflowY: 'unset' },
    container: { overflowY: 'unset' }
};

class PreFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            properties: [],
            openModal: true,
            property: 0,
            options: []
        }
    }

    getUser = () => {
        this.props.client.query({
            query: GET_USER,
            fetchPolicy: 'no-cache',
            variables: {
                id: localStorage.getItem('LoginId')
            }
        }).then(({ data }) => {
            this.getPropertiesByRegion(data.user[0].IdRegion);
        }).catch(({ error }) => {
            console.log(error)
        });
    }

    getPropertiesByRegion = (IdRegion) => {

        if (IdRegion == 0) return false;
        let options = [];

        this.props.client.query({
            query: GET_PROPERTY_BY_REGION,
            fetchPolicy: 'no-cache'
        }).then(({ data }) => {
            this.setState({
                properties: data.getbusinesscompanies
            }, () => {
                this.state.properties.map((property) => {
                    options.push({ value: property.Id, label: property.Code + " | " + property.Name });
                });
                this.setState({ options: options });
            });
        });
    }

    componentWillMount() {
        this.getUser();
    }

    changeFilter = (event) => {
        event.preventDefault();
        this.props.changeFilter(this.state.property);
        this.setState({
            openModal: false
        });
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    }

    handleChangePreFilter = (property) => {
        this.setState({ property });
    };

    render() {
        const { classes } = this.props;
        return (
            <Dialog maxWidth="md" open={this.state.openModal} onClose={this.props.handleCloseModal} classes={{ paper: classes.paper }}>
                <DialogTitle style={{ padding: '0px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Prefilter Punches</h5>
                    </div>
                </DialogTitle>
                <DialogContent style={{ overflowY: "unset" }}>
                    <div className="card-body" style={{ minWidth: "250px", width: "100%" }}>
                        <form action="" onSubmit={this.changeFilter}>
                            <Select
                                options={this.state.options}
                                value={this.state.property}
                                onChange={this.handleChangePreFilter}
                                components={makeAnimated()}
                                closeMenuOnSelect
                            />
                            <button type="submit" className="btn btn-success mt-2 float-right">
                                Filter
                            </button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog >
        );
    }

}

PreFilter.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withApollo(PreFilter));