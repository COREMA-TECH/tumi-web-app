import gql from 'graphql-tag';

/**
 * Query to get forms
 */
export const GET_FORMS_QUERY = gql`
    {
        getforms(Id: null, IsActive: 1){
            Id
            Code
            Name
            Value
        }
    }
`;

/**
 * Query to get rol with forms
 */
export const GET_ROL_FORMS_QUERY = gql`
    {
        rolesforms(IsActive: 1){
            Id
            IdRoles
            IdForms
            IsActive
        }
    }
`;

