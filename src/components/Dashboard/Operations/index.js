import React, {Component, Fragment} from 'react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { GET_ACTIVE_HOTELS, GET_ACTIVE_EMPLOYEES, GET_WO_BY_REGION, GET_WO_BY_CATEGORY } from './Queries';
import withApollo from 'react-apollo/withApollo';
import {labels} from './Language';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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
            height: '20px',
            backgroundColor: '#B4E6E7'
        };
        return <Fragment>
            <div className="w-100">
                <h5>
                    <span className="text-warning">{sumValues}</span> &nbsp;
                    <span className="text-success">{labels.TOTAL_APPLICANTS[LANG]}</span>
                </h5>
            </div>
            <div className="row align-items-end">
                {
                    applicants.map(a => {
                        percWidth = (a.value / maxValue) * 100;
                        return (
                            <Fragment>
                                <div className="col-9 mt-2">
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
            let totalWorkOrders = 0;

            let datasets = {
                label: "Work Orders Requested Per Region",
                data: [],
                backgroundColor: [],
                hoverBackgroundColor: []
            };

            woByRegion.forEach((item, i) => {
                labels.push(item.name.length > 0 ? item.name : 'Unnamed Region');
                totalWorkOrders += item.workOrders_count;
                datasets.data.push(item.workOrders_count);
                datasets.backgroundColor.push(this.getColor(i));
            });

            datasets.hoverBackgroundColor = [...datasets.backgroundColor];

            this.setState(_ => ({
                requestPerRegion: {
                    labels,
                    totalWorkOrders,
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
            let totalWorkOrders = 0;

            let datasets = {
                label: "Work Orders Requested Per Category",
                data: [],
                backgroundColor: [],
                hoverBackgroundColor: []
            };

            woByCategory.forEach((item, i) => {
                labels.push(item.name.length > 0 ? item.name : 'Unnamed Category');
                totalWorkOrders += item.workOrders_count;
                datasets.data.push(item.workOrders_count);
                datasets.backgroundColor.push(this.getColor(i));                
            });            

            datasets.hoverBackgroundColor = [...datasets.backgroundColor];

            this.setState(_ => ({
                requestPerCategory: {
                    labels,
                    totalWorkOrders,
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
        const { hotel, activeEmployees, requestPerRegion, requestPerCategory } = this.state;
        return <Fragment>
            <div className="row pb-0">
                <div className="col-md-12">
                    <h3 className="text-success">{labels.TUMI_OPS_DASHBOARD[LANG]}</h3>
                </div>
            </div>
            <div className="row">
                <div className="col-md-2 d-flex align-content-stretch flex-wrap">
                    <div className="StatBoxOps" style={{backgroundColor: '#C0ECEF'}}>
                        <div className="StatBoxOps-header">
                            {labels.Hotel[LANG]}
                        </div>
                        <div className="StatBoxOps-body py-0 text-white">
                            <span className="StatBoxOps-amount">{hotel}</span>
                        </div>
                    </div>

                    <div className="StatBoxOps text-white mt-1" style={{backgroundColor: '#FD817F'}}>
                        <div className="StatBoxOps-header">
                            {labels.Active_Employees[LANG]}
                        </div>
                        <div className="StatBoxOps-body py-0">
                            <span className="StatBoxOps-amount">{activeEmployees}</span>
                        </div>
                    </div>

                    <div className="StatBoxOps mt-1" style={{backgroundColor: '#C0ECEF'}}>
                        <div className="StatBoxOps-header">
                            {labels.Active_Schedule[LANG]}
                        </div>
                        <div className="StatBoxOps-body py-0 text-white">
                            <span className="StatBoxOps-amount">90</span>
                        </div>
                    </div>

                    {/* <div className="row d-flex align-items-stretch h-100">
                        <div className="col-12">
                        </div>

                        <div className="col-12">
                        </div>

                        <div className="col-12">
                        </div>
                    </div> */}
                </div>
                <div className="col-md-8 d-flex flex-column">
                    <div className="d-flex justify-content-between flex-fill">
                        <div className="StatBoxOps mr-2">
                            <div className="StatBoxOps-header">
                                {labels.Open_Positions[LANG]}
                            </div>
                            <div className="StatBoxOps-body">
                                <span className="StatBoxOps-amount">90</span>
                            </div>
                        </div>

                        <div className="StatBoxOps mr-2">
                            <div className="StatBoxOps-header">
                                {labels.Total_Leads_Created[LANG]}
                            </div>
                            <div className="StatBoxOps-body">
                                <span className="StatBoxOps-amount">125</span>
                                <span className="StatBoxOps-increase">-2.4%</span>
                                <span className="StatBoxOps-caption">vs previous month</span>
                            </div>
                        </div>

                        <div className="StatBoxOps">
                            <div className="StatBoxOps-header">
                                {labels.Total_Sent_to_Office[LANG]}
                            </div>
                            <div className="StatBoxOps-body">
                                <span className="StatBoxOps-amount">20</span>
                                <span className="StatBoxOps-increase">-2.4%</span>
                                <span className="StatBoxOps-caption">vs previous month</span>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between flex-fill">
                        <div className="StatBoxOps mr-2">
                            <div className="StatBoxOps-header">
                                {labels.Candidates[LANG]}
                            </div>
                            <div className="StatBoxOps-body">
                                <span className="StatBoxOps-amount">546</span>
                            </div>
                        </div>

                        <div className="StatBoxOps mr-2">
                            <div className="StatBoxOps-header">
                                {labels.New_Requests[LANG]}
                            </div>
                            <div className="StatBoxOps-body">
                                <span className="StatBoxOps-amount">42</span>
                                <span className="StatBoxOps-increase">0.0%</span>
                                <span className="StatBoxOps-caption">vs previous month</span>
                            </div>
                        </div>

                        <div className="StatBoxOps">
                            <div className="StatBoxOps-header">
                                {labels.Total_Closed[LANG]}
                            </div>
                            <div className="StatBoxOps-body">
                                <span className="StatBoxOps-amount">15</span>
                                <span className="StatBoxOps-increase">0.8%</span>
                                <span className="StatBoxOps-caption">vs previous month</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="row p-0">
                        <div className="col-md-8 z_index_10">
                            <div className="StatBoxOps centerTotalShiftGraph">
                                <div className="StatBoxOps-header">{labels.Total_Shifts[LANG]}</div>
                                <div className="StatBoxOps-amount">100</div>
                                <div className="StatBoxOps-increase">-2.4%</div>
                                <div className="StatBoxOps-caption">vs previous month</div>
                            </div>
                            <div className="TotalShiftsChart">
                                <Doughnut
                                    data={this.state.totalShifts}
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
                        </div>
                        <div className="col-md-4 d-none d-md-flex align-content-stretch flex-wrap">
                            <div className="StatBoxOps">
                                <div className="StatBoxOps-header py-2"></div>
                                <div className="StatBoxOps-body"></div>
                            </div>
                            <div className="StatBoxOps">
                                <div className="StatBoxOps-header py-2"></div>
                                <div className="StatBoxOps-body"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row p-0">
                <div className="col-md-4 d-flex align-items-stretch flex-wrap">
                    <div className="card shadow w-100">
                        <div className="card-header">{labels.Candidates[LANG]}</div>
                        <div className="card-body p-0">
                            <div className="CandidatesGraph-container">
                                <Bar data={this.state.candidates} 
                                    options={ {maintainAspectRatio: false}} 
                                    //width={260} 
                                    //height={130} 
                                    /> 
                            </div>
                        </div>
                    </div>

                    <div className="card shadow w-100">
                        <div className="card-body p-0">
                            <div className="Requisition-container table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr className="bg-secondary text-white">
                                            <th>{labels.Requisition[LANG]}</th>
                                            <th>{labels.Submit_Date[LANG]}</th>
                                            <th>{labels.Status[LANG]}</th>
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
                    </div>
                    
                    <div className="w-100 d-flex justify-content-end">
                        <span className="mr-1">{ `${labels.Results[LANG]} (${10})` }</span>
                        <a href="#">{ `${labels.View_All[LANG]}` }</a>
                    </div>
                </div>

                <div className="col-md-4 d-flex align-content-stretch">
                    <div className="card shadow w-100">
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

                <div className="col-md-4">
                    <div className="card shadow">
                        <div className="card-header">
                            <span className="WO-header"><i className="fas fa-sitemap"></i> {labels.WO_Requests_per_Region[LANG]}</span>
                        </div>
                        <div className="card-body">
                            <div className="StatBoxOps centerRequestGraph">
                                <div className="StatBoxOps-amount">{requestPerRegion ? requestPerRegion.totalWorkOrders : 0}</div>
                            </div>
                            <Doughnut
                                data={requestPerRegion}
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

                    <div className="card shadow">
                        <div className="card-header">
                            <span className="WO-header"><i className="fas fa-layer-group"></i> {labels.WO_Requests_per_Category[LANG]}</span> 
                        </div>
                        <div className="card-body">
                            <div className="StatBoxOps centerRequestGraph">
                                <div className="StatBoxOps-amount">{requestPerCategory ? requestPerCategory.totalWorkOrders : 0}</div>
                            </div>
                            <Doughnut
                                data={requestPerCategory}
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
        </Fragment>
    }
};

export default withApollo(OperationsDashboard);