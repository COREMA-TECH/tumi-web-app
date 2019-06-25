import React, {Component, Fragment } from 'react';

class MasterShift extends Component{

    render() {
        let { open } = this.props;
        return (
            <Fragment>
                <div className={`MasterShiftForm ${open ? 'active' : ''}`}>
                    <header className="MasterShiftForm-header">
                        <div className="row">
                            <div className="col-md-10">
                                <h3 className="MasterShiftForm-title">Title</h3>
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-link MasterShiftForm-close"
                                    onClick={this.props.handleClose}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </header>

                    <footer className="MasterShiftForm-footer">
                        
                    </footer>
                </div>

                {/* <div className="MasterShiftForm-overlay" onClick={() => this.props.handleCloseForm(this.resetInputs)}></div> */}
                </Fragment>
        )
    }
}

export default MasterShift;