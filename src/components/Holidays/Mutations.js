import gql from 'graphql-tag';

/**
 * Mutation to create a holiday
 */
export const CREATE_HOLIDAY = gql`
    mutation addHoliday($holidays: [inputInsertHoliday]){
        addHoliday(holidays: $holidays){
        id
        title 
        startDate
        endDate
        }
    }
`;
/**
 * Mutation to update a holiday
 */
export const UPDATE_HOLIDAY = gql`
    mutation updateHoliday($holiday: inputUpdateHoliday){
        updateHoliday(holiday: $holiday){
            id
            title
            startDate
            endDate    
        }
    }
`;
