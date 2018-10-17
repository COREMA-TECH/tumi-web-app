import gql from 'graphql-tag';

export const GET_APPLICANT_INFO = gql`
    query applications($id: Int!) {
        applications(id: $id) {
            id
            firstName
            middleName
            lastName
        }
    }
`;