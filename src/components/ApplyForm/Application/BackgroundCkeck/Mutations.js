import gql from 'graphql-tag';

export const ADD_BACKGROUND_CHECK = gql`
    mutation newApplicantLegalDocument($fileName: String, $html: String, $applicantLegalDocument: inputInsertApplicantLegalDocuments) {
        newApplicantLegalDocument(fileName: $fileName, html: $html, applicantLegalDocument: $applicantLegalDocument) {
            id 
        }
    }
`;

/**
 * Mutation to update background check information
 */
export const UPDATE_BACKGROUND_CHECK = gql`
    mutation updateBackgroundCheck($backgroundCheck: inputUpdateApplicantBackgroundCheck) {
        updateBackgroundCheck(backgroundCheck: $backgroundCheck) {
            id
        }
    }
`;