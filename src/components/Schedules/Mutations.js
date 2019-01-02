import gql from 'graphql-tag'

export const INSERT_SHIFT = gql`
mutation createShiftDetail(
    $startDate: Date!,
    $endDate: Date!,
    $startHour: String!,
    $endHour: String!,
    $shift: inputInsertShift,
    $employees: [Int]) {
    createShiftDetail(startDate:$startDate,
                        endDate: $endDate, 
                        startHour:$startHour, 
                        endHour: $endHour, 
                        shift: $shift,
                        employees: $employees) 
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