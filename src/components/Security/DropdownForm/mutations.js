import gql from 'graphql-tag';

/**
 * Query to get forms
 */
/**
 * Mutation to create application with general information
 */
export const INSERT_ROL_FORM = gql`
    mutation insrolesforms($input: iRolesForms) {
        insrolesforms(input: $input) {
            Id
        }
    }
`;
