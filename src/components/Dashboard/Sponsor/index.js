import React, { Component } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { GET_WO_BY_REGION, GET_WO_BY_CATEGORY, GET_EMPLOYEES_BY_HOTEL } from './queries';
import withApollo from 'react-apollo/withApollo';

class DashBoardSponsor extends Component {

    INITIAL_STATE = {
        woByRegionData: {},
        woByCategoryData: {},
        empByHotelData: {},
        headcount: 0,
        colors: ["#40B5BC", "#5AC6C6", "#8FD0CA", "#08B6CE", "#74D5DD", "#779ECB", "#87CEEB", "#87CEFF", "#7EC0EE", "#BCF1EC", "#99E1DC", "#8EEDD6", "#5BBFD9"],
        prevColor: ''
    }


    constructor(props){
        super(props);

        this.state = {
            ...this.INITIAL_STATE,
        }
    }

    getRandomColor = _ => {
        let color = this.state.colors[Math.floor(Math.random() * this.state.colors.length)];

        if(color === '' || color === this.state.prevColor)
            color = this.getRandomColor();

        return color;
    }

    fetchEmployeesByHotel = _ => {
        this.props.client.query({
            query: GET_EMPLOYEES_BY_HOTEL,
            fetchPolicy: 'no-cache'
        })
        .then(({data}) => {
            let labels = [];
            let count = 0;

            let datasets = {
                label: "Employees per Hotel",
                data: [],
                backgroundColor: [],
                hoverBackgroundColor: []
            }

            data.employeesByHotel.forEach(item => {
                labels.push(item.name);
                datasets.data.push(item.employeeCount);
                datasets.backgroundColor.push(this.getRandomColor());
                count += item.employeeCount;
            })

            datasets.hoverBackgroundColor = [...datasets.backgroundColor];

            this.setState(_ => ({
                empByHotelData: {
                    labels,
                    datasets: [datasets]
                },

                headcount: count
            }));
        })
        .catch(error => console.log(error));
    }

    fetchWOByRegion = _ => {
        this.props.client.query({
            query: GET_WO_BY_REGION,
            fetchPolicy: 'no-cache'
        })

        .then(({data}) => {
            const woByRegion = data.worKOrdersByRegion.filter(item => item.workOrders_count > 0);
            let labels = []; 

            let datasets = {
                label: "Work Orders Requested Per Region",
                data: [],
                backgroundColor: [],
                hoverBackgroundColor: []
            };

            woByRegion.forEach(item => {
                labels.push(item.name.length > 0 ? item.name : 'Unnamed Region');
                datasets.data.push(item.workOrders_count);
                datasets.backgroundColor.push(this.getRandomColor());                
            });            

            datasets.hoverBackgroundColor = [...datasets.backgroundColor];

            this.setState(_ => ({
                woByRegionData: {
                    labels,
                    datasets: [datasets]
                }
            }));
        })

        .catch(error => console.log(error));
    }

    fetchWOByCategory = _ => {
        this.props.client.query({
            query: GET_WO_BY_CATEGORY,
            fetchPolicy: 'no-cache'
        })

        .then(({data}) => {
            const woByCategory = data.worKOrdersByCategory.filter(item => item.workOrders_count > 0);
            let labels = []; 

            let datasets = {
                label: "Work Orders Requested Per Category",
                data: [],
                backgroundColor: [],
                hoverBackgroundColor: []
            };

            woByCategory.forEach(item => {
                labels.push(item.name.length > 0 ? item.name : 'Unnamed Category');
                datasets.data.push(item.workOrders_count);
                datasets.backgroundColor.push(this.getRandomColor());                
            });            

            datasets.hoverBackgroundColor = [...datasets.backgroundColor];

            this.setState(_ => ({
                woByCategoryData: {
                    labels,
                    datasets: [datasets]
                }
            }));
        })

        .catch(error => console.log(error));
    }

    componentDidMount = _ => {
        this.fetchEmployeesByHotel();
        this.fetchWOByRegion();
        this.fetchWOByCategory();
    }

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

    regionData = {
        labels: ['North', 'South', 'East', 'West'],
        datasets: [
            {
                label: 'Demand for region',
                data: [300, 50, 100, 254],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#F35A50'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#F35A50']
            }
        ]        
    }

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
                <div className="row position-relative">
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
                    <div className="StatBox headCount">
                        <div className="StatBox-header">Headcount</div>
                        <div className="StatBox-amount">{this.state.headcount}</div>
                    </div>
                    <div className="FloatingChart">
                        <Doughnut
                            data={this.state.empByHotelData}
                            width={300}
                            height={300}
                            options={{
                                maintainAspectRatio: false,
                                legend: {
                                    display: false,
                                },
                                cutoutPercentage: 70
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
                                    data={this.state.woByCategoryData}
                                    width={200}
                                    height={200}
                                    options={{
                                        maintainAspectRatio: false,
                                        cutoutPercentage: 70
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
                                    data={this.state.woByRegionData}
                                    width={200}
                                    height={200}
                                    options={{
                                        maintainAspectRatio: false,
                                        cutoutPercentage: 70
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
                                maintainAspectRatio: false,
                                cutoutPercentage: 70
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

}

export default withApollo(DashBoardSponsor);