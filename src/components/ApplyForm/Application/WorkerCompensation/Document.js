
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
        applicantZipCode, injuryDate
     } = data;

    return `<p style="text-align: center; font-family: 'Times New Roman';"><span style="font-family: Times New Roman;"><b>Employee &nbsp;Acknowledgment &nbsp;of &nbsp;&nbsp;Workers&apos; Compensation Network</b></span></p>
        <p style="text-align: justify; font-family: Times New Roman;"><strong><span style="font-family: 'Times New Roman';">&nbsp;</span></strong></p>
        <p style="text-align: justify; line-height: 1.5; font-family: Times New Roman;">I &nbsp;have &nbsp;received information that tells me how to get health care under my employer&apos;s workers&apos; compensation insurance.</p>
        <p style="text-align: justify; font-family: Times New Roman;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
        <p style="text-align: justify; font-family: Times New Roman;">If I am hurt on the job and live in a service area described in this information, I understand that:</p>
        <ol style="margin-top: 0in; margin-bottom: .0001pt;">
            <li style="text-align: justify; line-height: 1.5; font-family: Times New Roman;">I must choose a treating doctor from the list of doctors in the network. Or, I may ask my HMO primary care physician to agree to serve as my treating doctor. If I select my HMO primary care physician as my treating doctor, I will call Texas Mutual at (800) 859-5995 to notify them of my choice.</li>
            <li style="text-align: justify; line-height: 1.5; font-family: Times New Roman;">I must go to my treating doctor for all health care for my injury. If I need a specialist, my treating doctor will refer me. If I need emergency care, I may go anywhere.</li>
            <li style="text-align: justify; font-family: Times New Roman;">The insurance carrier will pay the treating doctor and other network providers.</li>
            <li style="text-align: justify; line-height: 1.5; font-family: Times New Roman;">I might have to pay the bill if I get health care from someone other than a network doctor without network approval.</li>
            <li style="text-align: justify; line-height: 1.5; font-family: Times New Roman;">Knowingly making a false workers&apos; compensation claim may lead to a criminal investigation that could result in criminal penalties such as fines and imprisonment.</li>
        </ol>
        <p style="text-align: justify; font-family: Times New Roman;"><span style="">&nbsp;</span></p>
        <table style="border-collapse: collapse; width: 100%; border-style: none; margin-bottom: 14px" border="0" cellspacing="5">
            <tbody>
                <tr>
                    <td style="width: 80%; border-bottom: 1px solid black; margin-right: 5px;"><img src="${signature || ''}" alt="" width="150" height="auto" style="zoom:1.5" /></td>
                    <td style="width: 20%; border-bottom: 1px solid black; margin-left: 5px;">${date || ''}</td>
                </tr>
                <tr>
                    <td style="width: 80%; font-size: 10px; vertical-align: top;">Signature</td>
                    <td style="width: 20%; font-size: 10px; vertical-align: top;">Date</td>
                </tr>
            </tbody>
        </table>
        <table style="border-collapse: collapse; width: 100%; border-style: none; margin-bottom: 14px" border="0" cellspacing="5">
            <tbody>
                <tr>
                    <td style="width: 80%; border-bottom: 1px solid black; margin-right: 5px;">${applicantName || ''}</td>
                    <td style="width: 20%;">&nbsp;</td>
                </tr>
                <tr>
                    <td style="width: 80%; font-size: 10px; vertical-align: top;">Printed Name</td>
                    <td style="width: 20%;">&nbsp;</td>
                </tr>
            </tbody>
        </table>
        <table style="border-collapse: collapse; width: 100%; border-style: none; margin-bottom: 14px" border="0">
            <tbody>
                <tr>
                    <td style="width: 20%; margin-left: 5px;">I live at:</td>
                    <td style="width: 80%; border-bottom: 1px solid black; margin-right: 5px;">${applicantAddress || ''}</td>
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
        <p style="text-align: justify; font-family: Times New Roman;">Name of Network: <em>Texas Star Network</em>&reg;</p>
        <p style="text-align: justify; font-family: Times New Roman;"><span style="">&nbsp;</span></p>
        <p style="text-align: justify; line-height: 1.5; font-family: Times New Roman;"><strong><span style="font-family: 'Times New Roman';">Network service areas are subject to change. Call (800) 381-8067 if you need a network treating </span></strong><strong><span style="font-family: 'Times New Roman';">provider.</span></strong></p>
        <table style="border-collapse: collapse; width: 100%;" border="1">
            <tbody>
                <tr>
                    <td style="width: 100%; padding: 8px;">
                        <p style="font-family: Times New Roman;"><span style="">Please indicate whether this is the:</span></p>
                        <ul style="margin-top: 1.0pt; margin-bottom: .0001pt; list-style: none;">
                            <li style="margin: 1pt 0in 0.0001pt 31.2px; font-family: Times New Roman;"><span style="">&#9633;  Initial Employee Notification</span></li>
                            <li style="margin: 0.95pt 0in 0.0001pt 31.2px; font-family: Times New Roman;"><span style="">&#9633;  Injury Notification: <u>${injuryDate}</u></span></li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>
        <p style="text-align: justify; font-family: Times New Roman;">&nbsp;</p>
        <p style="text-align: justify; font-family: Times New Roman;"><strong><span style="font-family: 'Times New Roman';">DO NOT RETURN THIS FORM TO TEXAS MUTUAL INSURANCE COMPANY UNLESS REQUESTED</span></strong></p>`
}

export default Document;