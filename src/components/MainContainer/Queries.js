import gql from 'graphql-tag';

export const GET_ROLES_FORMS = gql`
query rolesforms {
           rolesforms{
            Id
            IdRoles
            IdForms
            IsActive
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