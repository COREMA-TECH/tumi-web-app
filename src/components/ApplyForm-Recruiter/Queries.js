import gql from 'graphql-tag';

/**
 * Query to get states
 */
export const GET_STATES_QUERY = gql`
    query States($parent: Int!) {
        getcatalogitem(Id: null, IsActive: 1, Id_Parent: $parent, Id_Catalog: 3) {
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
        getcatalogitem(Id: null, IsActive: 1, Id_Parent: $parent, Id_Catalog: 5) {
            Id
            Name
            IsActive
        }
    }
`;

/**
 * Query to get positions
 */
export const GET_POSITIONS_QUERY = gql`
query getposition {
        getcatalogitem(Id_Catalog: 6, IsActive: 1) {
            Id
            IsActive
            Description
        }
    }
`;


/**
 * Query to get languages
 */
export const GET_LANGUAGES_QUERY = gql`
    {
        getcatalogitem(Id: null, Id_Catalog: 9, IsActive: 1){
            Id
            Name
        }
    }
`;

/**
 * Query to get application by id
 */
export const GET_APPLICATION_BY_ID = gql`
    query applications($id: Int!) {
        applications(id: $id){
            firstName
            middleName
            lastName
            date
            streetAddress
            emailAddress
            aptNumber
            city
            state
            zipCode
            homePhone
            cellPhone
            socialSecurityNumber
            positionApplyingFor
            birthDay
            car
            typeOfId
            expireDateId
            dateAvailable
            scheduleRestrictions
            scheduleExplain
            convicted
            convictedExplain
            comment
            generalComment
        }
    }
`;

export const GET_APPLICATION_LANGUAGES_BY_ID = gql`
    query applications($id: Int!) {
        applications(id: $id) {
            languages {
                id
                language
                writing
                conversation
            }
        }
    }
`;

export const GET_APPLICATION_EDUCATION_BY_ID = gql`
    query applications($id: Int!) {
        applications(id: $id) {
            educations {
                id
                schoolType
                educationName
                educationAddress
                startDate
                endDate
                graduated
                degree
                ApplicationId
            }
        }
    }
`;

export const GET_APPLICATION_PREVIOUS_EMPLOYMENT_BY_ID = gql`
    query applications($id: Int!) {
        applications(id: $id) {
            employments {
                id
                companyName
                phone
                address
                supervisor
                jobTitle
                payRate
                startDate
                endDate
                reasonForLeaving
                ApplicationId
            }
        }
    }
`;

export const GET_APPLICATION_MILITARY_SERVICES_BY_ID = gql`
    query applications($id: Int!) {
        applications(id: $id) {
            militaryServices {
                id
                branch
                startDate
                endDate
                rankAtDischarge
                typeOfDischarge
                ApplicationId
            }
        }
    }
`;

export const GET_APPLICATION_SKILLS_BY_ID = gql`
    query applications($id: Int!) {
        applications(id: $id) {
            skills {
                id
                description
                level
            }
        }
    }
`;


