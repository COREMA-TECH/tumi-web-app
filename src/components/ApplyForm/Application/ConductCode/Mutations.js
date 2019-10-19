import gql from 'graphql-tag';


export const ADD_CONDUCT_CODE = gql`
    mutation newApplicantLegalDocument($fileName: String, $html: String, $applicantLegalDocument: inputInsertApplicantLegalDocuments) {
        newApplicantLegalDocument(fileName: $fileName, html: $html, applicantLegalDocument: $applicantLegalDocument) {
            id 
        }
    }
`;

export const UPDATE_CONDUCT_CODE = gql`
    mutation updateConductCode($conductCode:  inputUpdateApplicantConductCode) {
        updateConductCode(conductCode: $conductCode) {
            id
        }
    }
`;