import gql from 'graphql-tag';

export const CREATE_WORKORDER = gql`
	mutation addWorkOrder($workOrder: [inputInsertWorkOrder]) {
		addWorkOrder(workOrder: $workOrder) {
			id
		}
	}
`;

export const UPDATE_WORKORDER = gql`
	mutation updateWorkOrder($workOrder: inputUpdateWorkOrder) {
		updateWorkOrder(workOrder: $workOrder) {
			id
		}
	}
`;


export const CONVERT_TO_OPENING = gql`
mutation convertToOpening($id: Int, $userId: Int) {
	convertToOpening(id: $id, userId: $userId)
	{
		id
	}
}
`;

export const DELETE_WORKORDER = gql`
	mutation deleteWorkOrder($id: Int) {
		deleteWorkOrder(id: $id)
	}
`;