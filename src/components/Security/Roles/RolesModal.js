import React, { Component, Fragment } from 'react';
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Dialog from "@material-ui/core/Dialog/Dialog";
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
    overflowVisible:{
        overflow: 'visible'
    }
});

class RolesModal extends Component {
    state = {
        isEdition: false,
        rolId: 0,
        companySelected: null,
        formSelected: null,
        description: null
    }

    handleChangeCompany = (company) => {
        this.setState({
            companySelected: company
        });
    }

    handleChangeForm = (form) => {
        this.setState({
            formSelected: form
        });
    }

    handleChangeDescription = (e) => {
        this.setState({
            description: e.currentTarget.value
        });
    }

    handleSave = () => {
        const {rolId ,isEdition,companySelected, formSelected, description} = this.state;
        let data = {
            isEdition,
            Date_Updated: new Date().toISOString()
        };

        if(rolId) data = {...data, Id: rolId};
        if(companySelected) data = {...data, Id_Company: companySelected.value};
        if(formSelected) data = {...data, default_form_id: formSelected.value};
        if(description) data = {...data, Description: description};
        if(!isEdition) data = {
            ...data,
            IsActive: 1,
            User_Created: 1,
            User_Updated: 1,
            Date_Created: new Date().toISOString()
        }
        this.props.handleSaveRol({
            ...data
        });
    }

    componentWillReceiveProps(nextProps) {
        const rol = nextProps.rol;
        console.log('Mostrando contenido de rol',rol); // TODO: (LF) Quitar console log
        if(!this.props.open){
            if(rol){
                this.setState({
                    isEdition: rol.Id > 0, // si es cero no puede ser editable
                    rolId: rol.Id,
                    companySelected: nextProps.companies.find(c => c.value === rol.Id_Company),
                    formSelected: nextProps.forms.find(f => f.value === rol.default_form_id),
                    description: rol.Description
                });
            }
            else{
                this.setState({
                    isEdition: false,
                    rolId: 0,
                    companySelected: null,
                    formSelected: null,
                    description: null
                });
            }
        }
    }

    render() {
        let {classes} = this.props;
        return <Fragment>
            <Dialog maxWidth="sm" open={this.props.open} onClose={this.props.handleClose} classes={{paperScrollPaper: classes.overflowVisible }}>
                <DialogTitle style={{ padding: '0px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">{this.props.title}</h5>
                    </div>
                </DialogTitle>
                <DialogContent className={classes.overflowVisible} style={{ backgroundColor: "#f5f5f5" }}>
                    <div className="card">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6">
                                    <Select
                                        placeholder="Company"
                                        options={this.props.companies}
                                        value={this.state.companySelected}
                                        onChange={this.handleChangeCompany}
                                        closeMenuOnSelect
                                        //components={makeAnimated()}
                                    />                      
                                </div>

                                <div className="col-md-6">
                                    <Select
                                        placeholder="Default Screen"
                                        options={this.props.forms}
                                        value={this.state.formSelected}
                                        onChange={this.handleChangeForm}
                                        closeMenuOnSelect
                                        //components={makeAnimated()}
                                    />                      
                                </div>

                                <div className="col-md-12 mt-3">
                                    <textarea
                                        onChange={this.handleChangeDescription}
                                        name="description"
                                        className="form-control"
                                        id="description"
                                        cols="30"
                                        rows="3"
                                        value={this.state.description}
                                        placeholder="Description"
                                    />
                                </div>
                            </div>

                            <div className="row pl-0 pr-0 text-right">
                                <div className="col-md-12">
                                    <button
                                        className="btn btn-danger ml-1"
                                        type="button"
                                        onClick={ this.props.handleClose }
                                    >
                                        Close<i class="fas fa-ban ml-2" />
                                    </button>

                                    <button className="btn btn-success ml-2" type="button" onClick={this.handleSave} disabled={this.props.saving}>
                                        Save 
                                        {!this.props.saving 
                                            ? <i className="fas fa-save ml-2" />
                                            : <i className="fas fa-spinner fa-spin  ml-2" /> 
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Fragment>
    }
}

export default withStyles(styles)(RolesModal);