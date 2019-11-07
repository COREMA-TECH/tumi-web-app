import gql from 'graphql-tag';

export const GET_FORMS_QUERY = gql`
    query getforms {
        forms(IsActive: 1) {
            Id
            Code
            Name
            Value
            sort
            IsActive
            ParentId
            show
            Parent {
               Id
               Name
            }
        }
    }
`;
