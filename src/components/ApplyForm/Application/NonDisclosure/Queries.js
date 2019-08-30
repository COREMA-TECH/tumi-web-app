import gql from 'graphql-tag';

export const GET_DISCLOSURE_INFO = gql`
    query applications($id: Int!) {
        applications(id: $id) {
            id
            disclosure {
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
