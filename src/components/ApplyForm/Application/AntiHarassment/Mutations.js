import gql from 'graphql-tag';

/**
 * Mutation to insert anti-harassment information
 */
export const ADD_ANTI_HARASSMENT = gql`
    mutation addHarassmentPolicy($harassmentPolicy: [inputInsertApplicantHarassmentPolicy]) {
        addHarassmentPolicy(harassmentPolicy: $harassmentPolicy) {
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