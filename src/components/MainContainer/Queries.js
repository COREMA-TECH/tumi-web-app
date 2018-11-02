import gql from 'graphql-tag';

export const GET_ROLES_FORMS = gql`
    {
        getrolesforms {
            Id
            IdRoles
            IdForms
        }
    }
`;

/**
 * Query to get forms
 */
export const GET_FORMS_QUERY = gql`
    {
        getforms(Id: null, IsActive: 1){
            Value
        }
    }
`;