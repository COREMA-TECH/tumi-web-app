import gql from 'graphql-tag';

export const ADD_DOCUMENT = gql`
    mutation addApplicantLegalDocuments ($applicantLegalDocuments: [inputInsertApplicantLegalDocuments]){
        addApplicantLegalDocuments(applicantLegalDocuments: $applicantLegalDocuments){
            id	
        }
    }
`;