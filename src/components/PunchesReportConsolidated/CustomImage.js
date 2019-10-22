import React from 'react';

const DEFAULT_IMAGE = "/images/placeholder.png";

export default class CustomImage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            image: props.image
        }
    }

    componentWillReceiveProps(nextProps) {
        // console.log({ nextImage: nextProps.image, image: this.props.image })
        if (nextProps.image != this.props.image)
            this.setState(() => ({ image: nextProps.image }));
    }

    onError = () => {
        this.setState(() => ({ image: DEFAULT_IMAGE }));
    }

    render() {
        return <img src={this.state.image} onError={this.onError} className={this.props.className} onClick={this.props.onClick} />
    }
}