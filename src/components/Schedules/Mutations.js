import gql from 'graphql-tag'

export const INSERT_SHIFT = gql`
mutation createShiftDetail(
  $startHour: String!, 
  $endHour: String!,
  $shift: inputInsertShift!, 
  $employees: [Int],
  $special: inputParamWorkOrderForShift!) {
    createShiftDetail(startHour: $startHour, 
                      endHour: $endHour,
                      shift: $shift, 
                      employees: $employees,
                      special: $special) 
    {
      id
      startDate
      endDate
      startTime
      endTime
      ShiftId
    }
  }
`;

export const CHANGE_STATUS_SHIFT = gql`
mutation changeStatusShift($id: Int!,$status:Int!,$color:String!,$comment:String!)
{
  changeStatusShift(id:$id,status:$status,color: $color, comment: $comment)
  {
    id
  }
}`;

export const UPDATE_SHIFT = gql`
  mutation updateShift($shiftDetail: inputUpdateShiftDetail, $shiftDetailEmployee: inputInsertShiftDetailEmployee, $openShift: Boolean, $shift: inputUpdateShift, $workorderId: Int, $comment: String) {
    
    updateShiftDetail(shiftDetail: $shiftDetail){
         id
       }
        addShiftDetailEmployee(ShiftDetailEmployee:$shiftDetailEmployee,openShift:$openShift){
           ShiftDetailId
            EmployeeId
       }
       updateShift (Shift: $shift){
         id
         entityId
         title
         comment
       }
         updateCommentWorkOrder(id: $workorderId, comment: $comment){
           id
           IdEntity
           comment
         }
 }
`;

export const DELETE_SHIFT = gql`
  mutation disableShift($id: Int!) {
    disableShift(id:$id){
      id
      entityId
      isActive
    }
  }
`;

export const CREATE_TEMPLATE = gql`
mutation gettemplate($id: [Int], $title: String, $endDate: Date) {
  createTemplate (shiftIds:$id, title: $title, endDate: $endDate){
    id
  }
}
`;

export const USE_TEMPLATE = gql`
mutation createShiftBasedOnTemplate($templateId: Int, $endDate: Date, $userId: Int, $requestedBy: Int, $specialComment: String) {
  createShiftBasedOnTemplate(templateId:$templateId,endDate:$endDate,userId: $userId,requestedBy:$requestedBy,specialComment: $specialComment)
  {
    id
    entityId
  }
}
`;

export const LOAD_PREVWEEK = gql`
mutation PreviousWeekShift($endDate: Date, $departmentId: Int, $entityId: Int, $userId: Int) {
  createPreviousWeekShift(endDate: $endDate,departmentId: $departmentId,entityId: $entityId, userId: $userId)
  {
    id
    entityId
  }
}
`;

export const PUBLISH_ALL = gql`
  mutation PublishAll($ids: [Int]){
    PublishAll(ids: $ids ){
      id
    }
  }
`;

export const CREATE_WORKORDER = gql`
	mutation addWorkOrderGrid($workOrder: [inputInsertWorkOrderGridType],  $codeuser: Int, $nameUser: String) {
		addWorkOrderGrid(workOrder: $workOrder, codeuser: $codeuser, nameUser: $nameUser) {
			id
		}
	}
`;