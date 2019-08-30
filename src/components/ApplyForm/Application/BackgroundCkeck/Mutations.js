import gql from 'graphql-tag';

/**
 * Mutation to insert background check information
 */
export const ADD_BACKGROUND_CHECK = gql`
    mutation addBackgroundCheck($backgroundCheck: [inputInsertApplicantBackgroundCheck]) {
        addBackgroundCheck(backgroundCheck: $backgroundCheck) {
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