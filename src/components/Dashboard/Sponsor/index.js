import React, { Component } from 'react';

class DashBoardSponsor extends Component {

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-5">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="StatBox">
                                    <div className="StatBox-header">
                                        Total Wages Pald
                                    </div>
                                    <div className="StatBox-body">
                                        <span className="StatBox-amount">$210,777</span>
                                        <span className="StatBox-increase">-2.4%</span>
                                        <span className="StatBox-caption">vs previous month</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="StatBox">
                                    <div className="StatBox-header">
                                        Workers Comp
                                    </div>
                                    <div className="StatBox-body">
                                        <span className="StatBox-amount">$15,777</span>
                                        <span className="StatBox-increase">-2.4%</span>
                                        <span className="StatBox-caption">vs previous month</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="StatBox">
                            <div className="StatBox-header">
                                Turnover Rate
                            </div>
                            <div className="StatBox-body">
                                <span className="StatBox-amount">1.1%</span>
                                <span className="StatBox-increase">-2.4%</span>
                                <span className="StatBox-caption">vs previous month</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="StatBox">
                            <div className="StatBox-header">
                                Overtime Payment
                            </div>
                            <div className="StatBox-body">
                                <span className="StatBox-amount">$21,355</span>
                                <span className="StatBox-increase">20.8%</span>
                                <span className="StatBox-caption">vs previous month</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default DashBoardSponsor;