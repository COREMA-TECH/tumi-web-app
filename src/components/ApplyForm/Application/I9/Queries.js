import gql from 'graphql-tag';



export const GET_APPLICANT_INFO = gql`
    query lastApplicantLegalDocument($ApplicationId: Int!, $ApplicationDocumentTypeId: Int!) {
        lastApplicantLegalDocument(ApplicationDocumentTypeId: $ApplicationDocumentTypeId, ApplicationId: $ApplicationId) {
            id
            fieldsData
            url
            completed
        }
    }
`;

export const GET_DOCUMENT_TYPE = gql`
    query applicationDocumentTypes($name: String) {
        applicationDocumentTypes(name: $name) {
            id
            name
            description
        }
    }
`;


export const GET_ANTI_HARRASMENT_INFO = gql`
    query applications($id: Int!) {
        applications(id: $id) {
            id
            harassmentPolicy {
                id
                signature
                content
                date
                applicantName
            }
        }
    }
`;

export const CREATE_DOCUMENTS_PDF_QUERY = gql`
query createdocumentspdf($contentHTML:String,$Name:String) {
    createdocumentspdf(contentHTML: $contentHTML, Name: $Name) 
}
`;



