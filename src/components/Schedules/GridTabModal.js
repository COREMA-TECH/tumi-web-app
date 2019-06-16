import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import { withApollo } from 'react-apollo';
import withGlobalContent from 'Generic/Global';
import { GET_POSITION } from './Queries';

class GridTabModal extends Component {
    
    constructor() {
        super();
        this.state = {
            positions: [],
            positionTags: []
        }
    }

    componentWillMount() {
        this.getPositions(this.props.department);
    }

    getPositions = (departmentId) => {
        this.props.client.query({
            query: GET_POSITION,
            fetchPolicy: 'no-cache',
            variables: {
                Id_Department: departmentId
            }
        }).then(({ data }) => {
            //Save data into state
            let dataAPI = data.getposition;
            dataAPI.map(item => {
                this.setState(prevState => ({
                    positions: [...prevState.positions, {
                        value: item.Id, label: item.Position
                    }]
                }))
            });
        }).catch(error => {
            this.props.handleOpenSnackbar(
                'error',
                'Error loading positions list'
            );
        });
    }

    handleChangeEmployees = (positionTags) => {
        this.setState({ positionTags });
    };

    handleSubmit = () => {
        console.log(this.state.positionTags);
       // this.props.addTab();
    }

    render() {
        return(
            <React.Fragment>
                <Dialog fullWidth={true} maxWidth={'sm'} open={this.props.open}>
                    <DialogContent>
                        <form action="" onSubmit={this.handleSubmit}>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <Select
                                            options={this.state.positions}
                                            value={this.state.positionTags}
                                            onChange={this.handleChangePositions}
                                            closeMenuOnSelect={true}
                                            components={makeAnimated()}
                                            isMulti={false}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <button className="btn btn-success" type="submit">
                                            Add Tab
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        );
    }

}

export default withApollo(withGlobalContent(GridTabModal));