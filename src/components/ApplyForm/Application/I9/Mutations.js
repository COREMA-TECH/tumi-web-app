import gql from 'graphql-tag';

/**
 * Mutation to insert anti-harassment information
 */
export const ADD_I9 = gql`
    mutation addApplicantI9($html: String, $ApplicantId: Int) {
          addApplicantI9(html: $html, ApplicationId: $ApplicantId) {
               id 
          }
    }
`;

