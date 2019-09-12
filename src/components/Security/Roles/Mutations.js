import gql from 'graphql-tag';

export const INSERT_ROLES = gql`
    mutation insroles($input: iRoles!) {
        insroles(input: $input) {
            Id
        }
    }
`;

export const UPDATE_ROLES = gql`
    mutation updroles($input: iRoles!) {
        updroles(input: $input) {
            Id
        }
    }
`;