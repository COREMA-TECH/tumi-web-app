import gql from 'graphql-tag';

/**
 * Query to get holidays
 */
export const GET_HOLIDAYS = gql`
    query getHolidays($id: Int, $CompanyId: Int) {
        holidays(id:$id, CompanyId:$CompanyId) {
        id
        title
        description
        start:startDate
        end:endDate
        CompanyId
        weekDays
        weekNumbers
        anually
        months
        calendarDays
        }
    }  
`;
