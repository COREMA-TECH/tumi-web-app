import React, {Component} from 'react';
import Nav from "../Nav/Main/Nav";
import MainContainer from "../MainContainer/Main/MainContainer";

class Private extends Component {
    constructor(props) {
        super(props);

        alert("Component");
    }

    render() {
        return (
            <div className="main">
                <Nav/>
                <MainContainer/>
            </div>
        );
    }
}

export default Private;


