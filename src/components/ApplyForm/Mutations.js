import gql from 'graphql-tag';

/**
 * Mutation to create application with general information
 */
const CREATE_APPLICATION = gql`
    mutation addApplication($application: inputInsertApplication) {
        addApplication(application: $application) {
            id
        }
    }
`;


/**
 * Mutation to insert skills
 */
// const ADD_LANGUAGES = gql`
//     mutation addApplicantLanguage(
//         $applicantLanguage
//     ) {
//         addApplicantLanguage(
//             applicantLanguage: $applicantLanguage
//         ) {
//             id
//         }
//     }
// `;

export {
    CREATE_APPLICATION
}
