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
                applicantCity
                applicantState
                applicantAddress
                applicantZipCode
                injuryNotification
                initialNotification
                injuryDate
                pdfUrl
            }
        }
    }
`;

/**
 * Query to get states
 */
export const GET_STATE_NAME = gql`
    query States($id: Int!, $parent: Int!) {
        getcatalogitem(Id: $id, IsActive: 1, Id_Parent: $parent, Id_Catalog: 3) {
            Name
        }
    }
`;

/**
 * Query to get cities
 */
export const GET_CITY_NAME = gql`
    query Cities($id: Int!, $parent: Int!) {
        getcatalogitem(Id: $id, IsActive: 1, Id_Parent: $parent, Id_Catalog: 5) {
            Name
        }
    }
`;

export const CREATE_DOCUMENTS_PDF_QUERY = gql`
query createdocumentspdf($contentHTML:String,$Name:String) {
    createdocumentspdf(contentHTML: $contentHTML, Name: $Name) 
}
`;
