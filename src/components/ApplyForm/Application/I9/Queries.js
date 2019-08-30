import gql from 'graphql-tag';


/**
 * To get basic info about the applicant
 */
/**
 * To get basic info about the applicant
 */
export const GET_APPLICANT_INFO = gql`
    query applicantI9($ApplicationId: Int!){
          applicantI9(ApplicationId: $ApplicationId){
                id
                html
                url
                fieldsData
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



