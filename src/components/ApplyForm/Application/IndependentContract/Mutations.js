import gql from 'graphql-tag';

/**
 * Mutation to insert independent contract information
 */
export const ADD_INDEPENDENT_CONTRACT = gql`
    mutation addApplicantIndependentContract($html: String, $ApplicantId: Int) {
          addApplicantIndependentContract(html: $html, ApplicationId: $ApplicantId) {
               id 
          }
    }
`;