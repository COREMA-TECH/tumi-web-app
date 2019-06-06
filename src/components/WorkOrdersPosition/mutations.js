import gql from 'graphql-tag';

export const CREATE_WORKORDER = gql`
	mutation addWorkOrder($workOrder: [inputInsertWorkOrder],  $codeuser: Int, $nameUser: String) {
		addWorkOrder(workOrder: $workOrder, codeuser: $codeuser, nameUser: $nameUser) {
			id
		}
	}
`;

export const UPDATE_WORKORDER = gql`
	mutation updateWorkOrder($workOrder: inputUpdateWorkOrder,  $codeuser: Int, $nameUser: String) {
		updateWorkOrder(workOrder: $workOrder, codeuser: $codeuser, nameUser: $nameUser) {
			id
		}
	}
`;

export const REJECT_WORKORDER = gql`
	mutation rejectWorkOrder($id: Int,  $codeuser: Int, $nameUser: String) {
		rejectWorkOrder(id: $id, codeuser: $codeuser, nameUser: $nameUser) {
			id
		}
	}
`;

export const DELETE_WORKORDER = gql`
	mutation deleteWorkOrder($id: [Int], $codeuser: Int, $nameUser: String) {
		deleteWorkOrder(id: $id, codeuser: $codeuser, nameUser: $nameUser)
	}
`;
