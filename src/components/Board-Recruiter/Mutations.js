import gql from 'graphql-tag';

/**
 * Mutation to insert background check information
 */
export const UPDATE_APPLICANT = gql`
	mutation updateApplicationConvertLead($id: Int,$isLead: Boolean) {
		updateApplicationConvertLead(id: $id,isLead: $isLead) {
			id
		}
	}
`;
