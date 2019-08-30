import gql from 'graphql-tag';

export const INSERT_ROLES_QUERY = gql`
    mutation insroles($input: iRoles!) {
        insroles(input: $input) {
            Id
        }
    }
`;

export const UPDATE_ROLES_QUERY = gql`
    mutation updroles($input: iRoles!) {
        updroles(input: $input) {
            Id
        }
    }
`;

export const DELETE_ROLES_QUERY = gql`
    mutation delroles($Id: Int!) {
        delroles(Id: $Id, IsActive: 0) {
            Id
        }
    }
`;