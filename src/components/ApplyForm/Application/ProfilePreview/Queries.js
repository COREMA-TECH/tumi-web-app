import gql from 'graphql-tag';

export const GET_APPLICATION_PROFILE_INFO = gql`
    query applications($id: Int!) {
        applications(id: $id) {
            id
            firstName
            lastName
            isActive
            position {
                Id
                Name
            }
        }
    }
`;


export const GET_DEPARTMENTS_QUERY = gql`
    {
        getcatalogitem(IsActive: 1, Id_Catalog: 8) {
            Id
            Name: DisplayLabel
            IsActive
        }
    }
`;


export const GET_CONTACTS_QUERY = gql`
    query getcontacts($IdEntity: Int) {
        getcontacts(IsActive: 1, Id_Entity: $IdEntity) {
            id: Id
            idSearch: Id
            firstname: First_Name
            middlename: Middle_Name
            lastname: Last_Name
            email: Electronic_Address
            number: Phone_Number
            title: Contact_Title
            idSupervisor: Id_Supervisor
            idDepartment: Id_Deparment
            type: Contact_Type
        }
    }
`;

export const GET_TYPES_QUERY = gql`
    {
        getcatalogitem(IsActive: 1, Id_Catalog: 6) {
            Id
            Name
            IsActive
        }
    }
`;

export const GET_SUPERVISORS_QUERY = gql`
    query getsupervisor($Id: Int, $Id_Entity: Int) {
        getsupervisor(IsActive: 1, Id_Entity: $Id_Entity, Id: $Id) {
            Id: Id
            Name: Full_Name
        }
    }
`;

export const GET_HOTELS_QUERY = gql`
    {
        getbusinesscompanies(Id: null, IsActive: 1, Contract_Status: "'C'", Id_Parent: -1) {
            Id
            Name
        }
    }
`;