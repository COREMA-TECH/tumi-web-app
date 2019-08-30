import gql from 'graphql-tag';

export const LIST_PAYROLLS = gql`
    query listPayrolls{
      listPayrolls {
        id
        payPeriod
        lastPayPeriod
        weekStart
      }
    }
`;