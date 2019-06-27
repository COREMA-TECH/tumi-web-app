import gql from 'graphql-tag';

/**
 * Query to get properties/hotels
 */
export const GET_PROPERTIES_QUERY = gql`
  query hotels {
    getbusinesscompanies( IsActive: 1, Contract_Status: "'C'", Id_Parent : -1) {
      Id
      Id_Parent
      Code
      Name
      Country
      State
      City
    }
  }
`;

/**
 * Query to get employees by properties
 */
export const GET_EMPLOYEEES_BY_PROPERTIES = gql`
  query employeesByProperties {
    employeesByProperties {
      code
      name
      count_associate
      employees {
        id
        name
        position
        los
        phone
        startDate
      }
    }
  }
`;

