import gql from 'graphql-tag';

/**
 * Mutation to insert background check information
 */
export const UPDATE_USER_PASSWORD = gql`
    mutation updatePassword($Code_User: String!) {
        updatePassword(Code_User: $Code_User) {
            Id
        }
    }
`;
