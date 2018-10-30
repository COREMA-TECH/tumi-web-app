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
            Value01
        }
    }
`;
