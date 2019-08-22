import gql from 'graphql-tag';

/**
 * Query to get employees
 */
export const GET_CONTRACT = gql`
query getContract($Id: Int){
    contracts(Id: $Id){
      Id
      Contract_Terms
    }
  }
`;