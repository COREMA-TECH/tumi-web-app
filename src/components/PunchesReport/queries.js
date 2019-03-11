import gql from 'graphql-tag';

export const GET_REPORT_QUERY = gql`
query punches{
    punches{
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