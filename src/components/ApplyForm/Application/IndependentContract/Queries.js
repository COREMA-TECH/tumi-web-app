import gql from 'graphql-tag';


/**
 * To get basic info about the applicant
 */
export const GET_APPLICANT_INFO = gql`
      query applicantIndependentContract($ApplicationId: Int!){
          applicantIndependentContract(ApplicationId: $ApplicationId){
                id
                html
                application{                  
                  firstName
                  lastName
                }
          }
    }
`;

export const CREATE_DOCUMENTS_PDF_QUERY = gql`
query createdocumentspdf($contentHTML:String,$Name:String) {
    createdocumentspdf(contentHTML: $contentHTML, Name: $Name) 
}
`;



