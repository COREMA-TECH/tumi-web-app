import gql from 'graphql-tag';

/**
 * Mutation to insert non-disclosure check information
 */
export const ADD_WORKER_COMPENSATION = gql`
    mutation addWorkerCompensation($workerCompensation:  [inputInsertApplicantWorkerCompensation]) {
        addWorkerCompensation(workerCompensation: $workerCompensation) {
            id
        }
    }
`;