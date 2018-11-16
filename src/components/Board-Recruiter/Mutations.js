import gql from 'graphql-tag';

/**
 * Mutation to insert background check information
 */
export const UPDATE_APPLICANT = gql`
	mutation updateApplicationConvertLead($id: Int,$isLead: Boolean,$idRecruiter: Int, $idWorkOrder : Int) {
		updateApplicationConvertLead(id: $id,isLead: $isLead, idRecruiter:$idRecruiter, idWorkOrder:$idWorkOrder) {
			id
		}
	}
`;

export const UPDATE_APPLICATION_STAGE = gql`
	mutation updateApplicationMoveStage($id: Int,$idStages: Int) {
		updateApplicationMoveStage(id: $id,idStages: $idStages) {
			id
		}
	}
`;