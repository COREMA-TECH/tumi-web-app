import gql from 'graphql-tag';

/**
 * Mutation to insert rolforms
 */
export const INSERT_ROL_FORM = gql`
    mutation insrolesforms($input: iRolesForms) {
        insrolesforms(input: $input) {
            Id
        }
    }
`;

/**
 * Mutation to update rolforms
 */
export const UPDATE_ROL_FORM = gql`
    mutation updrolesforms($input: iRolesForms) {
        updrolesforms(input: $input) {
            Id
        }
    }
`;

