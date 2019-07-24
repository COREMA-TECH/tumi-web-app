import gql from 'graphql-tag';

export const INSERT_USER_QUERY = gql`
    mutation insusers($input: inputInsertUser, $idEmployee: Int) {
        addUser(user: $input, idEmployee: $idEmployee) {
            Id
            Code_User
            Electronic_Address
        }
    }
`;

export const UPDATE_USER_QUERY = gql`
    mutation updateuser($input: inputUpdateUser) {
        udpdateUser(user: $input) {
            Id
            Code_User
            Electronic_Address
        }
    }
`;

export const CREATE_USER_BASED_ON_APPLICATION_QUERY = gql`
    mutation addUserForApplication($input: inputInsertUser, $applicationId: Int) {
        addUserForApplication(user: $input, applicationId: $applicationId) {
            Id
            Code_User
            Electronic_Address
        }
    }
`;