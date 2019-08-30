import gql from 'graphql-tag';

/**
 * Mutation to create application with general information
 */
export const CREATE_APPLICATION = gql`
	mutation addApplication($application: inputInsertApplication,  $codeuser: Int, $nameUser: String) {
		addApplication(application: $application,  codeuser: $codeuser, nameUser: $nameUser) {
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

export const UPDATE_APLICANT_EDUCATION = gql`
	mutation updateApplicantEducation($application: inputUpdateApplicantEducation) {
		updateApplicantEducation(applicantEducation: $application) {
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
	mutation deleteApplicantEducation($id: [Int]) {
		deleteApplicantEducation(id: $id)
	}
`;

export const REMOVE_APPLICANT_LANGUAGE = gql`
	mutation deleteApplicantLanguange($id: [Int]) {
		deleteApplicantLanguange(id: $id)
	}
`;

export const REMOVE_APPLICANT_PREVIOUS_EMPLOYMENT = gql`
	mutation deleteApplicantPreviousEmployment($id: [Int]) {
		deleteApplicantPreviousEmployment(id: $id)
	}
`;

export const REMOVE_APPLICANT_SKILL = gql`
	mutation deleteApplicantSkill($id: [Int]) {
		deleteApplicantSkill(id: $id)
	}
`;

export const REMOVE_APPLICANT_DOCUMENT = gql`
	mutation deleteApplicantDocument($id: [Int]) {
		deleteApplicantDocument(id: $id)
	}
`;

export const ADD_APPLICANT_DOCUMENT = gql`
	mutation addApplicantDocument($documents: [inputInsertApplicantDocument]) {
		addApplicantDocument(documents: $documents) {
			id
		}
	}
`;

export const UPDATE_APPLICANT_DOCUMENT = gql`
	mutation updateApplicantDocument($document: inputUpdateApplicantDocument) {
		updateApplicantDocument(document: $document) {
			id
		}
	}
`;

export const ADD_IDEAL_JOB = gql`
    mutation addApplicantIdealJob($application:  [inputInsertApplicantIdealJob]) {
        addApplicantIdealJob(applicantIdealJob: $application) {
            id
        }
    }
`;

export const UPDATE_IDEAL_JOB = gql`
    mutation updateApplicantIdealJob($application:  inputUpdateApplicantIdealJob) {
        updateApplicantIdealJob(applicantIdealJob: $application) {
            id
        }
    }
`;

/**
 * Mutation to create application with general information
 */
export const RECREATE_IDEAL_JOB_LIST = gql`
    mutation reacreateIdealJob($ApplicationId: Int, $applicationIdealJob: [inputInsertApplicantIdealJob]) {
        recreateIdealJobs(ApplicationId: $ApplicationId, applicantIdealJob: $applicationIdealJob) {
            id
            ApplicationId
            description
        }
    }
`;



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

/*This is for internal application */
export const UPDATE_INTERNAL_APPLICATION = gql`
	mutation updateApplication($application: inputUpdateApplication, $codeuser: Int, $nameUser: String, $id: Int, $hireDate: String, $startDate: String,$ApplicationId: Int) {
		updateApplication(application: $application, codeuser: $codeuser, nameUser: $nameUser) {
			id
		}
		createEmployeeBasedOnApplicationOrUpdateEmployee(id: $id, hireDate: $hireDate, startDate: $startDate, ApplicationId: $ApplicationId,codeuser: $codeuser, nameUser: $nameUser){
			id
		}
	}
`;