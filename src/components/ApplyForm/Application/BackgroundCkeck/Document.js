import React, {Fragment} from 'react';
import moment from 'moment';
const EMPTY_FUNCTION = _ => {}; 
const CURRENT_DATE = moment(new Date().toISOString()).format('MM/DD/YYYY');

/**
 * 
 * @param {Object} props 
 * @param {function} props.setState handle state
 * @param {Object} props.data information to show
 * @param {*} props.data.firstName
 * @param {*} props.data.middleName
 * @param {*} props.data.lastName
 * @param {*} props.data.birthDay
 * @param {*} props.data.streetAddress
 * @param {*} props.data.cityName
 * @param {*} props.data.stateName
 * @param {*} props.data.zipCode
 * @param {*} props.data.socialSecurityNumber
 * @param {*} props.data.vehicleReportRequired
 * @param {*} props.data.driverLicenseNumber
 * @param {*} props.data.licenseStateName
 * @param {*} props.data.licenseExpiration
 * @param {*} props.data.commercialDriverLicense
 * @param {*} props.data.signature
 */
const Document = props => {
    const setState = props.setState || EMPTY_FUNCTION;
    const{ firstName, middleName, lastName, birthDay, streetAddress, cityName, stateName, zipCode, socialSecurityNumber,
        vehicleReportRequired, driverLicenseNumber, licenseStateName, licenseExpiration, commercialDriverLicense, signature
    } = props.data;

    return <Fragment>
        <div style={{ width: '100%', margin: '0 auto' }}>
            <p><img style={{ display: 'block', marginLeft: '-8.5%', marginTop: '-10px' }} src="https://i.imgur.com/bHDSsLu.png" alt width="116%" height={192} /></p>
            <div title="Page 1">
                <table style={{ borderCollapse: 'collapse', width: '100%', height: '59px' }} border={0}>
                    <tbody>
                        <tr style={{ height: '59px' }}>
                            <td style={{ width: '100%', height: '59px', textAlign: 'justify' }}>
                                <p><span style={{ color: '#000000' }}>In connection with my application for employment, I understand that an investigative background inquiry is to be made on myself, including, but no limited to, identity and prior address(es) verification, criminal history, driving record, consumer credit history, education verification, prior employment verification and other references as well as other information.</span></p>
                                <div title="Page 1">
                                    <div>
                                        <div>
                                            <p><span style={{ color: '#000000' }}>I further understand that for the purposes of this background inquiry, various sources will be contacted to provide information, including but not limited to various Federal, State, County, municipal, corporate, private and other agencies, which may maintain records concerning my past activities relating to my criminal conduct, civil court litigation, driving record, and credit performance, as well as various other experiences.</span></p>
                                            <p><span style={{ color: '#000000' }}>I hereby authorize without reservation, any company, agency, party of other source contracted to furnish the above information as requested. I do hereby release, discharge and indemnify the prospective employer, it’s agents and associates to the full extent permitted by law from any claims, damages, losses, liabilities, cost and expenses arising from the retrieving and reporting of the requested information.</span></p>
                                            <p><span style={{ color: '#000000' }}>I acknowledge that a photocopy of this authorization be accepted with the same authority as the original and this signed release expires one (1) year after the date of origination.</span></p>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p>&nbsp;</p>
            </div>
            <table style={{
                marginTop: '15px',
                backgroundColor: '#ddd',
                borderCollapse: 'collapse', width: '100%', height: '35px'
            }} border={1}>
                <tbody>
                    <tr style={{ height: '35px' }}>
                        <td style={{ width: '100%', height: '35px' }}>
                            <div title="Page 1">
                                <div>
                                    <div>
                                        <div style={{ textAlign: 'center' }}><span style={{ color: '#000000', fontWeight: '400', marginLeft: '2px' }}><strong>APPLICANT INFORMATION</strong></span></div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table style={{ borderCollapse: 'collapse', width: '100%' }} border={1}>
                <tbody>
                    <tr>
                        <td style={{ width: '100%' }}><strong><span style={{ color: '#000000', fontWeight: '400', marginLeft: '2px' }}>Please print clearly, use black ink, and use your full legal name.</span></strong></td>
                    </tr>
                </tbody>
            </table>
            <table style={{ borderCollapse: 'collapse', width: '100%', height: '28px' }} border={1}>
                <tbody>
                    <tr style={{ height: '17px' }}>
                        <td style={{ width: '33.3333%', height: '28px' }}>
                            <div title="Page 1"><span style={{ color: '#000000', fontWeight: '400', marginLeft: '2px' }}><strong>FIRST NAME:</strong></span></div>
                            <div title="Page 1">{firstName}</div>
                        </td>
                        <td style={{ width: '33.3333%', height: '28px' }}>
                            <div title="Page 1"><span style={{ color: '#000000', fontWeight: '400', marginLeft: '2px' }}><strong>MIDDLE NAME:</strong></span></div>
                            <div title="Page 1">&nbsp;{middleName}</div>
                        </td>
                        <td style={{ width: '33.3333%', height: '28px' }}>
                            <div title="Page 1"><span style={{ color: '#000000', fontWeight: '400', marginLeft: '2px' }}><strong>LAST NAME:</strong></span></div>
                            <div title="Page 1">&nbsp;{lastName}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table style={{ borderCollapse: 'collapse', width: '100%', height: '17px' }} border={1}>
                <tbody>
                    <tr style={{ height: '17px' }}>
                        <td style={{ width: '33.3333%', height: '17px' }}>
                            <div title="Page 1"><span style={{ color: '#000000', fontWeight: '400', marginLeft: '2px' }}><strong>SOCIAL SECURITY NUMBER:</strong></span></div>
                            <div title="Page 1">{socialSecurityNumber}</div>
                        </td>
                        <td style={{ width: '33.3333%', height: '17px' }}>
                            <div title="Page 1">
                                <div title="Page 1"><span style={{ color: '#000000', fontWeight: '400', marginLeft: '2px' }}><strong>DATE OF BIRTH:</strong></span></div>
                                <div title="Page 1">{birthDay}</div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table style={{ borderCollapse: 'collapse', width: '100%', height: '41px' }} border={1}>
                <tbody>
                    <tr style={{ height: '41px' }}>
                        <td style={{ width: '100%', height: '41px' }}>
                            <div title="Page 1"><span style={{ color: '#000000', fontWeight: '400', marginLeft: '2px' }}><strong>CURRENT STREET ADDRESS:</strong></span></div>
                            <div title="Page 1">{streetAddress}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table style={{ borderCollapse: 'collapse', width: '100%', height: '41px' }} border={1}>
                <tbody>
                    <tr style={{ height: '41px' }}>
                        <td style={{ width: '50.0173%', height: '41px' }}>
                            <div title="Page 1"><span style={{ color: '#000000', fontWeight: '400', marginLeft: '2px' }}><strong>CITY:</strong></span><span>{cityName}</span></div>
                        </td>
                        <td style={{ width: '28.7453%', height: '41px' }}>
                            <div title="Page 1"><span style={{ color: '#000000', fontWeight: '400', marginLeft: '2px' }}><strong>STATE:</strong></span><span>{stateName}</span></div>
                            <div title="Page 1">{}</div>
                        </td>
                        <td style={{ width: '18.4013%', height: '41px' }}>
                            <div title="Page 1"><span style={{ color: '#000000', fontWeight: '400', marginLeft: '2px' }}><strong>ZIP CODE:</strong></span></div>
                            <div title="Page 1">{zipCode}</div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <table style={{ backgroundColor: '#ddd', borderCollapse: 'collapse', width: '100%', height: '35px', marginTop: '300px' }} border={1}>
                <tbody>
                    <tr style={{ height: '35px' }}>
                        <td style={{ width: '100%', height: '35px' }}>
                            <div title="Page 1">
                                <div>
                                    <div>
                                        <div style={{ textAlign: 'center' }}><span style={{ color: '#000000', fontWeight: '400', marginLeft: '2px' }}><strong>MOTOR VEHICLE RECORD</strong></span></div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table style={{ borderCollapse: 'collapse', width: '100%', height: '42px' }} border={1}>
                <tbody>
                    <tr style={{ height: '42px' }}>
                        <td style={{ width: '100%', height: '42px' }}>
                            <div title="Page 1" style={{
                                display: 'flex',
                                flexDirection: 'row',
                            }}>
                                <span style={{ color: '#000000' }}>
                                    <span style={{ color: '#000000', fontWeight: '400', marginLeft: '2px' }}><strong>WILL A MOTOR VEHICLE REPORT BE REQUIRED?: </strong>
                                    </span>
                                </span>

                                {
                                    vehicleReportRequired ? (
                                        <span style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            marginLeft: '10px',
                                            position: 'relative',
                                            top: '-5px'
                                        }}>
                                            <div style={{
                                                width: '20px',
                                                display: 'inline',
                                                marginRight: '5px'
                                            }}>
                                                <label htmlFor="" style={{
                                                    width: '100%'
                                                }}>Yes</label>
                                                <input type="checkbox"
                                                    value={true}
                                                    defaultChecked={true} />
                                            </div>
                                            <div style={{
                                                width: '20px',
                                                display: 'inline',
                                            }}>
                                                <label htmlFor="" style={{
                                                    width: '100%'
                                                }}>No</label>
                                                <input type="checkbox" value={false} defaultChecked={false} />

                                            </div>
                                        </span>
                                    ) : (
                                            <span style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                marginLeft: '10px',
                                                position: 'relative',
                                                top: '-5px'
                                            }}>
                                                <div style={{
                                                    width: '20px',
                                                    display: 'inline',
                                                    marginRight: '5px'
                                                }}>
                                                    <label htmlFor="" style={{
                                                        width: '100%'
                                                    }}>Yes</label>
                                                    <input type="checkbox"
                                                        value={false}
                                                        defaultChecked={false} />
                                                </div>
                                                <div style={{
                                                    width: '20px',
                                                    display: 'inline',
                                                }}>
                                                    <label htmlFor="" style={{
                                                        width: '100%'
                                                    }}>No</label>
                                                    <input type="checkbox" value={true} defaultChecked={true} />

                                                </div>
                                            </span>
                                        )
                                }</div>
                            <div title="Page 1"><br /><br /></div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table style={{ borderCollapse: 'collapse', width: '100%', height: '44px' }} border={1}>
                <tbody>
                    <tr style={{ height: '44px' }}>
                        <td style={{ width: '50.0173%', height: '44px' }}>
                            <div title="Page 1"><span style={{ color: '#000000', fontWeight: '400', marginLeft: '2px' }}><strong>DRIVERS LICENSE NUMBER:</strong></span></div>
                            <div title="Page 1">{driverLicenseNumber}</div>
                        </td>
                        <td style={{ width: '28.7453%', height: '44px' }}>
                            <div title="Page 1"><span style={{ color: '#000000', fontWeight: '400', marginLeft: '2px' }}><strong>STATE: </strong></span><span>{licenseStateName}</span><span></span>
                            </div>
                            <div title="Page 1"></div>
                        </td>
                        <td style={{ width: '18.4013%', height: '44px' }}>
                            <div title="Page 1"><span style={{ color: '#000000', fontWeight: '400', marginLeft: '2px' }}><strong>EXPIRATION:</strong></span></div>
                            <div title="Page 1">{ licenseExpiration }</div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div title="Page 1">
                <table style={{ borderCollapse: 'collapse', width: '100%', height: '45px' }} border={1}>
                    <tbody>
                        <tr style={{ height: '45px' }}>
                            <td style={{
                                width: '100%', height: '45px', display: 'flex',
                                flexDirection: 'row'
                            }}>
                                <span style={{ color: '#000000', fontWeight: '400', marginLeft: '2px' }}>
                                    <strong>IS THIS A COMMERCIAL DRIVERS LICENSE?:</strong></span><span>
                                    {
                                        commercialDriverLicense ? (
                                            <span style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                marginLeft: '10px',
                                                position: 'relative',
                                                top: '-5px'
                                            }}>
                                                <div style={{
                                                    width: '20px',
                                                    display: 'inline',
                                                    marginRight: '5px'
                                                }}>
                                                    <label htmlFor="" style={{
                                                        width: '100%'
                                                    }}>Yes</label>
                                                    <input type="checkbox"
                                                        value={true}
                                                        defaultChecked={true} />
                                                </div>
                                                <div style={{
                                                    width: '20px',
                                                    display: 'inline',
                                                }}>
                                                    <label htmlFor="" style={{
                                                        width: '100%'
                                                    }}>No</label>
                                                    <input type="checkbox" value={false} defaultChecked={false} />

                                                </div>
                                            </span>
                                        ) : (
                                                <span style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    marginLeft: '10px',
                                                    position: 'relative',
                                                    top: '-5px'
                                                }}>
                                                    <div style={{
                                                        width: '20px',
                                                        display: 'inline',
                                                        marginRight: '5px'
                                                    }}>
                                                        <label htmlFor="" style={{
                                                            width: '100%'
                                                        }}>Yes</label>
                                                        <input type="checkbox"
                                                            value={false}
                                                            defaultChecked={false} />
                                                    </div>
                                                    <div style={{
                                                        width: '20px',
                                                        display: 'inline',
                                                    }}>
                                                        <label htmlFor="" style={{
                                                            width: '100%'
                                                        }}>No</label>
                                                        <input type="checkbox" value={true} defaultChecked={true} />

                                                    </div>
                                                </span>
                                            )
                                    }
                                </span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>&nbsp;</p>
            <table style={{ borderCollapse: 'collapse', width: '100%', height: '17px' }} border={0}>
                <tbody>
                    <tr style={{ height: '17px' }}>
                        <td style={{ width: '100%', height: '17px', textAlign: 'justify' }}><span><strong><span style={{ color: '#000000' }}>In connection with this request, I hereby release the aforesaid parties from any liability and responsibility for obtaining my investigative background inquiry.</span></strong></span></td>
                    </tr>
                </tbody>
            </table>
            <table style={{ borderCollapse: 'collapse', width: '100%', height: '20px' }} border={1}>
                <tbody>
                    <tr style={{ height: '20px', verticalAlign: "middle" }}>
                        <td style={{ width: '50%', height: '17px' }}><span style={{ color: '#000000', fontWeight: '400', marginLeft: '2px' }}><strong>SIGNATURE: </strong></span>
                            <img style={{
                                width: '100px',
                                height: '20px',
                                display: 'inline-block',
                                backgroundColor: '#f9f9f9',
                                zoom: "2.5",
                                margin: 'auto'
                            }} src={signature} alt="" />
                        </td>
                        <td style={{ width: '47.1631%', height: '20px' }}><span style={{ color: '#000000', fontWeight: '400', marginLeft: '2px' }}><strong>DATE: </strong></span><span>{CURRENT_DATE}</span></td>
                    </tr>
                </tbody>
            </table>
            <p>&nbsp;</p>
            <table style={{ borderCollapse: 'collapse', width: '100%', height: '17px' }} border={0}>
                <tbody>
                    <tr style={{ height: '17px' }}>
                        <td style={{ width: '50%', height: '17px' }}>
                            <div title="Page 1">
                                <div>
                                    <div>
                                        <p>Background Authorization - English</p>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td style={{ width: '47.1631%', height: '17px' }}>
                            <div title="Page 1">
                                <div>
                                    <div>
                                        <p style={{ textAlign: 'right' }}>Tumi Staffing – Updated 05/06/2013</p>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Fragment>
}

export default Document;