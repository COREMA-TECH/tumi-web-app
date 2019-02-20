import gql from 'graphql-tag';

/**
 * Query to get cities
 */
export const GET_COMPLETED_STATUS = gql`
    query applicationCompleted($id: Int!) {
        applicationCompleted (id: $id)
    }
`;