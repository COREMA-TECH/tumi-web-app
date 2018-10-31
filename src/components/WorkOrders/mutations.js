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