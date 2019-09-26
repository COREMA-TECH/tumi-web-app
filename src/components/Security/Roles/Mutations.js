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

export const ADD_FEATURE = gql`
    mutation addFeature($features: [inputInsertFeatureType]) {
        addFeature(features: $features) {
            id
        }
    }
`;

export const DELETE_FEATURE = gql`
    mutation deleteFeature($RoleId: Int, $code: String) {
        deleteFeature(RoleId: $RoleId, code: $code)
    }
`;

