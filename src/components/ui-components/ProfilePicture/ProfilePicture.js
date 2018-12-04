import React, { Component } from 'react';
import { GenericDialog } from './Dialog';
import { ImageSelection } from './ImageSelection';

class ProfilePicture extends Component {


    constructor(props) {
        super(props)
        this.state = {
            open: false,
            url: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png'
        }
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
        console.log("estoy en el component ", nextProps)
    }


    render() {
        return <div className="">
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