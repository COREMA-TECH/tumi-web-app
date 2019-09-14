import React, { Component, Fragment } from 'react';
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Dialog from "@material-ui/core/Dialog/Dialog";
import Select from 'react-select';

class RolesModal extends Component {
    state = {
        isEdition: false,
        rolId: 0,
        companySelected: null,
        formSelected: null,
        regionSelected: [],
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

    handleChangeRegion = (region) => {
        this.setState({
            regionSelected: region
        });
    }

    handleChangeDescription = (e) => {
        this.setState({
            description: e.currentTarget.value
        });
    }

    handleSave = () => {
        const {isEdition,companySelected, formSelected, regionSelected, description} = this.state;
        let data = {
            isEdition,
            Id: this.state.rolId || 0,
            Date_Updated: new Date().toISOString()
        };

        if(companySelected) data = {...data, Id_Company: companySelected.value};
        if(formSelected) data = {...data, default_form_id: formSelected.value};
        if(regionSelected) data = {...data, regionsId: regionSelected.map(r => r.value)};
        if(description) data = {...data, Description: description};
        if(!isEdition) data = {
            ...data,
            IsActive: 1,
            User_Created: 1,
            User_Updated: 1,
            Date_Created: new Date().toISOString()
        }
        this.props.handleSaveRol({
            ...data,
            isEdition: isEdition
        });
    }

    componentWillReceiveProps(nextProps) {
        const rol = nextProps.rol;
        if(rol){
            this.setState({
                isEdition: true,
                rolId: rol.Id,
                companySelected: nextProps.companies.find(c => c.value === rol.Id_Company),
                formSelected: nextProps.forms.find(f => f.value === rol.default_form_id),
                regionSelected: nextProps.regions.filter(r => rol.regionsId.includes(r.value)),
                description: rol.Description
            });
        }
        else{
            this.setState({
                isEdition: false,
                rolId: 0,
                companySelected: null,
                formSelected: null,
                regionSelected: [],
                description: null
            });
        }
    }

    render() {
        return <Fragment>
            <Dialog maxWidth="sm" open={this.props.open} onClose={this.props.handleClose}>
                <DialogTitle style={{ padding: '0px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">{this.props.title}</h5>
                    </div>
                </DialogTitle>
                <DialogContent style={{ backgroundColor: "#f5f5f5" }}>
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

                                <div className="col-md-12 my-3">
                                    <Select
                                        placeholder="Regions"
                                        options={this.props.regions}
                                        value={this.state.regionSelected}
                                        onChange={this.handleChangeRegion}
                                        isMulti={true}
                                        closeMenuOnSelect
                                        //components={makeAnimated()}
                                    />
                                </div>

                                <div className="col-md-12">
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

                                    <button className="btn btn-success ml-2" type="button" onClick={this.handleSave}>
                                        Save {!this.state.saving && <i className="fas fa-save ml2" />}
                                        {this.state.saving && <i className="fas fa-spinner fa-spin  ml2" />}
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

export default RolesModal;