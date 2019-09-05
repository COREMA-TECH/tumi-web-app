import gql from 'graphql-tag';

export const CREATE_DOCUMENTS_PDF_QUERY = gql`
    query createdocumentspdf($contentHTML:String,$Name:String) {
        createdocumentspdf(contentHTML: $contentHTML, Name: $Name) 
    }
`;
