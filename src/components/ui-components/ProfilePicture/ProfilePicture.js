import React, { Component } from 'react';
import { GenericDialog } from './Dialog';
import { ImageSelection } from './ImageSelection';

class ProfilePicture extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLDHGbmeO_n4BngHukOBOaSZ-ojh1V6iVq1WsUCUuDZKCHs3iZ'
        }
    }

    onClickPicture = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };
    updateImage = (url) => {
        this.setState({ url, open: false }, () => this.props.updateImage(url))
    };

    componentWillMount() {
        if (this.props.url) {
            this.setState({
                url: this.props.url
            })
        }
    }


    render() {
        return <div className="">
            <div className="avatar-profile" onClick={this.onClickPicture}>
                <img className="" style={{ cursor: 'pointer' }} src={this.state.url} />
            </div>

            <GenericDialog
                open={this.state.open}
                handleClose={this.handleClose}
                title="Please select an option"
                fullScreen={this.props.fullScreen}
                maxWidth={this.props.maxWidth} >
                <ImageSelection
                    returnImage={this.updateImage}
                    handleOpenSnackbar={this.props.handleOpenSnackbar} />
            </GenericDialog>
        </div>
    }
}

export { ProfilePicture };