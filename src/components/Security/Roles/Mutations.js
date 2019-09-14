import gql from 'graphql-tag';

export const INSERT_ROLES = gql`
    mutation addRol($rol: inputInsertRoles, $regionsId: [Int]) {
        addRol(rol: $rol, regionsId: $regionsId) {
            Id
        }
    }
`;

export const UPDATE_ROLES = gql`
    mutation updateRol($rol: inputUpdateRoles, $regionsId: [Int]) {
        updateRol(rol: $rol, regionsId: $regionsId) {
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


// export const INSERT_ROLES = gql`
//     mutation insroles($input: iRoles!) {
//         insroles(input: $input) {
//             Id
//         }
//     }
// `;

// export const UPDATE_ROLES = gql`
//     mutation updroles($input: iRoles!) {
//         updroles(input: $input) {
//             Id
//         }
//     }
// `;