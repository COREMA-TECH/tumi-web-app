import gql from 'graphql-tag';

export const GET_WO_BY_REGION = gql`
  query worKOrdersByRegion{
    worKOrdersByRegion{
      id
      name
      workOrders_count
      color    
    }
  }
`;