import gql from 'graphql-tag';

export const GET_RULES = gql`
query rules{
  businessRules{
    id    
    name
    multiplier
    baseIncrement
    startAfterHours
    days
    startTime
    endTime
    type
    ruleType{
      Id
      Name
    }
    isActive
  }
} 
`;

export const GET_RULE_TYPES = gql`
query businessRuleTypes{
    catalogitem(Id_Catalog:16){
      Id
      Name
    }
  }
`;
