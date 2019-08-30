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

export const GET_WO_BY_CATEGORY = gql`
  query worKOrdersByCategory{
    worKOrdersByCategory{
      id
      name
      workOrders_count
      color    
    }
  }
`;

export const GET_EMPLOYEES_BY_HOTEL = gql`
  query employeesByHotel{
    employeesByHotel{
      id
      name
      employeeCount
      color
    }
  }
`;