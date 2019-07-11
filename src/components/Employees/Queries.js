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
            hireDate
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

export const SEND_EMAIL = gql`
    query sendemail($username: String,$password: String,$email: String,$title:String) {
        sendemail(username:$username,password:$password,email:$email,title:$title)
    }
`;

export const GET_APPLICATION_EMPLOYEES = gql`
query employeepackage($EmployeeId: Int){
    applicationEmployees (EmployeeId:$EmployeeId)
    {
      EmployeeId
      ApplicationId
    }
  }
`;

export const GET_VALIDATE_EMPLOYEE_UNIQUENESS = gql`
    query validateEmployeeUniqueness($employees: [inputEmployeeUniquenessType]) {
        validateEmployeeUniqueness(employees: $employees) {
            id
            firstName
            lastName
            mobileNumber
            isUnique   
            index 
        }
    }
`;