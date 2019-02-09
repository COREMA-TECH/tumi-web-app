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

export const ADD_APPLICATION_PHASES = gql`
	mutation addApplicantPhase($applicationPhases: [inputApplicantPhase]) {
		addApplicantPhase(applicationPhases: $applicationPhases) {
			id
		}
	}
`;

export const CONVERT_TO_OPENING = gql`
	mutation convertShiftToOpening($shiftWorkOrder:filterShiftWOConvertToOpening, 
		$shift: filterShiftConvertToOpening, 
		$sourceStatus: Int!,
		$targetStatus: Int! ){
		convertShiftToOpening(shiftWorkOrder:$shiftWorkOrder, shift:$shift, 
			sourceStatus: $sourceStatus,
			targetStatus: $targetStatus ){
		id
		entityId
		title
		color
		}
	}
`;