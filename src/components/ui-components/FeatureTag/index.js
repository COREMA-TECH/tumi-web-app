import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";

class FeatureTag extends Component {
    render() {
        let { showChild, children } = this.props;
        return <Fragment> {showChild && children} </Fragment>
    }
};

const mapStateToProps = (state, props) => {
    return {
        showChild: state.permissionsReducer.permissions.some(f => f.code === props.code)
    }
}

export default connect(mapStateToProps)(FeatureTag);