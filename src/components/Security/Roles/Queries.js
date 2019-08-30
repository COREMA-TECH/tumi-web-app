import gql from 'graphql-tag';

export const GET_FORMS_QUERY = gql`
    query getforms {
        getforms(IsActive: 1) {
            Id
            Code
            Name
            Value
            Value01
            Value02
            Value03
            Value04
            IsActive
        }
    }
`;