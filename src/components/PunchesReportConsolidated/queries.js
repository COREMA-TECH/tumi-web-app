import gql from 'graphql-tag';

export const GET_PUNCHES_REPORT_CONSOLIDATED = gql`
    query markedEmployeesConsolidated($idEntity: [Int],$Id_Deparment: [Int],$employee: String,$startDate: Date,$endDate: Date ){
      markedEmployeesConsolidated(idEntity:$idEntity,Id_Deparment: $Id_Deparment,employee: $employee,startDate: $startDate,endDate: $endDate) {
          key
          date
          punches {
            markId
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


export const GET_REPORT_CSV_QUERY = gql`
  query markedEmployeesConsolidatedForCSV($idEntity: [Int],$Id_Deparment: [Int],$employee: String,$startDate: Date,$endDate: Date, $directDeposit: Boolean ){
    markedEmployeesConsolidatedForCSV(idEntity:$idEntity,Id_Deparment: $Id_Deparment,employee: $employee,startDate: $startDate,endDate: $endDate, directDeposit:$directDeposit)
  }
`;

export const GET_PROPERTIES_QUERY = gql`
  query hotels($Id: Int!) {
    companiesByUser(userId:$Id){
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
  query department($UserId: Int!){
    departmentsByUser(UserId:$UserId){
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
  query getbusinesscompanies($Region: Int,$Id:Int) {
      getbusinesscompanies(Id: $Id, IsActive: 1, Contract_Status: null, Id_Parent: null, Region: $Region) {
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