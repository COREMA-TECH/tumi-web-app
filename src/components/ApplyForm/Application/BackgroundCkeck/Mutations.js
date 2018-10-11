import gql from 'graphql-tag';

/**
 * Mutation to create application with general information
 */
export const ADD_BACKGROUND_CHECK = gql`
    mutation addBackgroundCheck($backgroundCheck: [inputInsertApplicantBackgroundCheck]) {
        addBackgroundCheck(backgroundCheck: $backgroundCheck) {
            id
        }
    }
`;