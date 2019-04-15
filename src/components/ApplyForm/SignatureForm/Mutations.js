import gql from 'graphql-tag';

/**
 * Mutation to insert signature in a application
 */
export const ADD_SIGNATURE = gql`
    mutation addSignature($id: Int!, $signature: String!) {
        addSignature(id: $id, signature: $signature) {
            id
        }
    }
`;