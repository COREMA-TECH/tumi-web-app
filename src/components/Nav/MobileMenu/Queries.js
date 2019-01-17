import gql from 'graphql-tag';

export const GET_ROLES_FORMS = gql`
query rolesforms($IdRoles: Int)
{
  rolesforms(IdRoles:$IdRoles, IsActive: 1){
            Id
            IdRoles
            IdForms
            IsActive
    Roles
    {Description}
    Forms
    {Name
    Value}

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