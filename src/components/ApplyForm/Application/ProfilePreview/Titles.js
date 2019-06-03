import React , { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Select from 'react-select';
import makeAnimated from "react-select/lib/animated";
import {GET_POSITION} from "./Queries";
import withGlobalContent from 'Generic/Global';
import { withApollo } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';


const styles = {
    paper: { overflowY: 'unset' },
    container: { overflowY: 'unset' }
};

class Titles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            positionCatalogTag: [],
            title: null
        }
    }

    handleChangeTitle = (positionsTags) => {
        this.setState({ positionsTags });
    };

    getPositions = () => {
        this.props.client
            .query({
                query: GET_POSITION
            })
            .then(({ data }) => {
                let dataAPI = data.getposition;
                dataAPI.map(item => {
                    this.setState(prevState => ({
                        positionCatalogTag: [...prevState.positionCatalogTag, {
                            value: item.Id, label: item.Position.trim(), key: item.Id
                        }]
                    }))
                });

            }).catch(error => {
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error loading Department list',
                        'bottom',
                        'right'
                    );
            });
    }

    componentWillMount() {
        this.getPositions();
    }

    render() {
        const { classes } = this.props;

        return(
            <Dialog open={this.props.titleModal} maxWidth="md" classes={{ paper: classes.paper }}>
                <DialogTitle>
                    <h5>Add Titles</h5>
                </DialogTitle>
                <DialogContent style={{ minWidth: 300, overflowY: "unset" }}>
                    <Select
                        options={this.state.positionCatalogTag}
                        value={this.state.title}
                        onChange={this.handleChangeTitle}
                        closeMenuOnSelect={true}
                        components={makeAnimated()}
                        isMulti={true}
                    />
                </DialogContent>     
                <DialogActions>
                    <button className="btn btn-success" type="submit">Save</button>
                    <button className="btn btn-danger" onClick={this.props.hanldeCloseTitleModal}>Cancel</button>
                </DialogActions>
            </Dialog>
        );
    }

}

export default withStyles(styles)(withApollo(withGlobalContent(Titles)));