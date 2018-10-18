import gql from 'graphql-tag';

export const GET_WORKER_COMPENSATION_INFO = gql`
    query applications($id: Int!) {
        applications(id: $id) {
            id
            workerCompensation {
                id
                signature
                content
                date
                applicantName
            }
        }
    }
`;