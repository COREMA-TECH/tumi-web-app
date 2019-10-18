import gql from 'graphql-tag';

export const GET_DOCUMENT_INFO = gql`
query lastApplicantLegalDocument($ApplicationId: Int! ) {
    lastApplicantLegalDocument(ApplicationDocumentTypeId: 19, ApplicationId: $ApplicationId) {
        id	
        fieldsData
        url
    }
    applications (id: $ApplicationId){
        firstName
        middleName
        lastName
        lastName2
    }
}
`;

export const CREATE_DOCUMENTS_PDF_QUERY = gql`
query createdocumentspdf($contentHTML:String,$Name:String) {
    createdocumentspdf(contentHTML: $contentHTML, Name: $Name) 
}
`;
