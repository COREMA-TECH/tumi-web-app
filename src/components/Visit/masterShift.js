import React, {Component, Fragment } from 'react';
import Select from 'react-select';
import Timer from './timer';
import { OP_MANAGER_ROL_ID } from './constants';

import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import {withApollo} from 'react-apollo';
import { CREATE_VISIT_QUERY, UPDATE_VISIT_QUERY } from './mutations';
import withGlobalContent from "../Generic/Global";


const styles = (theme) => ({
    timerBox: {
        backgroundColor: grey[300]
    }
});

class MasterShift extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            visitId: 0,
            userId: 0,
            rolId: 0,
            propertiesOpt: [],
            businessCompanyId: 0,
            runTimer: false,
            comment: '',
            file: {},
            showStartButton: true,
            showFinalizeButton: false,
            startTime: null,
            endTime: null,
            latitude: '',
            longitude: '',
            srcIframe: ''
        }

    }

    createVisit = () => {
        let { userId, businessCompanyId, startTime, file, comment, latitude, longitude } = this.state;
        this.props.client.mutate({
            mutation: CREATE_VISIT_QUERY,
            variables: {
                visits: {
                    OpManagerId: userId,
                    BusinessCompanyId: businessCompanyId,
                    startTime: startTime,
                    endTime: startTime, // no null
                    url: '',
                    comment: comment,
                    startLatitude: latitude,
                    startLongitude: longitude
                }
            }
        })
        .then(({data}) => {
            console.log(data);
            this.setState(() => {
                return { visitId: data.addVisit[0].id }
            });

            this.props.handleOpenSnackbar(
                'success',
                'Successfully created',
                'bottom',
                'right'
            );
        })
        .catch(() => {
            this.props.handleOpenSnackbar(
                'error',
                'Error to save visit',
                'bottom',
                'right'
            );
        })
    }
    

    handleSubmit = (e) => {
        e.preventDefault();
    }

    handleSelectHotelChange = (e) => {
        console.log(e);
        this.setState(() => {
            return { businessCompanyId: e.value}
        })
    }

    handleStartButton = () => {
        if(this.state.rolId !== OP_MANAGER_ROL_ID){
            if (navigator.geolocation) {
                setTimeout(() => {
                    navigator.geolocation.getCurrentPosition((position) => { // success callback
                        this.setState(() => {
                            return {
                                runTimer: true,
                                showStartButton: false,
                                showFinalizeButton: true,
                                startTime: moment(new Date()).local().format("HH:mm:ss"),
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                srcIframe: `http://maps.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}&hl=es;z=14&amp;output=embed`
                            }
                        }, () => this.createVisit())
                    }, () => { // error callback
                        this.setState(() =>  {
                            return { 
                                runTimer: true,
                                showStartButton: false,
                                showFinalizeButton: true,
                                startTime: moment(new Date()).local().format("HH:mm:ss")
                            }
                        }, () => this.createVisit())
                    })

                },3000)
            }
            else{
                this.setState(() =>  {
                    return { 
                        runTimer: true,
                        showStartButton: false,
                        showFinalizeButton: true,
                        startTime: moment(new Date()).local().format("HH:mm:ss")
                    }
                }, () => this.createVisit())
            }

            // this.setState(() =>  {
            //     return { 
            //         runTimer: true,
            //         showStartButton: false,
            //         showFinalizeButton: true,
            //         startTime: moment(new Date()).local().format("HH:mm:ss")
            //     }
            // }, () => {
            //     if (navigator.geolocation) {
            //         setTimeout(() => {
            //             navigator.geolocation.getCurrentPosition((position) => {
            //                 this.setState(() => {
            //                     return {
            //                         latitude: position.coords.latitude,
            //                         longitude: position.coords.longitude,
            //                         srcIframe: `http://maps.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}&hl=es;z=14&amp;output=embed`
            //                     }
            //                 })
            //             })

            //         },3000)
            //     }
            // })

            
        }
        else{
            this.props.handleOpenSnackbar(
                'error',
                'This functionality is exclusive for users with role operation manager',
                'bottom',
                'right'
            );
        }
    }

    handleFinalizeButton = () => {
        this.setState(() => {
            return { 
                runTimer: false,
                showFinalizeButton: false,
                endTime: moment(new Date()).local().format("HH:mm:ss")
            }
        })
    }

    handleComment = (e) => {
        let comment = e.target.value;
        this.setState(() => {
            return { comment: comment }
        })
    }

    handleFileInput = (e) => {
        e.persist();
        this.setState(() => {
            return { file: e.target.files[0] || {} }
        })
    }
    
    componentWillReceiveProps({ propertiesData }){
        
        this.setState(() => {
            let options = [];

            options = propertiesData.map((p) => {
                return { ...p, value: p.Id, label: p.Name };
            });

            options = [{value:0, label: 'Select a Hotel'}, ...options]

            return { propertiesOpt: options }
        })
    }

    componentDidMount(){
        this.setState(() => {
            return {
                userId: localStorage.getItem('LoginId'),
                rolId: localStorage.getItem('IdRoles')
            }
        })
    }

    render() {
        let { open, classes } = this.props;
        let { showStartButton, showFinalizeButton, startTime, endTime, propertiesOpt, srcIframe } = this.state;
        
        return (
            <Fragment>
                <div className={`MasterShiftForm ${open ? 'active' : ''}`}>
                    <header className="MasterShiftForm-header">
                        <div className="row">
                            <div className="col-md-10">
                                <h3 className="MasterShiftForm-title">Operation Manager Visit</h3>
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-link MasterShiftForm-close"
                                    onClick={this.props.handleClose}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </header>

                    <div className="row">
                        <div className="col-12">
                            <form onSubmit={this.preventDefault}>
                                <label htmlFor="">Hotel</label>
                                <Select
                                    name="hotel"
                                    options={propertiesOpt}
                                    onChange={this.handleSelectHotelChange}
                                    placeholder="Select a Hotel"
                                    closeMenuOnSelect
                                />
                                
                                <label htmlFor="">Location</label>
                                <iframe src={srcIframe} allow="geolocation" width="100%" height="180px" />

                                <label htmlFor="">Comment</label>
                                <textarea
                                    name="comment"
                                    cols="60"
                                    rows="3"
                                    className="form-control textarea-apply-form"
                                    onChange={this.handleComment}
                                />

                                <label htmlFor="">Photo</label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroupFileAddon01">Upload</span>
                                    </div>
                                    <div className="custom-file">
                                        <input type="file" className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" onChange={this.handleFileInput} />
                                        <label className="custom-file-label" htmlFor="">Choose file</label>
                                    </div>
                                </div>

                                <div className={`d-flex border border-success mt-3 ${classes.timerBox}`} >
                                    <div className="w-100 d-flex align-items-center justify-content-center">
                                        <Timer run={ this.state.runTimer } />
                                    </div>

                                    <div className="flex-shrink-1 d-flex align-items-stretch justify-content-center flex-column">
                                        <div className="border border-success p-1 w-100">
                                            {
                                                showStartButton
                                                ?
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-primary btn-block"
                                                        onClick={this.handleStartButton}
                                                        >
                                                        Start
                                                    </button>
                                                :
                                                    <p className="text-center px-3">{startTime || '00:00:00'}</p>
                                            }
                                            
                                        </div>

                                        <div className="border border-success p-1 w-100">
                                            {
                                                showFinalizeButton
                                                ?
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-danger btn-block"
                                                        onClick={this.handleFinalizeButton}
                                                        >
                                                        Finalize
                                                    </button>
                                                :
                                                    <p className="text-center px-3">{endTime || '00:00:00'}</p>

                                            }
                                            
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>

                <div className="MasterShiftForm-overlay" onClick={this.props.handleClose}></div>
            </Fragment>
        )
    }
}

export default withStyles(styles)(withGlobalContent(withApollo(MasterShift)));