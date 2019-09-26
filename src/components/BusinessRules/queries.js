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

export const GET_OVERLAPS = gql`
query overlapping($days:String,$ruleType:Int!){
	overlappingRules(days:$days,ruleType:$ruleType){
    id    
  }  
}

`;
