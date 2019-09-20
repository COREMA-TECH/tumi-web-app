import gql from 'graphql-tag';

export const INSERT_ROLES = gql`
    mutation addRol($rol: inputInsertRoles) {
        addRol(rol: $rol) {
            Id
        }
    }
`;

export const UPDATE_ROLES = gql`
    mutation updateRol($rol: inputUpdateRoles) {
        updateRol(rol: $rol) {
            Id
        }
    }
`;

export const DELETE_ROLES = gql`
    mutation deleteRol($Id: Int) {
        deleteRol(Id: $Id) {
            Id
        }
    }
`;

