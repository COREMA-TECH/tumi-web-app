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
    query getforms($Id: Int){
        getforms(Id: $Id, IsActive: 1){
            Value
        }
    }
`;

export const GET_ROLES = gql`
    query roles($id: Int) {
        roles(Id: $id) {
            Id
            Description
            default_form_id
        }
    }
`;