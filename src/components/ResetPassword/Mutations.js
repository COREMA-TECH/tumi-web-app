import gql from 'graphql-tag';

/**
 * Mutation to insert background check information
 */
export const UPDATE_USER_PASSWORD = gql`
    mutation upduserspassword($id: Int!, $password: String!) {
        upduserspassword(Id: $id, Password: $password) {
            Id
        }
    }
`;
