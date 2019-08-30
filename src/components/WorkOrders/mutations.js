import gql from 'graphql-tag';

export const CREATE_WORKORDER = gql`
	mutation addWorkOrder($workOrder: [inputInsertWorkOrder],  $codeuser: Int, $nameUser: String) {
		addWorkOrder(workOrder: $workOrder, codeuser: $codeuser, nameUser: $nameUser) {
			id
		}
	}
`;

export const UPDATE_WORKORDER = gql`
	mutation updateWorkOrder($quantity:Int!, $startshift: String!,$endshift: String!,$startDate: Date!,$endDate: Date!,$workOrder: inputUpdateWorkOrder,$shift: [inputInsertShift],  $codeuser: Int, $nameUser: String) {
		updateWorkOrder(quantity:$quantity,startshift: $startshift,endshift: $endshift,startDate: $startDate,endDate:$endDate,workOrder: $workOrder, shift:$shift,  codeuser: $codeuser, nameUser: $nameUser) {
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
mutation convertToOpening($id: Int, $userId: Int,  $codeuser: Int, $nameUser: String) {
	convertToOpening(id: $id, userId: $userId, codeuser: $codeuser, nameUser: $nameUser)
	{
		id
	}
}
`;

export const DELETE_WORKORDER = gql`
	mutation deleteWorkOrder($id: Int, $codeuser: Int, $nameUser: String) {
		deleteWorkOrder(id: $id, codeuser: $codeuser, nameUser: $nameUser)
	}
`;

export const DELETE_SHIFT = gql`
	mutation deleteShift($id: Int, $codeuser: Int, $nameUser: String) {
		deleteShift(id: $id, codeuser: $codeuser, nameUser: $nameUser)
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
