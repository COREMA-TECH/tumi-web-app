import gql from 'graphql-tag';

export const GET_APPLICATION = gql`
	query applications($id: Int, $cellPhone: String) {
		applications(id: $id, cellPhone: $cellPhone) {
            id
			firstName
			middleName
			lastName
			lastName2
			date
			streetAddress
			emailAddress
			aptNumber
			city
			state
			zipCode
			homePhone
			cellPhone
			socialSecurityNumber
			positionApplyingFor
			birthDay
			car
			typeOfId
			expireDateId
			dateAvailable
			scheduleRestrictions
			scheduleExplain
			convicted
			convictedExplain
			comment
			idealJob
			isLead
			optionHearTumi
		}
	}
`;