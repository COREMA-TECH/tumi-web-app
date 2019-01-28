import gql from 'graphql-tag';

/**
 * Query to get employees
 */
export const LIST_EMPLOYEES = gql`
    {
        employees(isActive: true) {
            id
            firstName
            lastName
            electronicAddress
            mobileNumber
            idRole
            isActive
            Id_Deparment
            Contact_Title
            idUsers
            idEntity
        }
    }
`;

export const GET_ALL_DEPARTMENTS_QUERY = gql`
    query catalogitem {
        catalogitem(IsActive: 1, Id_Catalog: 8) {
            Id
            Name: DisplayLabel
            IsActive
        }
    }
`;

export const GET_ALL_POSITIONS_QUERY = gql`
    {
        getposition {
            Id
            Position
            Id_Entity
        }
    }
`;

