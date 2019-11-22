import gql from 'graphql-tag';

export const DELETE_APPLICATION_QUERY = gql`
    mutation disableApplication($id: Int!, $isActive: Boolean) {
        disableApplication(id: $id,isActive: $isActive) {
            id
            isActive
        }
    }
`;