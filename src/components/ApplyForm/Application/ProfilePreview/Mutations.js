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



export const ADD_EMPLOYEES = gql`
    mutation addEmployees($Employees: [inputInsertEmployees]) {
        addEmployees(Employees: $Employees) {
            id
        }
    }
`;

export const INSERT_CONTACT = gql`
    mutation inscontacts($input: iParamC!) {
        inscontacts(input: $input) {
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