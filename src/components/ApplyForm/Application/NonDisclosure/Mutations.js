import gql from 'graphql-tag';

/**
 * Mutation to insert non-disclosure check information
 */
export const ADD_NON_DISCLOSURE = gql`
    mutation addDisclosure($disclosures: [ApplicantDisclosureType]) {
        addDisclosure(disclosures: $disclosures) {
            id
        }
    }
`;