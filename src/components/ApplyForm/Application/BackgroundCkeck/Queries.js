import gql from 'graphql-tag';

/**
 * To get background check info by id
 */
export const GET_BACKGROUND_CHECK_INFO = gql`
    query applicantBackgroundCheck($id: Int!) {
        applicantBackgroundCheck(id: $id) {
            id
            vehicleReportRequired
            driverLicenseNumber
            commercialDriverLicense
            licenseState
            licenseExpiration
            signature
            content
            date
            applicantName
            ApplicationId
        }
    }
`;

/**
 * To get background check info by id
 */
export const GET_APPLICATION_CHECK_ID = gql`
    query applications($id: Int!) {
        applications(id: $id) {
            id
            backgroundCheck {
                id
                vehicleReportRequired
                driverLicenseNumber
                commercialDriverLicense
                licenseState
                licenseExpiration
                signature
                content
                date
                applicantName
            }
        }
    }
`;