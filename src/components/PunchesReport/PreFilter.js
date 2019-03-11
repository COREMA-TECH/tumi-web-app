import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GET_USER, GET_PROPERTY_BY_REGION } from './queries';
import withApollo from 'react-apollo/withApollo';

class PreFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            properties: [],
            openModal: true,
            property: 0
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

        this.props.client.query({
            query: GET_PROPERTY_BY_REGION,
            fetchPolicy: 'no-cache'
        }).then(({ data }) => {
            this.setState({
                properties: data.getbusinesscompanies
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

    render() {
        return (
            <Dialog maxWidth="md" open={this.state.openModal} onClose={this.props.handleCloseModal}>
                <DialogTitle style={{ padding: '0px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Prefilter Punches</h5>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className="card-body">
                        <form action="" onSubmit={this.changeFilter}>
                            <select type="text" className="form-control" name="property" required onChange={this.handleChange}>
                                <option value="">Select a Property</option>
                                {this.state.properties.map((property) => {
                                    return <option value={property.Id}>{property.Name}</option>
                                })}
                            </select>
                            <button type="submit" className="btn btn-success mt-2 float-right">
                                Filter
                            </button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

}

export default withApollo(PreFilter);