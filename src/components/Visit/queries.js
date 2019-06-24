import gql from 'graphql-tag';

/**
 * Query to get operation manager
 */
export const GET_OP_MANAGER = gql`
    query getUsers {
        user(IsActive: 1, Id_Roles: 3) {
            Id
            Code_User
            Full_Name
        }
    }
`;
