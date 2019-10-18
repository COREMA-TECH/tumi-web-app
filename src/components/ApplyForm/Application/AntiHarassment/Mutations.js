import gql from 'graphql-tag';


export const ADD_ANTI_HARASSMENT = gql`
    mutation newApplicantLegalDocument($fileName: String, $html: String, $applicantLegalDocument: inputInsertApplicantLegalDocuments) {
        newApplicantLegalDocument(fileName: $fileName, html: $html, applicantLegalDocument: $applicantLegalDocument) {
            id 
        }
    }
`;

export const UPDATE_ANTI_HARASSMENT = gql`
    mutation updateHarassmentPolicy($harassmentPolicy: inputUpdateApplicantHarassmentPolicy) {
        updateHarassmentPolicy(harassmentPolicy: $harassmentPolicy) {
            id
        }
    }
`;