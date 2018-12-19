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