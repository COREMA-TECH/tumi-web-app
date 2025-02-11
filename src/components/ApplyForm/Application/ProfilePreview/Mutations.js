import gql from 'graphql-tag';

export const INSERT_DEPARTMENT = gql`
    mutation inscatalogitem($input: iParamCI!) {
        inscatalogitem(input: $input) {
            Id
        }
    }
`;

export const UPDATE_APPLICANT = gql`
	mutation updateApplicationConvertLead($id: Int,$isLead: Boolean,$idRecruiter: Int, $idWorkOrder : Int) {
		updateApplicationConvertLead(id: $id,isLead: $isLead, idRecruiter:$idRecruiter, idWorkOrder:$idWorkOrder) {
			id
		}
	}
`;

export const UPDATE_EMPLOYEE = gql`
	mutation updateEmployees($employees:inputUpdateEmployees ){
        updateEmployees(employees:$employees){
            id
            firstName
        }
    }
`;

export const UPDATE_DIRECT_DEPOSIT = gql`
	mutation updateDirectDeposit($id: Int,$directDeposit: Boolean) {
		updateDirectDeposit(id: $id,directDeposit: $directDeposit) {
			id
		}
	}
`;

export const UPDATE_ISACTIVE = gql`
	mutation disableApplication($id: Int,$isActive: Boolean) {
		disableApplication(id: $id,isActive: $isActive) {
			id
		}
	}
`;

export const ADD_EMPLOYEES = gql`
    mutation addEmployees($Employees: [inputInsertEmployees]) {
        addEmployees(Employees: $Employees) {
            id
        }
    }
`;

export const INSERT_CONTACT = gql`
    mutation addContacts($contacts: [inputContact]) {
        addContacts(contacts: $contacts) {
            Id
        }
    }
`;

export const UDPATE_PROFILE_PICTURE = gql`
    mutation updateUrlphoto($id: Int!, $url: String!) {
        updateUrlphoto(id:$id,Urlphoto:$url){
            id
            idLanguage
            Urlphoto
          }
    }
`;

export const DISABLE_CONTACT_BY_HOTEL_APPLICATION = gql`
    mutation disableContactByHotel_Application($Id_Entity: Int!, $ApplicationId: Int!) {
        disableContactByHotel_Application(Id_Entity:$Id_Entity,ApplicationId:$ApplicationId){
           Id
          }
    }
`;

export const ADD_IDEAL_JOB = gql`
    mutation addApplicantIdealJob($application:  [inputInsertApplicantIdealJob]) {
        addApplicantIdealJob(applicantIdealJob: $application) {
            id
        }
    }
`;

export const CREATE_UPDATE_EMPLOYEE_HOTEL_RELATION = gql`
    mutation addEmployeeByHotel($employeeByHotels: [inputInsertEmployeeByHotel], $relationList: [inputUpdateEmployeeByHotel]) {
        addEmployeeByHotel(employeeByHotels: $employeeByHotels) {
            id
        }
        bulkUpdateEmployeeByHotel(relationList: $relationList)
    }
`;

export const UPDATE_EMPLOYEE_HOTEL_RELATION = gql`
    mutation updateEmployeeByHotel($employeeByHotel: inputUpdateEmployeeByHotel) {
        updateEmployeeByHotel(employeeByHotel: $employeeByHotel) {
            id
        }
    }
`;

export const SET_IDEAL_JOB_DEFAULT = gql`
    mutation setDefaultApplicantIdealJob($id: Int) {
        setDefaultApplicantIdealJob(id: $id) {
            id
        }
    }
`;

export const BULK_UPDATE_EMPLOYEE_HOTEL_RELATION = gql`
    mutation bulkUpdateEmployeeByHotel($relationList: [inputUpdateEmployeeByHotel]){
        bulkUpdateEmployeeByHotel(relationList: $relationList)
    }
`;

export const CREATE_EMPLOYEE_FOR_APPLICATION = gql`
    mutation createEmployeeBasedOnApplicationOrUpdateEmployee($codeuser: Int, $nameUser: String, $id: Int, $hireDate: String, $startDate: String,$ApplicationId: Int){
        createEmployeeBasedOnApplicationOrUpdateEmployee(id: $id, hireDate: $hireDate, startDate: $startDate, ApplicationId: $ApplicationId,codeuser: $codeuser, nameUser: $nameUser){
            id
        }
    }
`;