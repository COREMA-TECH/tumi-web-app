import gql from 'graphql-tag';

/**
 * Mutation to create application with general information
 */
export const CREATE_APPLICATION = gql`
    mutation addApplication($application: inputInsertApplication, $codeuser: Int, $nameUser: String) {
        addApplication(application: $application, codeuser: $codeuser, nameUser: $nameUser) {
            id
        }
    }
`;

/**
 * Mutation to update a application
 */
export const UPDATE_APPLICATION = gql`
	mutation updateApplication($application: inputUpdateApplication, $codeuser: Int, $nameUser: String) {
		updateApplication(application: $application, codeuser: $codeuser, nameUser: $nameUser) {
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
export const UPDATE_APLICANT_PREVIOUS_EMPLOYMENT = gql`
    mutation updateApplicantPreviousEmployment($application: inputUpdateApplicantPreviousEmployment) {
        updateApplicantPreviousEmployment(applicantPreviousEmployment: $application) {
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

export const UPDATE_MILITARY_SERVICES = gql`
    mutation updateMilitaryService($application: inputUpdateApplicantMilitaryService) {
        updateMilitaryService(militaryService: $application) {
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



export const REMOVE_APPLICANT_EDUCATION = gql`
    mutation deleteApplicantEducation($id: [Int]){
        deleteApplicantEducation(id: $id)
    }
`;


export const REMOVE_APPLICANT_LANGUAGE = gql`
    mutation deleteApplicantLanguange($id: [Int]){
        deleteApplicantLanguange(id: $id)
    }
`;

export const REMOVE_APPLICANT_PREVIOUS_EMPLOYMENT = gql`
    mutation deleteApplicantPreviousEmployment($id: [Int]){
        deleteApplicantPreviousEmployment(id: $id)
    }
`;

export const REMOVE_APPLICANT_SKILL = gql`
    mutation deleteApplicantSkill($id: [Int]){
        deleteApplicantSkill(id: $id)
    }
`;


