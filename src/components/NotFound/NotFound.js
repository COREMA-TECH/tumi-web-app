import React, {Component} from 'react';
import './index.css';


class NotFound extends Component {
    render() {
        return (
            <div className="not-found-container">
                <img
                    className="not-found-image"
                    width="150"
                    height="150"
                    src="http://icons.iconarchive.com/icons/iconsmind/outline/256/Error-404Window-icon.png" alt=""
                />
                <h1 className="not-found-text">Not Found!</h1>
            </div>
        );
    }
}

NotFound.propTypes = {};

export default NotFound;