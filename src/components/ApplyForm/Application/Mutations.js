import gql from 'graphql-tag';

export const UPDATE_USER_INFO = gql`
    mutation udpdateUser($user: inputUpdateUser) {
        udpdateUser(user: $user) {
            Id
        }
    }
`;