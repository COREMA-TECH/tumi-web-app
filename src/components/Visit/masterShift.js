import React, {Component, Fragment } from 'react';
import Select from 'react-select';
import Timer from './Timer';
import AWS from 'aws-sdk';
import PropTypes from 'prop-types';

//import { OP_MANAGER_ROL_ID } from './Utilities';

import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import {withApollo} from 'react-apollo';
import { CREATE_VISIT_QUERY, UPDATE_VISIT_QUERY } from './Mutations';
import withGlobalContent from "../Generic/Global";

const OP_MANAGER_ROL_ID = 1; // temporal para prueba

const uuidv4 = require('uuid/v4');
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
            file: null,
            fileName: null,
            urlFile: '',
            showStartButton: true,
            showFinalizeButton: false,
            startTime: null,
            endTime: null,
            latitude: '',
            longitude: '',
            srcIframe: '',
            formDisabled: false,
            disableFinalizeButton: false
        }

    }

    createVisit = () => {
        let { userId, businessCompanyId, startTime, urlFile, comment, latitude, longitude } = this.state;
        this.props.client.mutate({
            mutation: CREATE_VISIT_QUERY,
            variables: {
                visits: {
                    OpManagerId: userId,
                    BusinessCompanyId: businessCompanyId,
                    startTime: startTime,
                    endTime: '', // no null
                    url: urlFile,
                    comment: comment,
                    startLatitude: latitude,
                    startLongitude: longitude
                }
            }
        })
        .then(({data}) => {
            this.setState(() => {
                return { 
                    visitId: data.addVisit[0].id,
                    runTimer: true,
                    showStartButton: false,
                    showFinalizeButton: true,
                }
            });

            this.props.handleOpenSnackbar(
                'success',
                'Successfully created',
                'bottom',
                'right'
            );
        })
        .catch((error) => {
            this.setState(() => {
                return { formDisabled: false }
            })
            this.props.handleOpenSnackbar(
                'error',
                'Error to save visit',
                'bottom',
                'right'
            );
        })
    }

    updateVisit = () => {
        let { visitId, startTime, endTime, latitude, longitude } = this.state;
        this.props.client.mutate({
            mutation: UPDATE_VISIT_QUERY,
            variables: {
                visit: {
                    id: visitId,
                    startTime: startTime, // required
                    endTime: endTime, // Finalize
                    endLatitude: latitude,
                    endLongitude: longitude
                }
            }
        })
        .then(({data}) => {
            this.setState(() => {
                return {
                    runTimer: false,
                    showFinalizeButton: false,
                }
            })
            this.props.handleOpenSnackbar(
                'success',
                'Successfully updated',
                'bottom',
                'right'
            );
        })
        .catch((error) => {
            this.setState(() => {
                return { disableFinalizeButton: false }
            })

            this.props.handleOpenSnackbar(
                'error',
                'Error to update visit',
                'bottom',
                'right'
            );
        })
    }
    

    handleSubmit = (e) => {
        e.preventDefault();
    }

    handleSelectHotelChange = (e) => {
        this.setState(() => {
            return { businessCompanyId: e.value}
        })
    }

    handleUploadImage = () => {
		// Get the file selected
        const file = this.state.file;
        
        return new Promise((resolve, reject) => {
            try {
                if (!file) return resolve({location: '', fileName: ''});
                var _validFileExtensions = [...this.context.extImage];
                if (
                    !_validFileExtensions.find((value) => {
                        return file.name.toLowerCase().endsWith(value);
                    })
                ){
                    return reject('This format is not supported!');
                }
                else if (file.size <= 0) return reject('File is empty');
                else if (file.size > this.context.maxFileSize) return reject(`File is too big. Max ${this.context.maxFileSize / 1024 / 1024} MB`);
                else {
                    // Subida de la imagen
                    let s3 = new AWS.S3(this.context.credentialsS3);
                    // Create a random file
                    let filename = `${uuidv4()}_${file.name}`;
                    let route = 'images/' + filename;
                    // Configure bucket and key
                    let params = {
                        Bucket: this.context.bucketS3,
                        Key: route,
                        contentType: file.type,
                        ACL: 'public-read',
                        Body: file
                    };

                    return resolve({location: 'https://orion1-files.s3.amazonaws.com/images/9f71d9d4-448b-4f47-ac54-e77b841b5821_Bart-Simpson_gamer.jpg', fileName: filename})
        
                    // s3.upload(params, (err, data) => {
                    // 	if (err)
                    //         return reject('Error Loading File');
                    // 	else
                    // 	    return resolve({location: data.Location, fileName: filename});
                    // })
                }
            } catch (error) {
                return reject('Error Loading File');
            }
        })


    }
    
    handleGeoPosition = () => {
        return new Promise((resolve, reject) => 
            navigator.geolocation.getCurrentPosition((position) => { // success callback
                let posObj = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    srcIframe: `http://maps.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}&hl=es;z=14&amp;output=embed`
                }

                return resolve(posObj)
            }, () => reject("The location could not be obtained")) // Error callback
        )
    }

    handleStartButton = () => {
        if(this.state.rolId === OP_MANAGER_ROL_ID){
            this.setState(() => {
                return {formDisabled: true}
            }, async () => {
                let posObj = {
                    latitude: '',
                    longitude: '',
                    srcIframe: ''
                }
    
                try {
                    if (navigator.geolocation) {
                        posObj = await this.handleGeoPosition();
                    }
    
                    let respUpload = await this.handleUploadImage();
        
                    this.setState(() => {
                        return {
                            startTime: moment(new Date()).local().format("HH:mm:ss"),
                            latitude: posObj.latitude,
                            longitude: posObj.longitude,
                            srcIframe: posObj.srcIframe,
                            urlFile: respUpload.location
                        }
                    }, () => this.createVisit())
                } catch (error) {
                    this.setState(() => {
                        return { formDisabled: false }
                    });

                    this.props.handleOpenSnackbar(
                        'error',
                        error || 'An unexpected error has occurred, contact your system administrator',
                        'bottom',
                        'right'
                    );
                }
            })
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
        if(this.state.rolId === OP_MANAGER_ROL_ID){
            this.setState(() => {
                return { disableFinalizeButton: false }
            }, async () => {
                let posObj = {
                    latitude: '',
                    longitude: '',
                    srcIframe: ''
                }
    
                try {
                    if (navigator.geolocation) {
                        posObj = await this.handleGeoPosition();
                    }
    
                    this.setState(() => {
                        return {
                            endTime: moment(new Date()).local().format("HH:mm:ss"),
                            latitude: posObj.latitude,
                            longitude: posObj.longitude,
                            srcIframe: posObj.srcIframe
                        }
                    }, () => this.updateVisit())
                } catch (error) {
                    this.props.handleOpenSnackbar(
                        'error',
                        error || 'An unexpected error has occurred, contact your system administrator',
                        'bottom',
                        'right'
                    );
                }
            })
            
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

    handleComment = (e) => {
        let comment = e.target.value;
        this.setState(() => {
            return { comment: comment }
        })
    }

    handleFileInput = (e) => {
        e.persist();
        let file = e.target.files[0];
        this.setState(() => {
            return { 
                file: file || {},
                fileName: !!file ? file.name : null
            }
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
        let userId = localStorage.getItem('LoginId');
        let rolId = localStorage.getItem('IdRoles');
        this.setState(() => {
            return {
                userId: !!userId ? +userId : 0,
                rolId: !!rolId ? +rolId : 0
            }
        })
    }

    render() {
        let { open, classes } = this.props;
        let { showStartButton, showFinalizeButton, startTime, endTime, propertiesOpt, srcIframe, formDisabled, disableFinalizeButton } = this.state;
        
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
                                    isDisabled={formDisabled}
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
                                    disabled={formDisabled}
                                />

                                <label htmlFor="">Photo</label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroupFileAddon01">Upload</span>
                                    </div>
                                    <div className="custom-file">
                                        <input type="file" className="custom-file-input" id="inputGroupFile01" disabled={formDisabled} onChange={this.handleFileInput} />
                                        <label className="custom-file-label" htmlFor="">{this.state.fileName || "Choose file"}</label>
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
                                                        disabled={formDisabled}
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
                                                        disabled={disableFinalizeButton}
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
    static contextTypes = {
		maxFileSize: PropTypes.number,
		extImage: PropTypes.array,
		credentialsS3: PropTypes.object,
		bucketS3: PropTypes.string
	};
}

export default withStyles(styles)(withGlobalContent(withApollo(MasterShift)));