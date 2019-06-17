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
import { withStyles } from '@material-ui/core/styles';

const styles = {
    paper: { overflowY: 'unset' },
    container: { overflowY: 'unset' }
};

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
            let positions = [];

            dataAPI.map(item => {
                positions.push( {
                    value: item.Id, label: item.Position
                });
            });

            this.setState(prevState => ({
                positions: positions
            }))
        }).catch(error => {
            this.props.handleOpenSnackbar(
                'error',
                'Error loading positions list'
            );
        });
    }

    handleChangePositions = (positionTags) => {
        console.log(positionTags)
        this.setState({ positionTags });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.addTab({ id: this.state.positionTags.value, name: this.state.positionTags.label });
    }

    render() {
        const { classes } = this.props;
        return(
            <React.Fragment>
                <Dialog fullWidth={true} maxWidth={'sm'} open={this.props.open} classes={{ paper: classes.paper }}>
                    <DialogContent style={{ overflowY: "unset" }}>
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
                                    <div className="col-md-12 mt-2 text-right">
                                        <button className="btn btn-danger mr-1" type="button" onClick={this.props.closeGrdiModal}>  
                                            Cancel
                                        </button>
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

export default withStyles(styles)(withApollo(withGlobalContent(GridTabModal)));