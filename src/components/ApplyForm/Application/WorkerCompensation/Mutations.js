import gql from 'graphql-tag';

/**
 * Mutation to insert worker compensation information
 */
export const ADD_WORKER_COMPENSATION = gql`
    mutation addWorkerCompensation($workerCompensation:  [inputInsertApplicantWorkerCompensation]) {
        addWorkerCompensation(workerCompensation: $workerCompensation) {
            id
        }
    }
`;