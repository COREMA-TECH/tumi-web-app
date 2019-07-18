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