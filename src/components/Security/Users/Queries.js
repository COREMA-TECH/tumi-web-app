import gql from 'graphql-tag';

export const GET_APPLICATION_BY_EMPLOYEES = gql`
    query ApplicationEmployees($EmployeeId: Int) {
        applicationEmployees(EmployeeId: $EmployeeId) {
            Application {
                pin
                id
            }
        }
    }
`;

export const GET_USER_APPLICATION = gql`
    query userApplication($Id: Int){
        userApplication(Id: $Id){
            id
            firstName
            lastName
            emailAddress
            cellPhone
            idLanguage
        }
    }
`;

export const GET_USER_CONTACT = gql`
    query userContact($Id: Int){
        userContact(Id: $Id){
            Id
            First_Name
            Last_Name
            Electronic_Address
            Phone_Number    
        }
    }
  
`;

