import gql from 'graphql-tag';

/**
 * Mutation to insert non-disclosure information
 */
export const ADD_DOCUMENT = gql`
    mutation addApplicantLegalDocuments ($applicantLegalDocuments: [inputInsertApplicantLegalDocuments]){
        addApplicantLegalDocuments(applicantLegalDocuments: $applicantLegalDocuments){
            id	
        }
    }
`;

export const UPDATE_DOCUMENT = gql`
    mutation updateApplicantLegalDocument ($applicantLegalDocument: inputUpdateApplicantLegalDocuments){
        updateApplicantLegalDocument(applicantLegalDocument: $applicantLegalDocument){
            id	
        }
    }
`;