import React, { Component } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';

class DashBoardSponsor extends Component {

    data = {
        labels: ['Banquet', 'Housemen', 'Cook'],
        datasets: [
            {
                label: 'Demand for positions',
                data: [300, 50, 100],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }
        ]
    };

    floatingData = {
        labels: ['Banquet', 'Housemen', 'Cook'],
        datasets: [
            {
                label: 'Demand for positions',
                data: [300, 50, 100],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }
        ]
    };

    render() {
        return (
            <div className="container Stats">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-5">
                        <div className="row">
                            <div className="col-md-6 mb-1">
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
                            <div className="col-md-6 mb-1">
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
                    <div className="FloatingChart">
                        <Doughnut
                            data={this.data}
                            width={300}
                            height={300}
                            options={{
                                maintainAspectRatio: false,
                                legend: {
                                    display: false,
                                },
                            }}
                        />
                    </div>
                    <div className="col-lg-12 col-md-12 offset-xl-2 col-xl-5">
                        <div className="row">
                            <div className="col-md-6 mb-1">
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
                            <div className="col-md-6 mb-1">
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
                            <div className="col-md-6">
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
                            <div className="col-md-6">
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
                </div>
                <div className="row">
                    <div className="col-md-5">
                        <div className="StatBox mb-1">
                            <div className="StatBox-header">
                                Work Order Requested Per Category
                            </div>
                            <div className="StatBox-body">
                                <Doughnut
                                    data={this.data}
                                    width={200}
                                    height={200}
                                    options={{
                                        maintainAspectRatio: false
                                    }}
                                />
                            </div>
                        </div>
                        <div className="StatBox">
                            <div className="StatBox-header">
                                Work Order Requested Per Region
                            </div>
                            <div className="StatBox-body">
                                <Doughnut
                                    data={this.data}
                                    width={200}
                                    height={200}
                                    options={{
                                        maintainAspectRatio: false
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <Line
                            data={this.data}
                            width={200}
                            height={400}
                            options={{
                                maintainAspectRatio: false
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

}

export default DashBoardSponsor;