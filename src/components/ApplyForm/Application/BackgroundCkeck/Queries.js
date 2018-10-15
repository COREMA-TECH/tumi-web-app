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