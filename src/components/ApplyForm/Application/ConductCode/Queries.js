import gql from 'graphql-tag';


/**
 * To get basic info about the applicant
 */
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


export const GET_CONDUCT_CODE_INFO = gql`
    query applications($id: Int!) {
        applications(id: $id) {
            id
            conductCode {
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


