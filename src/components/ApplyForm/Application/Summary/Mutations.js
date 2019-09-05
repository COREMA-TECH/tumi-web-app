import gql from 'graphql-tag';

/**
 * Mutation to insert non-disclosure information
 */
export const ADD_NON_DISCLOSURE = gql`
    mutation addDisclosure($disclosures: [inputInsertApplicantDisclosure]) {
        addDisclosure(disclosures: $disclosures) {
            id
        }
    }
`;

export const UPDATE_PDF_URL_SUMMARY = gql`
    mutation updatePdfUrlSummary($id: Int, $pdfUrl: String) {
        updatePdfUrlSummary(id: $id, pdfUrl: $pdfUrl) {
            id
        }
    }
`;