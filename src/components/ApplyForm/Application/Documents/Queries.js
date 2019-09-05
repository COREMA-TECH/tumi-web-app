import gql from 'graphql-tag';

export const GET_APPLICATION_STATUS = gql`
    query applicationCompletedData($id: Int!) {
        applicationCompletedData (id:$id) {
            ApplicantBackgroundCheck
            ApplicantDisclosure
            ApplicantConductCode
            ApplicantHarassmentPolicy
            ApplicantWorkerCompensation
            ApplicantW4
            ApplicantI9
        }
    }
`;

export const GET_MERGED_DOCUMENT = gql`
    query pdfMergeQuery($applicationId: Int!) {
        pdfMergeQuery (applicationId:$applicationId)
    }
`;
