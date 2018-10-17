import gql from 'graphql-tag';

export const GET_DISCLOSURE_INFO = gql`
    query applications($id: Int!) {
        applications(id: $id) {
            id
            disclosure {
                id
                signature
                content
                date
                applicantName
            }
        }
    }
`;