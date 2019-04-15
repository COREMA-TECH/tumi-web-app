import gql from 'graphql-tag';

/**
 * Query to get cities
 */
export const GET_COMPLETED_STATUS = gql`
    query applicationCompleted($id: Int!) {
        applicationCompleted (id: $id)
    }
`;
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
 * Query to get departments by hotel
 */
export const GET_DEPARTMENTS_QUERY = gql`
  query department($Id_Entity: Int){
    catalogitem(Id_Catalog:8, Id_Entity:$Id_Entity){
      Id
      DisplayLabel
    }
  }
`;