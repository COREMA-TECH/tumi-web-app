import gql from 'graphql-tag';

export const CREATE_WORKORDER = gql`
	mutation addWorkOrder($workOrder: [inputInsertWorkOrder]) {
		addWorkOrder(workOrder: $workOrder) {
			id
		}
	}
`;