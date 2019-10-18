import gql from 'graphql-tag';

/**
 * Mutation to insert non-disclosure information
 */
export const ADD_NON_DISCLOSURE = gql`
    mutation newApplicantLegalDocument($fileName: String, $html: String, $applicantLegalDocument: inputInsertApplicantLegalDocuments) {
        newApplicantLegalDocument(fileName: $fileName, html: $html, applicantLegalDocument: $applicantLegalDocument) {
            id 
        }
    }
`;

export const UPDATE_NON_DISCLOSURE = gql`
    mutation updateDisclosure($disclosure: inputUpdateApplicantDisclosure) {
        updateDisclosure(disclosure: $disclosure) {
            id
        }
    }
`;