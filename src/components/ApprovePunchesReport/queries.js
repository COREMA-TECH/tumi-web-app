import gql from 'graphql-tag';

export const GET_REPORT_QUERY = gql`
 query approvePunches($idEmployee: Int, $status: String!, $startDate: Date!, $endDate: Date!,) {
    approvePunchesReport(idEmployee: $idEmployee, status: $status, startDate: $startDate, endDate: $endDate) {
      id
      fullName
      unapprovedWorkedTime
      approvedWorkedTime
      approvedDate
      selected
      detailApproved {
        id      
      }
      detailUnapproved
      {
        id
      }
    }
  }
`;

export const GET_PROPERTIES_QUERY = gql`
  query hotels($Id: Int) {
    getbusinesscompanies(Id: $Id, IsActive: 1, Contract_Status: "'C'", Id_Parent : -1) {
      Id
      Id_Parent
      Code
      Name
      Country
      State
      City
    }
  }
`;

export const GET_DEPARTMENTS_QUERY = gql`
  query department($Id_Entity: Int){
    cataogitem(Id_Catalog:8, Id_Entity:$Id_Entity){
      Id
      DisplayLabel
    }
  }
`;

export const GET_USER = gql`
  query user($id: Int)  {
      user(Id: $id) {
          Id,
          Full_Name,
          IdRegion
      }
  }
`;

export const GET_PROPERTY_BY_REGION = gql`
  query getbusinesscompanies($Region: Int) {
      getbusinesscompanies(Id: null, IsActive: 1, Contract_Status: null, Id_Parent: null, Region: $Region) {
          Id
          Id_Contract
          Id_Company
          Code
          Name
          Description
          ImageURL
          Address
          Id_Parent
      }
  }
`;

export const GET_EMPLOYEES_QUERY = gql`
{
  employees(isActive:true) {
      id
      firstName
      lastName
    }
} 
`; 

export const GET_PUNCHES_REPORT_CONSOLIDATED = gql`
    query markedEmployeesConsolidated($EmployeeId: Int,$startDate: Date,$endDate: Date ){
      markedEmployeesConsolidated(EmployeeId: $EmployeeId,employee: "",startDate: $startDate,endDate: $endDate) {
          key
          date
          punches {
            clockInId
            clockOutId
            key
            name
            employeeId
            clockIn
            clockOut
            duration
            job
            hotelCode
            hotelId
            noteIn
            noteOut
            imageMarkedIn
            imageMarkedOut
            flagIn
            flagOut
            approvedDateIn
            approvedDateOut
          }
      }
    }
`;