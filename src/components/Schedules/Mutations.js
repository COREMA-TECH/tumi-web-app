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
  mutation updateShift($shift: inputUpdateShift, 
    $shiftDetail: inputUpdateShiftDetail,
    $shiftDetailEmployee: inputInsertShiftDetailEmployee)	{
    updateShift(Shift:$shift){
      id
      
    }

    updateShiftDetail(ShiftDetail: $shiftDetail){
      id
    }

    addShiftDetailEmployee(ShiftDetailEmployee:$shiftDetailEmployee){
      ShiftDetailId
       EmployeeId
     }
  }
`;