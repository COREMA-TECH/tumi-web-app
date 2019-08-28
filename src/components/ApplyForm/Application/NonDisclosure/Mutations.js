import gql from 'graphql-tag';

/**
 * Mutation to insert non-disclosure information
 */
export const ADD_NON_DISCLOSURE = gql`
    mutation addDisclosure($disclosures: [inputInsertApplicantDisclosure]) {
        addDisclosure(disclosures: $disclosures) {
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