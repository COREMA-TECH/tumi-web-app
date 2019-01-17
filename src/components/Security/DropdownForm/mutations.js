import gql from 'graphql-tag';

/**
 * Mutation to insert rolforms
 */
export const INSERT_ROL_FORM = gql`
    mutation addRolesforms($rolesforms: [inputInsertRolesForms]) {
        addRolesforms(rolesforms: $rolesforms) {
            Id
        }
    }
`;

/**
 * Mutation to update rolforms
 */
export const UPDATE_ROL_FORM = gql`
    mutation updateRolesforms($rolesforms: inputUpdateRolesForms) {
        updateRolesforms(rolesforms: $rolesforms) {
            Id
        }
    }
`;

