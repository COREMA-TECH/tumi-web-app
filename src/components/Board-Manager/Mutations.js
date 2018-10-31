import gql from 'graphql-tag';

/**
 * Mutation to insert background check information
 */
export const GET_WORK_ORDERS = gql`
query workorder {
    workOrder{
        id
        IdEntity
        userId
        date

        quantity
        shift
        startDate
        endDate
        needExperience
        needEnglish
        PositionRateId
        comment
                }
}
`;
