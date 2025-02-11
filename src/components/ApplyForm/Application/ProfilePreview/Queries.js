import gql from 'graphql-tag';

export const GET_APPLICATION_PROFILE_INFO = gql`
    query applications($id: Int!) {
        applications(id: $id) {
            id
			firstName
			middleName
			lastName
			socialSecurityNumber
            emailAddress
            cellPhone
            isLead
            Urlphoto
            directDeposit
            isActive
            employmentType
            position{
                id
                position {
                    Position
                }
				BusinessCompany {
                    Id
                    Code
                }
            }
            employee {       
                id       
                EmployeeId
                Employees       
                {         
                    id                     
                    idUsers         
                    idEntity    
                    hireDate   
                    startDate
                    BusinessCompany{
                        Name
                    } 
                }     
            }   
            idealJobs {
                id
                description
                idPosition
                isDefault
            }
            user{
                Code_User
              }
        }
    }
`;


export const GET_DEPARTMENTS_QUERY = gql`
query getcatalogitem ($Id_Entity:Int){
        getcatalogitem(IsActive: 1, Id_Catalog: 8, Id_Entity: $Id_Entity ) {
            Id
            Name: DisplayLabel
            IsActive
        }
    }
`;

export const GET_APPLICATION_EMPLOYEES_QUERY = gql`
query ApplicationEmployees($ApplicationId: Int)
{
  applicationEmployees(ApplicationId: $ApplicationId){
Employees
    {
      Id_Deparment
      Deparment
      {
        DisplayLabel
      }
      
    }
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
    query getcatalogitem($Id_Entity: Int){
        getcatalogitem(IsActive: 1, Id_Catalog: 6, Id_Entity:$Id_Entity) {
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
            Code
            Name
        }
    }
`;


export const GET_CONTACTS_IN_USER_DIALOG = gql`
    {
        getsupervisor(IsActive: 1, Id_Entity: 0, Id: 0) {
            Id
            Name: Full_Name
            Electronic_Address
            Phone_Number
        }
        getcatalogitem(Id_Catalog: 4) {
            Id
            Name
            DisplayLabel
        }
    }
`;

export const GET_ROLES_QUERY = gql`
    {
        getroles(IsActive: 1) {
            Id
            Name: Description
        }
    }
`;

export const GET_LANGUAGES_QUERY = gql`
    {
        getcatalogitem(IsActive: 1, Id_Catalog: 9) {
            Id
            Name
            IsActive
        }
    }
`;

export const GET_EMAILS_USER = gql`
    {
        getusers {
            Electronic_Address
        }
    }
`;

export const GET_CONTACTS_BY_APP_HOTEL_QUERY = gql`
    query contacts($ApplicationId: Int, $Id_Entity: [Int]){
    contacts(ApplicationId:$ApplicationId,Id_Entity:$Id_Entity, IsActive:1){
        Id
        Id_Entity
    }
    }
`;

export const GET_HOTELS_BY_APPLICATION_QUERY = gql`
    query companiesByApplications($id: Int){
            companiesByApplications(id:$id){
            Id
            Code
            Name
        }
    }
`;

export const GET_ACTIVE_EMPLOYEES_BY_MARKS = gql`
    query($employeeId: Int){
        activeEmployeesByMarks(EmployeeId: $employeeId){
            id
        }
    }
`;

export const GET_POSITION = gql`
  query getPositions($Id_Entity: Int){
        catalogitem(IsActive: 1, Id_Catalog: 6,  Id_Entity:  $Id_Entity) {
            Id
            Code: Name
            Description
            Id_Entity
            IsActive
        }
    }
`;

export const GET_APPLICATION_CODE_USER = gql`
    query applicationCodeUser($id: Int!) {
        applicationCodeUser(id: $id) {
            id
            Code_User
        }
    }
`;

export const GET_HOTELS_BY_EMPLOYEE = gql`
    query EmployeeByHotels($EmployeeId: Int){
        EmployeeByHotels(EmployeeId: $EmployeeId){
            id    
            BusinessCompany{
                Id
                Name
            }
            isDefault
            isActive
        }
    } 
`;
