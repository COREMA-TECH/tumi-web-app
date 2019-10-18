import gql from 'graphql-tag';


/**
 * To get basic info about the applicant
 */
// export const GET_APPLICANT_INFO = gql`
//     query applicantW4($ApplicationId: Int!){
//           applicantW4(ApplicationId: $ApplicationId){
//                 id
//                 html
//                 url
//                 fieldsData
//           }
//     }
// `;

export const GET_DOCUMENT_TYPE = gql`
    query applicationDocumentTypes($name: String) {
        applicationDocumentTypes(name: $name) {
            id
            name
            description
        }
    }
`;

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

export const CREATE_DOCUMENTS_PDF_QUERY = gql`
query createdocumentspdf($contentHTML:String,$Name:String) {
    createdocumentspdf(contentHTML: $contentHTML, Name: $Name) 
}
`;



