import gql from 'graphql-tag';

export const INSERT_USER_QUERY = gql`
    mutation createUser($input: inputInsertUser) {
        createUser(user: $input) {
            Id
        }
    }
`;

export const UPDATE_USER_QUERY = gql`
    mutation udpdateUser($input: inputUpdateUser) {
        udpdateUser(user: $input) {
            Id
        }
    }
`;