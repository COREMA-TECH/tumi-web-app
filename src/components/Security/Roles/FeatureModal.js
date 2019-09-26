import React, { Component, Fragment } from 'react';
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Dialog from "@material-ui/core/Dialog/Dialog";
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import {withApollo} from 'react-apollo';
import {GET_FEATURES} from './Queries';
import {ADD_FEATURE, DELETE_FEATURE} from './Mutations';
import withGlobalContent from 'Generic/Global';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableFooter from '@material-ui/core/TableFooter/TableFooter';
import TablePagination from '@material-ui/core/TablePagination/TablePagination';
import TableCell from '@material-ui/core/TableCell';

const allFeatures = require('../../ui-components/FeatureTag/Management');

const styles = () => ({
    overflowVisible:{
        overflow: 'visible'
    }
});

const CustomTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

class FeatureModal extends Component {
    state = {
        rolId: 0,
        rolName: '',
        featureCodes: [],
        loadingFeatureCodes: false,
        filterText: ''
    }

    getFeatures = () => {
        this.setState({
            loadingFeatureCodes: true
        }, () => {
            let {rolId} = this.state;
            this.props.client
                .query({
                    query: GET_FEATURES,
                    variables: {RoleId: rolId},
                    fetchPolicy: 'no-cache'
                })
                .then(({data}) => {
                    if (data.features != null) {
                        this.setState({
                            featureCodes: data.features.map(d => d.code)
                        });
                    } else {
                        this.props.handleOpenSnackbar('error', 'Error: Loading features');
                    }
                    this.setState({loadingFeatureCodes: false});
                })
                .catch((error) => {
                    this.props.handleOpenSnackbar('error', 'Error: Loading features: ' + error);
                    this.setState({loadingFeatureCodes: false});
                });
        })
    };

    addOrDeleteFeature = (isAdd, code) => {
        const {rolId} = this.state;
        let variables;
        if(isAdd){
            variables = {
                features: [{
                    RoleId: rolId,
                    code
                }]
            }
        }
        else{
            variables = {
                RoleId: rolId,
                code
            }
        }
        this.props.client
            .mutate({
                mutation: isAdd ? ADD_FEATURE : DELETE_FEATURE,
                variables
            })
            .then((data) => {
                this.getFeatures();
            })
            .catch((error) => {
                this.props.handleOpenSnackbar(
                    'error',
                    !isAdd ? 'Error: Delete Feature: ' + error : 'Error: Inserting Feature: ' + error
                );
                this.getFeatures();
            });
    }

    handleFeatureComponent = (isChecked, code) => {
        if(isChecked){
            return <span
                className="badge badge-success p-2 hover-hand float-left"
                onClick={() => this.addOrDeleteFeature(!isChecked, code)}
                >
                    Visible
                </span>
        }
        else{
            return <span
                className="badge badge-danger p-2 hover-hand float-left"
                onClick={() => this.addOrDeleteFeature(!isChecked, code)}
                >
                    Hidden
                </span> 
        }
    }

    componentWillReceiveProps(nextProps) {
        const rol = nextProps.rol;
        if(!this.props.open){
            if(rol){
                this.setState({
                    rolId: rol.Id,
                    rolName: rol.Name
                }, this.getFeatures());
            }
            else{
                this.setState({
                    rolId: 0,
                    rolName: ''
                });
            }
        }
    }

    render() {
        const {classes} = this.props;
        const { featureCodes, loadingFeatureCodes, filterText } = this.state;
        let features = allFeatures;

        if(filterText){
            const text = filterText.toLowerCase();
            features = allFeatures.filter(f => f.description.toLowerCase().indexOf(text) > -1)
        }
        //const features = filterText ? allFeatures.filter(f => f.toLowerCase().indexOf(filterText))

        return <Fragment>
            <Dialog maxWidth="md" open={this.props.open} onClose={this.props.handleClose} >
                <DialogTitle style={{ padding: '0px' }}>
                    <div className="modal-header">
                        <div className="row">
                            <div className="col-md-12">
                                <h5 className="modal-title">{this.props.title}</h5>
                            </div>
                            <div className="col-md-12 mt-3">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">
                                            <i className="fa fa-search icon" />
                                        </span>
                                    </div>
                                    <input
                                        onChange={(text) => {
                                            this.setState({
                                                filterText: text.target.value
                                            });
                                        }}
                                        value={this.state.filterText}
                                        type="text"
                                        placeholder="Feature Search"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="tumi-forcedResponsiveTable">
                                <Table className={classes.table}>
                                    <TableHead>
                                        <TableRow>
                                            <CustomTableCell className={"Table-head"} style={{ width: '100px' }}>View</CustomTableCell>
                                            <CustomTableCell className={"Table-head"} style={{ width: '600px' }}>Feature</CustomTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {features.map((row, i) => {
                                            return (
                                                <TableRow
                                                    hover
                                                    className={classes.row}
                                                    key={i}
                                                    //onClick={() => this.props.onEditHandler(row.Id)}
                                                >
                                                    <CustomTableCell className={'text-center'} style={{ width: '60px' }}>
                                                        {
                                                            loadingFeatureCodes
                                                            ? <i className="fas fa-spinner fa-spin" />
                                                            : this.handleFeatureComponent(featureCodes.includes(row.code), row.code)
                                                        }
                                                    </CustomTableCell>
                                                    <CustomTableCell>{row.description}</CustomTableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <button
                        className="btn btn-danger m-3"
                        type="button"
                        onClick={ this.props.handleClose }
                    >
                        Close<i class="fas fa-ban ml-2" />
                    </button>
                </DialogActions>
            </Dialog>
        </Fragment>
    }
}

export default withStyles(styles)(withApollo(withGlobalContent(FeatureModal)));