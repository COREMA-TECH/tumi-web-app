import gql from 'graphql-tag';

export const GET_PUNCHES_REPORT_CONSOLIDATED = gql`
    query markedEmployeesDetail($idUser: Int, $startDate: Date, $endDate: Date){
    markedEmployeesDetail(idUser: $idUser, startDate: $startDate, endDate: $endDate) {
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