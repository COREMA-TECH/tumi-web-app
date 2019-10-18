import gql from 'graphql-tag';

export const GET_DOCUMENT_TYPE = gql`
    query applicationDocumentTypes($name: String) {
        applicationDocumentTypes(name: $name) {
            id
            name
            description
        }
    }
`;


export const GET_WORKER_COMPENSATION_INFO = gql`
    query lastApplicantLegalDocument($ApplicationId: Int!, $ApplicationDocumentTypeId: Int!) {
        lastApplicantLegalDocument(ApplicationDocumentTypeId: $ApplicationDocumentTypeId, ApplicationId: $ApplicationId) {
            id
            fieldsData
            url
            completed
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
