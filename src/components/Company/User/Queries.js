import gql from 'graphql-tag';

export const GET_COMPANY_QUERY = gql`
    query getCompany($id: Int!) {
        getbusinesscompanies(Id: $id, IsActive: 1, Contract_Status: "'C'") {
            Id
            Code
            Code01
            Id_Company
            BusinessType
            Name
            Rooms
            Description
            Start_Week
            End_Week
            Start_Date
            Legal_Name
            Region
            Country
            State
            Zipcode
            Fax
            City
            Id_Parent
            IsActive
            User_Created
            User_Updated
            Date_Created
            Date_Updated
            ImageURL
            Rate
            Location
            Location01
            Primary_Email
            Phone_Number
            Suite
            Contract_URL
            Contract_File
            Insurance_URL
            Insurance_File
            Other_URL
            Other_Name
            Other_File
            Other01_URL
            Other01_Name
            Other01_File
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