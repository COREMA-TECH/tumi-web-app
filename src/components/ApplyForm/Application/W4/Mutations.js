import gql from 'graphql-tag';

/**
 * Mutation to insert anti-harassment information
 */
export const ADD_W4 = gql`
    mutation addApplicantW4($html: String, $ApplicantId: Int, $json: String) {
          addApplicantW4(html: $html, ApplicationId: $ApplicantId, json: $json) {
               id 
          }
    }
`;