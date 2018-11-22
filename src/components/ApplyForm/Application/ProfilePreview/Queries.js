import gql from 'graphql-tag';

export const GET_APPLICATION_PROFILE_INFO = gql`
    query applications($id: Int!) {
        applications(id: $id) {
            id
            firstName
            lastName
            isActive
            position {
                Id
                Name
            }
        }
    }
`;