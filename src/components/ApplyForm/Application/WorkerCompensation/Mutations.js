import gql from 'graphql-tag';


export const ADD_WORKER_COMPENSATION = gql`
    mutation newApplicantLegalDocument($fileName: String, $html: String, $applicantLegalDocument: inputInsertApplicantLegalDocuments) {
        newApplicantLegalDocument(fileName: $fileName, html: $html, applicantLegalDocument: $applicantLegalDocument) {
            id 
        }
    }
`;

export const UPDATE_WORKER_COMPENSATION = gql`
    mutation updateWorkerCompensation($workerCompensation: inputUpdateApplicantWorkerCompensation) {
        updateWorkerCompensation(workerCompensation: $workerCompensation) {
            id
        }
    }
`;