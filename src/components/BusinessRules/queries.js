import gql from 'graphql-tag';

export const GET_RULE_TYPES = gql`
query businessRuleTypes{
    catalogitem(Id_Catalog:16){
      Id
      Name
    }
  }
`;
