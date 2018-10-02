import gql from 'graphql-tag';

/**
 * Mutation to create application with general information
 */
export const CREATE_APPLICATION = gql`
    mutation addApplication($application: inputInsertApplication) {
        addApplication(application: $application) {
            id
        }
    }
`;

/**
 * Mutation to update a application
 */
export const UPDATE_APPLICATION = gql`
    mutation updateApplication($application: inputUpdateApplication) {
        updateApplication(application: $application) {
            id
        }
    }
`;

export const ADD_LANGUAGES = gql`
    mutation addApplicantLanguage($application: [inputInsertApplicantLanguage]) {
        addApplicantLanguage(applicantLanguage: $application) {
            id
        }
    }
`;

export const ADD_APLICANT_EDUCATION = gql`
    mutation addApplicantEducation($application: [inputInsertApplicantEducation]) {
        addApplicantEducation(applicantEducation: $application) {
            id
        }
    }
`;

export const ADD_APLICANT_PREVIOUS_EMPLOYMENT = gql`
    mutation addApplicantPreviousEmployment($application: [inputInsertApplicantPreviousEmployment]) {
        addApplicantPreviousEmployment(applicantPreviousEmployment: $application) {
            id
        }
    }
`;

export const ADD_MILITARY_SERVICES = gql`
    mutation addMilitaryService($application: [inputInsertApplicantMilitaryService]) {
        addMilitaryService(militaryService: $application) {
            id
        }
    }
`;

export const ADD_SKILL = gql`
    mutation addApplicantSkill($application: [inputInsertApplicantSkill]) {
        addApplicantSkill(applicantSkill: $application) {
            id
        }
    }
`;

