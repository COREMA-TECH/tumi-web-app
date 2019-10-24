
/**
 * Worker Compensation document
 * @param {Object} data 
 * @param {*} data.signature
 * @param {*} data.date
 * @param {*} data.applicantName
 * @param {*} data.applicantAddress
 * @param {*} data.applicantCity
 * @param {*} data.applicantState
 * @param {*} data.applicantZipCode
 * @param {*} data.injuryDate
 */
const Document = (data = {}) => {
    const { signature, date, applicantName, applicantAddress, applicantCity, applicantState,
        applicantZipCode, injuryDate, initialProgram, initialNotification, injuryNotification
     } = data;

    return `
        <p style="text-align:center">
            <img width:="25%" src="data:image/png;base64,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" />
        </p>
        <p style="text-align: center; font-family: 'Times New Roman';"><span style="font-family: Times New Roman;"><b>Employee &nbsp;Acknowledgment &nbsp;of &nbsp;&nbsp;Workers&apos; Compensation Network</b></span></p>
        <p style="text-align: justify; font-family: Times New Roman;"><strong><span style="font-family: 'Times New Roman';">&nbsp;</span></strong></p>
        <p style="text-align: justify; line-height: 1.5; font-family: Times New Roman;">I &nbsp;have &nbsp;received information that tells me how to get health care under my employer&apos;s workers&apos; compensation insurance.</p>
        <p style="text-align: justify; font-family: Times New Roman;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
        <p style="text-align: justify; font-family: Times New Roman;">If I am hurt on the job and live in a service area described in this information, I understand that:</p>
        <ol style="margin-top: 0in; margin-bottom: .0001pt; margin-left: 20px;">
            <li style="text-align: justify; line-height: 1.5; font-family: Times New Roman;">I must choose a treating doctor from the list of doctors in the network. Or, I may ask my HMO primary care physician to agree to serve as my treating doctor. If I select my HMO primary care physician as my treating doctor, I will call Texas Mutual at (844) 867-2338 to notify them of my choice.</li>
            <li style="text-align: justify; line-height: 1.5; font-family: Times New Roman;">I must go to my treating doctor for all health care for my injury. If I need a specialist, my treating doctor will refer me. If I need emergency care, I may go anywhere.</li>
            <li style="text-align: justify; font-family: Times New Roman;">The insurance carrier will pay the treating doctor and other network providers.</li>
            <li style="text-align: justify; line-height: 1.5; font-family: Times New Roman;">I might have to pay the bill if I get health care from someone other than a network doctor without network approval.</li>
            <li style="text-align: justify; line-height: 1.5; font-family: Times New Roman;">Knowingly making a false workers&apos; compensation claim may lead to a criminal investigation that could result in criminal penalties such as fines and imprisonment.</li>
        </ol>
        <p style="text-align: justify; font-family: Times New Roman;"><span style="">&nbsp;</span></p>
        <table style="border-collapse: collapse; width: 100%; border-style: none; margin-bottom: 14px" border="0" cellspacing="5">
            <tbody>
                <tr>
                    <td style="width: 40%; border-bottom: 1px solid black; margin-right: 5px;"><img src="${signature || ''}" alt="" width="150" height="auto" style="zoom:1.5" /></td>
                    <td style="width: 20%; border-bottom: 1px solid black; margin-left: 5px;">${date || ''}</td>
                    <td style="width: 40%; border-bottom: 1px solid black; margin-right: 5px;">${applicantName || ''}</td>
                </tr>
                <tr>
                    <td style="width: 40%; font-size: 10px; vertical-align: top;">Signature</td>
                    <td style="width: 20%; font-size: 10px; vertical-align: top;">Date</td>
                    <td style="width: 40%; font-size: 10px; vertical-align: top;">Printed Name</td>
                </tr>
            </tbody>
        </table>
        <table style="border-collapse: collapse; width: 100%; border-style: none; margin-bottom: 14px" border="0">
            <tbody>
                <tr>
                    <td style="width: 10%; margin-left: 5px;">I live at:</td>
                    <td style="width: 90%; border-bottom: 1px solid black; margin-right: 5px;">${applicantAddress || ''}</td>
                </tr>
                <tr>
                    <td style="width: 20%; margin-left: 5px;">&nbsp;</td>
                    <td style="width: 80%; margin-right: 5px; font-size: 10px; vertical-align: top;">Street Address</td>
                </tr>
            </tbody>
        </table>
        <table style="border-collapse: collapse; width: 100%; border-style: none; margin-bottom: 14px" border="0">
            <tbody>
                <tr>
                    <td style="width: 20%; margin-left: 5px;">&nbsp;</td>
                    <td style="width: 20%; border-bottom: 1px solid black; margin-right: 5px;">${applicantCity || ''}</td>
                    <td style="width: 40%; border-bottom: 1px solid black; margin-right: 5px;">${applicantState || ''}</td>
                    <td style="width: 20%; border-bottom: 1px solid black; margin-right: 5px;">${applicantZipCode || ''}</td>
                </tr>
                <tr>
                    <td style="width: 20%; margin-left: 5px;">&nbsp;</td>
                    <td style="width: 20%; margin-right: 5px; font-size: 10px; vertical-align: top;">City</td>
                    <td style="width: 40%; margin-right: 5px; font-size: 10px; vertical-align: top;">State</td>
                    <td style="width: 20%; margin-right: 5px; font-size: 10px; vertical-align: top;">Zip Code</td>
                </tr>
            </tbody>
        </table>
        
        <p style="text-align: justify; font-family: Times New Roman;">Name of Employer: <u>TUMI STAFFING INC.</u></p>
        <p style="text-align: justify; font-family: Times New Roman;">Name of Network: <strong>WorkWell, TX</strong></p>
        <p style="text-align: justify; font-family: Times New Roman;"><span style="">&nbsp;</span></p>
        <table style="border-collapse: collapse; width: 100%;" border="1">
            <tbody>
                <tr>
                    <td style="width: 100%; padding: 8px;">
                        <h3>To the employer</h3>
                        <p style="font-family: Times New Roman;"><span style="">Each employee must sign this form when you begin the program or within 3 days of beign hired, and at the time an injury occurs. Please indicate at which point this acknowledgement:</span></p>
                        <ul style="margin-top: 1.0pt; margin-bottom: .0001pt; list-style: none;">
                            <li style="margin: 1pt 0in 0.0001pt 31.2px; font-family: Times New Roman;"><span style="">${initialProgram ? '&#10003;': '&#9633;'} Initiating the network program (companywide)</span></li>
                            <li style="margin: 1pt 0in 0.0001pt 31.2px; font-family: Times New Roman;"><span style="">${initialNotification ? '&#10003;': '&#9633;'} Initial Employee Notification (new hire)</span></li>
                            <li style="margin: 0.95pt 0in 0.0001pt 31.2px; font-family: Times New Roman;"><span style="">${injuryNotification ? '&#10003;': '&#9633;'}  Injury Notification: <u>(Date of injuty: ${injuryDate})</u></span></li>
                        </ul>
                        <br>
                        <p style="font-family: Times New Roman;"><span style="text-decoration: underline">Keep this completed form in the employee's personal file. It could be requested by Texas Mutual.</span></p>
                    </td>
                </tr>
            </tbody>
        </table>
        `
}

export default Document;