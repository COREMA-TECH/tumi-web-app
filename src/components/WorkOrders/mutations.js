import gql from 'graphql-tag';

export const CREATE_WORKORDER = gql`
	mutation addWorkOrder($Electronic_Address: String!, $quantity:Int!, $startshift: String!,$endshift: String!,$startDate: Date!,$endDate: Date!,$workOrder: [inputInsertWorkOrder],$shift: [inputInsertShift]) {
		addWorkOrder(Electronic_Address:$Electronic_Address ,quantity:$quantity,startshift: $startshift,endshift: $endshift,startDate: $startDate,endDate:$endDate,workOrder: $workOrder, shift:$shift) {
			id
		}
	}
`;

export const UPDATE_WORKORDER = gql`
	mutation updateWorkOrder($quantity:Int!, $startshift: String!,$endshift: String!,$startDate: Date!,$endDate: Date!,$workOrder: inputUpdateWorkOrder,$shift: [inputInsertShift]) {
		updateWorkOrder(quantity:$quantity,startshift: $startshift,endshift: $endshift,startDate: $startDate,endDate:$endDate,workOrder: $workOrder, shift:$shift) {
			id
		}
	}
`;

export const DELETE_EMPLOYEE = gql`
mutation deleteEmployees($id: Int)
{
  deleteShiftDetailEmployees(id: $id)
  {
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

export const DELETE_SHIFT = gql`
	mutation deleteShift($id: Int) {
		deleteShift(id: $id)
		{id}
	}
`;

export const DELETE_ALL_SHIFT = gql`
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