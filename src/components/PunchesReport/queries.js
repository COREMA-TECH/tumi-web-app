import gql from 'graphql-tag';

export const GET_REPORT_QUERY = gql`
query punches{
    punches{
     employeeId
      name
      hourCategory
      hoursWorked
      payRate
      date
      clockIn
      clockOut
      lunchIn
      lunchOut
      hotelCode
      positionCode
      
    }
  }
`;