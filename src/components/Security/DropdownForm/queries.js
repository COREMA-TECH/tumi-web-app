import gql from 'graphql-tag';

/**
 * Query to get forms
 */
export const GET_FORMS_QUERY = gql`
    {
        forms( IsActive: 1){
            Id
            Code
            Name
            Value
            sort
            Parent {
               Id
               Name
            }
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

export const GET_PARENT_ITEMS = gql`
query parentNodes{
    getParentItems{
          Id
        Code
        Name
        Value
          ParentId
          Children{
          Id
          Code
          Name
          Value
        }
    }
  }
`;

export const GET_ROLE_FORMS_BY_ROLE = gql`
query rolesforms($IdRoles:Int) {    
    rolesforms(IsActive: 1, IdRoles:$IdRoles){
        Id
        IdRoles
        IdForms
        IsActive
    }
} 
`

