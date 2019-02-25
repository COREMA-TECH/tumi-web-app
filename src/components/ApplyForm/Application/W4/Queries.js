import gql from 'graphql-tag';


/**
 * To get basic info about the applicant
 */
export const GET_APPLICANT_INFO = gql`
    query applicantW4($ApplicationId: Int!){
          applicantW4(ApplicationId: $ApplicationId){
                id
          }
    }
`;

export const CREATE_DOCUMENTS_PDF_QUERY = gql`
query createdocumentspdf($contentHTML:String,$Name:String) {
    createdocumentspdf(contentHTML: $contentHTML, Name: $Name) 
}
`;



