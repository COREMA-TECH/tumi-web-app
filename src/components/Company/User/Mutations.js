import gql from 'graphql-tag';

export const INSERT_USER_QUERY = gql`
    mutation insusers($input: iUsers!) {
        insusers(input: $input) {
            Id
        }
    }
`;