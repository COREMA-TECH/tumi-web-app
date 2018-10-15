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