import gql from 'graphql-tag';

export const GET_INITIAL_DATA = gql`
query data {
    employees(isActive:true) {
      id
      firstName
      lastName
      electronicAddress
      mobileNumber
      
    } 
    getbusinesscompanies(Id: null, IsActive: 1, Contract_Status: null, Id_Parent: -1) {
          Id
          Code
          Name         
    } 
  }
`;

export const GET_POSITION = gql`
  query positions($Id_Entity: Int){
    getposition(Id_Entity: $Id_Entity){
      Id
      Position      
    }
  }
`;

export const GET_STATES_QUERY = gql`
    query Cities($id: Int) {
        getcatalogitem(Id: $id, IsActive: 1,  Id_Catalog: 3) {
            Id
            Name
            IsActive
        }
    }
`;

export const GET_CITIES_QUERY = gql`
    query Cities($id: Int, $parentId: Int) {
        getcatalogitem(Id: $id, IsActive: 1,  Id_Catalog: 5, Id_Parent: $parentId) {
            Id
            Name
            IsActive
        }
    }
`;

export const GET_SHIFTS = gql`
    {
        shift {
            id
            title
            bgColor : color
            status
            idPosition
            company {
                City
            }
        }

        ShiftDetail {
            id
            ShiftId
            start: startDate
            startTime
            end: endDate
            endTime
        }
    }
`;

export const GET_SHIFTS_QUERY = gql`
    query GetInformation($id: Int){
        ShiftDetail(id:$id) {
        id
        startDate
        endDate
        startTime
        endTime
        ShiftId
        shift{
            id
            entityId
            title
            color
            status
            idPosition
        }
        detailEmployee{
            EmployeeId
        }
        }
    }  
`;


