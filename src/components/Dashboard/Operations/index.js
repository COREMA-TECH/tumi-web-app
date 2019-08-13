import React, {Component, Fragment} from 'react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { GET_ACTIVE_HOTELS, GET_ACTIVE_EMPLOYEES, GET_WO_BY_REGION, GET_WO_BY_CATEGORY } from './Queries';
import withApollo from 'react-apollo/withApollo';
import {labels} from './Language';

const LANG = localStorage.getItem('languageForm') || 'en';
const COLORS = ["#40B5BC", "#FC5A57", "#496A78", "#08B6CE", "#74D5DD", "#779ECB", "#87CEEB", "#87CEFF", "#7EC0EE", "#BCF1EC", "#99E1DC", "#8EEDD6", "#E8BE20"];
const COLORS_LENGTH = COLORS.length;

const DEFAULT_STATE = {
    hotel: 0,
    activeEmployees: 0,
    activeSchedule: 0,
    openPositions: {},
    candidates: {},
    totalLeadsCreated: {},
    newRequests: {},
    totalSentToOffice: {},
    totalClosed: {},
    totalShifts: {},
    candidatesGraph: {},
    totalApplicants: {},
    requestPerRegion: {},
    requestPerCategory: {}
}

class OperationsDashboard extends Component {

    constructor(props){
        super(props);

        this.state = DEFAULT_STATE;
    }

    getColor = item => COLORS[item % COLORS_LENGTH];

    handleHotelData = () => {
        this.props.client.query({
            query: GET_ACTIVE_HOTELS,
            fetchPolicy: 'no-cache'
        })
        .then(({data}) => {
            this.setState(_ => {
                return {hotel: data.businessCompanies.length}
            });
        })
        .catch(error => console.log(error));
    }

    handleActiveEmployeeData = () => {
        this.props.client.query({
            query: GET_ACTIVE_EMPLOYEES,
            fetchPolicy: 'no-cache'
        })
        .then(({data}) => {
            this.setState(_ => {
                return {activeEmployees: data.employees.length}
            });
        })
        .catch(error => console.log(error));
    }

    handleTotalShiftsData = () => {
        this.setState(() => {
            return {
                totalShifts: {
                    labels: ['label1', 'label2'],
                    datasets: [{
                        label: 'label de prueba',
                        data: [30,50],
                        backgroundColor: ['#FC5A57', '#00B5A7'],
                        hoverBackgroundColor: ['#FC5A57', '#00B5A7']
                    }]
                }
            }
        });
    }

    handleCandidatesData = () => {
        this.setState(() => {
            return {
                candidates: {
                    labels: ["January", "February", "March", "April", "May"], 
                    datasets: [{
                        label: labels.Candidates[LANG],
                        type: "line", 
                        borderColor: "#E8BE21", 
                        data: [300,590,40,290,420], 
                        fill: false
                        }, { 
                        label: labels.Candidates[LANG],
                        type: "bar", 
                        backgroundColor: "#B4E6E7", 
                        data: [200,180,700,700,250], 
                        }
                    ]
                }
            }
        });
    }

    printApplicats = (applicants) => {
        let values = applicants.map(a => a.value);
        let sumValues = values.reduce((a,b) => a + b);
        let maxValue = Math.max(...values);
        let percWidth = 0;
        const style = {
            height: '15px',
            backgroundColor: '#B4E6E7'
        };
        return <Fragment>
            <div className="w-100">
                {`${sumValues} ${labels.TOTAL_APPLICANTS[LANG]}`}
            </div>
            <div className="row align-items-end">
                {
                    applicants.map(a => {
                        percWidth = (a.value / maxValue) * 100;
                        return (
                            <Fragment>
                                <div className="col-9">
                                    <div className="w-100">
                                        <p>{a.label}</p>
                                        <div className style={{...style, width: `${percWidth}%`}}></div>
                                    </div>
                                </div>
                                <div className="col-3 justify-content-end">
                                    {a.value}
                                </div>
                            </Fragment>
                        )
                    })
                }
            </div>
        </Fragment>
    }

    handleReqPerRegionData = () => {
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

            woByRegion.forEach((item, i) => {
                labels.push(item.name.length > 0 ? item.name : 'Unnamed Region');
                datasets.data.push(item.workOrders_count);
                datasets.backgroundColor.push(this.getColor(i));
            });

            datasets.hoverBackgroundColor = [...datasets.backgroundColor];

            this.setState(_ => ({
                requestPerRegion: {
                    labels,
                    datasets: [datasets]
                }
            }));
        })
        .catch(error => console.log(error));
    }

    handleReqPerCategoryData = () => {
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

            woByCategory.forEach((item, i) => {
                labels.push(item.name.length > 0 ? item.name : 'Unnamed Category');
                datasets.data.push(item.workOrders_count);
                datasets.backgroundColor.push(this.getColor(i));                
            });            

            datasets.hoverBackgroundColor = [...datasets.backgroundColor];

            this.setState(_ => ({
                requestPerCategory: {
                    labels,
                    datasets: [datasets]
                }
            }));
        })
        .catch(error => console.log(error));
    }
   
    componentWillMount() {
        this.handleHotelData();
        this.handleActiveEmployeeData();
        this.handleTotalShiftsData();
        this.handleCandidatesData();
        this.handleReqPerRegionData();
        this.handleReqPerCategoryData();
    }

    render() {
        const { hotel, activeEmployees } = this.state;
        return <Fragment>
            <div className="row">
                <div className="col-md-12">
                    <h2 className="text-success">{labels.TUMI_OPS_DASHBOARD[LANG]}</h2>
                </div>
            </div>
            <div className="row">
                <div className="col-md-2">
                    <div className="row d-flex align-items-stretch h-100">
                        <div className="col-12">
                            <div className="StatBox" style={{backgroundColor: '#C0ECEF'}}>
                                <div className="StatBox-header">
                                    {labels.Hotel[LANG]}
                                </div>
                                <div className="StatBox-body py-0 text-white">
                                    <span className="StatBox-amount">{hotel}</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="StatBox text-white mt-2" style={{backgroundColor: '#FD817F'}}>
                                <div className="StatBox-header">
                                    {labels.Active_Employees[LANG]}
                                </div>
                                <div className="StatBox-body py-0">
                                    <span className="StatBox-amount">{activeEmployees}</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="StatBox mt-2" style={{backgroundColor: '#C0ECEF'}}>
                                <div className="StatBox-header">
                                    {labels.Active_Schedule[LANG]}
                                </div>
                                <div className="StatBox-body py-0 text-white">
                                    <span className="StatBox-amount">90</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="StatBox h-100">
                                <div className="StatBox-header">
                                    {labels.Open_Positions[LANG]}
                                </div>
                                <div className="StatBox-body">
                                    <span className="StatBox-amount">90</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="StatBox">
                                <div className="StatBox-header">
                                    {labels.Total_Leads_Created[LANG]}
                                </div>
                                <div className="StatBox-body">
                                    <span className="StatBox-amount">125</span>
                                    <span className="StatBox-increase">-2.4%</span>
                                    <span className="StatBox-caption">vs previous month</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="StatBox">
                                <div className="StatBox-header">
                                    {labels.Total_Sent_to_Office[LANG]}
                                </div>
                                <div className="StatBox-body">
                                    <span className="StatBox-amount">20</span>
                                    <span className="StatBox-increase">-2.4%</span>
                                    <span className="StatBox-caption">vs previous month</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-4 mt-2">
                            <div className="StatBox h-100">
                                <div className="StatBox-header">
                                    {labels.Candidates[LANG]}
                                </div>
                                <div className="StatBox-body">
                                    <span className="StatBox-amount">546</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="StatBox">
                                <div className="StatBox-header">
                                    {labels.New_Requests[LANG]}
                                </div>
                                <div className="StatBox-body">
                                    <span className="StatBox-amount">42</span>
                                    <span className="StatBox-increase">0.0%</span>
                                    <span className="StatBox-caption">vs previous month</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="StatBox">
                                <div className="StatBox-header">
                                    {labels.Total_Closed[LANG]}
                                </div>
                                <div className="StatBox-body">
                                    <span className="StatBox-amount">15</span>
                                    <span className="StatBox-increase">0.8%</span>
                                    <span className="StatBox-caption">vs previous month</span>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="col-md-2 h-100">
                    <div className="row p-0 h-100">
                        <div className="col-md-9 z_index_100">
                            <div className="StatBox headCount">
                                <div className="StatBox-header">{labels.Total_Shifts[LANG]}</div>
                                <div className="StatBox-amount">100</div>
                            </div>
                            <div className="TotalShiftsChart">
                                <Doughnut
                                    data={this.state.totalShifts}
                                    width={325}
                                    height={325}
                                    options={{
                                        maintainAspectRatio: false,
                                        legend: {
                                            display: false,
                                        },
                                        cutoutPercentage: 70
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-3 d-sm-none d-md-block">
                            <div className="StatBox h-100">
                                <div className="StatBox-header py-2"></div>
                                <div className="StatBox-body"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-5">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">{labels.Candidates[LANG]}</div>
                            <div className="card-body p-0">
                                <Bar data={this.state.candidates} 
                                    //options={chartOptions} 
                                    width={260} 
                                    height={120} /> 
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <table className="table bg-white">
                            <thead>
                                <tr className="bg-secondary text-white">
                                    <th scope="col">{labels.Requisition[LANG]}</th>
                                    <th scope="col">{labels.Submit_Date[LANG]}</th>
                                    <th scope="col">{labels.Status[LANG]}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="text-success font-weight-bold">Housekeeping</td>
                                    <td>1/12/2018</td>
                                    <td>Hire</td>
                                </tr>
                                <tr>
                                    <td className="text-success font-weight-bold">Banket Server</td>
                                    <td>1/14/2018</td>
                                    <td>New</td>
                                </tr>
                                <tr>
                                    <td className="text-success font-weight-bold">Housekeeping</td>
                                    <td>1/10/2018</td>
                                    <td>New</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-md-3 h-100">
                    <div className="col-md-12">
                        <div className="card h-100 w-100">
                            <div className="card-body">
                                {this.printApplicats([
                                    {
                                        label: 'In Review',
                                        value: 13
                                    },
                                    {
                                        label: 'Interview',
                                        value: 13
                                    },
                                    {
                                        label: 'Closed',
                                        value: 17
                                    },
                                    {
                                        label: 'Hired',
                                        value: 25
                                    }
                                ])}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                {labels.WO_Requests_per_Region[LANG]}
                            </div>
                            <div className="card-body">
                                <Doughnut
                                    data={this.state.requestPerRegion}
                                    width={163}
                                    height={163}
                                    options={{
                                        maintainAspectRatio: false,
                                        legend: {
                                            display: false,
                                        },
                                        cutoutPercentage: 70
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                {labels.WO_Requests_per_Category[LANG]}
                            </div>
                            <div className="card-body">
                                <Doughnut
                                    data={this.state.requestPerCategory}
                                    width={163}
                                    height={163}
                                    options={{
                                        maintainAspectRatio: false,
                                        legend: {
                                            display: false,
                                        },
                                        cutoutPercentage: 70
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    }
};

export default withApollo(OperationsDashboard);