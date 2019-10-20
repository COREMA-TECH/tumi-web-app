import gql from 'graphql-tag';

export const CREATE_DOCUMENTS_PDF_QUERY = gql`
    query createdocumentspdf($contentHTML:String,$Name:String) {
        createdocumentspdf(contentHTML: $contentHTML, Name: $Name) 
    }
`;


export const GET_APPLICANT_INFO = gql`
    query applications($id: Int!) {
        applications(id: $id) {
            id
            firstName
            middleName
            lastName
            streetAddress
            city
            state
            zipCode
        }
    }
`;

export const GET_DOCUMENT_INFO = gql`
    query lastApplicantLegalDocument($ApplicationId: Int! ) {
        lastApplicantLegalDocument(ApplicationDocumentTypeId: 21, ApplicationId: $ApplicationId) {
            id	
            fieldsData
            url
        }
    }
`;