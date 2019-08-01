import React , { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Select from 'react-select';
import makeAnimated from "react-select/lib/animated";
import {GET_POSITION} from "./Queries";
import { ADD_IDEAL_JOB } from "./Mutations";
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
            title: null,
            positionsTags: null,
            applicantIdealJob: []
        }
    }

    handleChangeTitle = (positionsTags) => {
        this.setState({ positionsTags });
    };

    addIdealJob = () => {
        const positionData = this.state.positionsTags.map(position => {
            return {
                idPosition: position.value,
                description: position.label,
                ApplicationId: this.props.ApplicationId
            }
        });
        this.props.client
            .mutate({
                mutation: ADD_IDEAL_JOB,
                variables: {
                    application: positionData
                }
            })
            .then((data) => {
                this.props.getProfileInformation(this.props.ApplicationId);
                this.props.hanldeCloseTitleModal();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getPositions = () => {
        let myHotels = this.props.myHotels;
        this.props.client
            .query({
                query: GET_POSITION
            })
            .then(({ data }) => {
                let posCatalog = [], newGroup = [];
                let dataAPI = data.catalogitem;
                myHotels.forEach(h => {
                    newGroup = dataAPI.filter(da => da.Id_Entity === h.Id).map(item => {
                                    return { value: item.Id, label: item.Code.trim(), key: item.Id }
                                })
                    posCatalog = [...posCatalog, {label: h.Name, options: newGroup}];
                });

                this.setState(() => {
                    return {positionCatalogTag: posCatalog}
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
                        value={this.state.positionsTags}
                        onChange={this.handleChangeTitle}
                        closeMenuOnSelect={true}
                        components={makeAnimated()}
                        isMulti={true}
                    />
                </DialogContent>     
                <DialogActions>
                    <button className="btn btn-success" type="button" onClick={this.addIdealJob}>Save</button>
                    <button className="btn btn-danger" onClick={this.props.hanldeCloseTitleModal}>Cancel</button>
                </DialogActions>
            </Dialog>
        );
    }

}

export default withStyles(styles)(withApollo(withGlobalContent(Titles)));
