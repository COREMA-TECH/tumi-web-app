import gql from 'graphql-tag';

export const GET_REPORT_QUERY = gql`
  query punches($idEntity: Int,$Id_Department: Int,$employee: String,$startDate: Date,$endDate: Date ){
    punches(idEntity:$idEntity,Id_Department: $Id_Department,employee: $employee,startDate: $startDate,endDate: $endDate){
      employeeId
      name
      hourCategory
      hoursWorked
      payRate
      date
      clockIn
      clockOut
      lunchIn
      lunchOut
      hotelCode
      positionCode
    }
  }
`;

export const GET_PROPERTIES_QUERY = gql`
  query hotels {
    getbusinesscompanies( IsActive: 1, Contract_Status: "'C'", Id_Parent : -1) {
      Id
      Id_Parent
      Name
      Country
      State
      City
    }
  }
`;

export const GET_DEPARTMENTS_QUERY = gql`
  query department($Id_Entity: Int){
    catalogitem(Id_Catalog:8, Id_Entity:$Id_Entity){
      Id
      DisplayLabel
    }
  }
`;