import gql from 'graphql-tag';

export const INSERT_CONTACT = gql`
    mutation inscatalogitem($input: iParamCI!) {
        inscatalogitem(input: $input) {
            Id
        }
    }
`;