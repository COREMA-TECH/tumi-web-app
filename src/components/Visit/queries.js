import gql from 'graphql-tag';

/**
 * Query to get operation manager
 */
export const GET_OP_MANAGER = gql`
    query getUsers {
        user(IsActive: 1, Id_Roles: 3) {
            Id
            Code_User
            Full_Name
        }
    }
`;

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
