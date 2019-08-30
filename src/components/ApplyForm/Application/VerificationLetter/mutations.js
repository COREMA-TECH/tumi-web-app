import gql from 'graphql-tag';

export const CREATE_RECORD = gql `
    mutation addApplicantVerificationLetter($html: String!,$ApplicationId: Int!, $email: String!){
        addApplicantVerificationLetter(html: $html,ApplicationId: $ApplicationId,email: $email) 
    }
`; 