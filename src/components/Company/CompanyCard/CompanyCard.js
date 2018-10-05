import React from 'react';
import './index.css';
import { Route } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import gql from 'graphql-tag';
import AlertDialogSlide from 'Generic/AlertDialogSlide';
class CompanyCard extends React.Component {
    state = {
        open: false
    };
    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };
    handleConfirm = () => {
        this.setState({ open: false });
    };



    render() {
        const deleteCompany = gql`
			mutation DeleteCompany($Id: Int!, $IsActive: Int!) {
				delcompanies(Id: $Id, IsActive: $IsActive) {
					Code
					Name
				}
			}
		`;

        return (
            <Route
                render={({ history }) => (
                    <div className="card">

                        <AlertDialogSlide
                            handleClose={this.handleClose}
                            handleConfirm={this.handleConfirm}
                            open={this.state.open}
                            loadingConfirm={this.state.loadingRemoving}
                            content="Do you really want to continue whit this operation?"
                        />

                        <div className="card__body">
                            <img src={this.props.imageUrl} className="card-image" />

                            <div className="card-description">
                                <p className="company-code">{this.props.code}</p>
                                <p className="company-title">{this.props.title}</p>
                                <p className="company-description">{this.props.description}</p>
                                <p className="company-address">{this.props.address}</p>
                            </div>
                        </div>
                        <div className="card__footer">
                            <Button
                                disabled={true}
                                variant="contained"
                                color="primary"
                                className="card__button"
                                onClick={() => {
                                    history.push({
                                        pathname: '/company/edit',
                                        state: { idCompany: this.props.idCompany, idContract: this.props.idContract }
                                    });
                                }}
                            >
                                Edit
                                <EditIcon />
                            </Button>
                            <Button
                                disabled={true}
                                variant="contained"
                                color="secondary"
                                className="card__button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    this.handleClickOpen
                                }}
                            >
                                Delete
                                <DeleteIcon>send</DeleteIcon>
                            </Button>
                        </div>
                    </ div>
                )}
            />
        );
    }
}

export default CompanyCard;
