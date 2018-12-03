import React, { Component } from 'react';
import { GenericDialog } from './Dialog';
import { ImageSelection } from './ImageSelection';

class ProfilePicture extends Component {
    state = {
        open: false,
        url: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png'
    }
    onClickPicture = () => {
        this.setState({ open: true });
    }
    handleClose = () => {
        this.setState({ open: false });
    };
    updateImage = (url) => {
        this.setState({ url, open: false }, () => this.props.updateImage(url))
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.url)
            this.setState({ url: nextProps.url })
    }
    render() {
        return <div className="applicant-card__header header-profile-menu">
            <img className="avatar-profile" style={{ cursor: 'pointer' }} onClick={this.onClickPicture} src={this.state.url} />
            <GenericDialog
                open={this.state.open}
                handleClose={this.handleClose}
                title="Please select an option" >
                <ImageSelection
                    returnImage={this.updateImage}
                    handleOpenSnackbar={this.props.handleOpenSnackbar} />
            </GenericDialog>
        </div>
    }
}

export { ProfilePicture };