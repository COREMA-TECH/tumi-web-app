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

export const REJECT_WORKORDER = gql`
	mutation rejectWorkOrder($id: Int) {
		rejectWorkOrder(id: $id) {
			id
		}
	}
`;

export const DELETE_WORKORDER = gql`
	mutation deleteWorkOrder($id: [Int]) {
		deleteWorkOrder(id: $id)
	}
`;
