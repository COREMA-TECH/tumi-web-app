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

export const GET_USERS_QUERY = gql`
  query user {
    user(Id_Roles: 3, IsActive: 1) {
      Id
      firstName
      lastName
    }
  }
`;

/**
 * Query to get employees by properties
 */
export const GET_EMPLOYEEES_BY_PROPERTIES = gql`
query employeesByProperties($property: inputInsertBusinessCompany, $operationManagerId: Int) {
  employeesByProperties(property: $property, operationManagerId: $operationManagerId) {
      code
      name
      count_associate
      operationManager
      region
      count_department
      management_company
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

