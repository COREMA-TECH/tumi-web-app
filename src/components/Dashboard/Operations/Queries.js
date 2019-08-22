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

export const GET_ACTIVE_EMPLOYEES = gql`
  query employees{
      employees(isActive: true){
        id
        isActive
      }
    }
`;

export const GET_ACTIVE_HOTELS = gql`
  query BusinessCompany{
    businessCompanies(IsActive: 1){
      Id
      IsActive
    }
  }
`;

