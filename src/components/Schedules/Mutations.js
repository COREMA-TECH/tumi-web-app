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
mutation changeStatusShift($id: Int!,$status:Int!,$color:String!)
{
  changeStatusShift(id:$id,status:$status,color: $color)
  {
    id
  }
}`;

export const UPDATE_SHIFT = gql`
  mutation updateShift($ShiftDetail: inputUpdateShiftDetail,
    $shiftDetailEmployee: inputInsertShiftDetailEmployee,
    $openShift: Boolean,
    $shift: inputUpdateShift,
    $workorderId: Int,
    $comment: String) {
      
      updateShiftDetail(ShiftDetail: $ShiftDetail){
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
