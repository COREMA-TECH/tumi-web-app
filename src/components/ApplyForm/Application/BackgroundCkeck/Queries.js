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
                pdfUrl
            }
        }
    }
`;

/**
 * Query to get states
 */
export const GET_STATES_QUERY = gql`
	query States($parent: Int!, $value: String) {
		getcatalogitem( IsActive: 1, Id_Parent: $parent, Id_Catalog: 3, Value: $value) {
			Id
			Name
			IsActive
		}
	}
`;

/**
 * Query to get cities
 */
export const GET_CITIES_QUERY = gql`
	query Cities($parent: Int!) {
		getcatalogitem( IsActive: 1, Id_Parent: $parent, Id_Catalog: 5) {
			Id
			Name
			IsActive
		}
	}
`;