import gql from 'graphql-tag';

export const GET_HOLIDAYS = gql`
  query holidays{
    holidays{
      title
      startDate
      endDate    
    }
  }
`;