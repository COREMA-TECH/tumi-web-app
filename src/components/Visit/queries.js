import gql from 'graphql-tag';
import { OP_MANAGER_ROL_ID } from './Utilities';

/**
 * Query to get operation manager
 */
export const GET_OP_MANAGER = gql`
    query getUsers($id: Int) {
        user(Id:$id, IsActive: 1, Id_Roles: ${OP_MANAGER_ROL_ID}) {
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

export const GET_VISIT_BY_ID_QUERY = gql`
  query getVisitById($id: Int){
    visits(id: $id) {
      id
      startTime
      endTime
      comment
      startLatitude
      startLongitude
      BusinessCompanyId
      BusinessCompany {
          Code
          Name
        }
    }
  }
`;

export const GET_VISITS_QUERY = gql`
  query getAllVisits {
    visits(isActive: true) {
      id
      startTime
      endTime
      comment
      url
      startLatitude
      startLongitude
      OpManagerId
      BusinessCompanyId
      BusinessCompany {
          Code
          Name
        }
    }
  }
`;
