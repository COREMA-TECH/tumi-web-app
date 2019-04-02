import gql from 'graphql-tag';

export const GET_PUNCHES_REPORT_CONSOLIDATED = gql`
    query markedEmployeesConsolidate{
    markedEmployeesConsolidate {
        key
        employeeId
        name
        date
        workedHours
        punches {
            clockIn
            clockOut
            duration
            job
            hotelCode
            notes
            }
        }
    }
`;