import gql from 'graphql-tag';

export const SET_BREAK_RULE_ACTIVE = gql`
    mutation disableBreakRule($id: Int, $isActive: Boolean){
        disableBreakRule(id: $id, isActive: $isActive){
            id,
            name,
            isActive
        }
    } 
`;

export const SET_BREAK_RULE = gql`
 mutation addBreakRule ($input: inputInsertBreakRuleType, $employees: [Int]){
   addBreakRule(breakRule: $input, employees: $employees){
 		id
        name    
   }
 }
`;

export const UPDATE_BREAK_RULE = gql`
mutation updateBreakRule ($input: inputUpdateBreakRule, $employees: [Int]){
    updateBreakRule(breakRule: $input, employees: $employees){    
      id
      name
      code
    }
  }
`;

export const SET_BREAK_RULE_DETAIL = gql`
mutation addBreakRuleDetail ($input: inputInsertBreakRuleDescriptionType){
    addBreakRuleDetail(breakRuleDetail: $input) {
      id      
    }
  }
`;

export const UPDATE_BREAK_RULE_DETAIL = gql`
mutation updateBreakRuleDetail ($input: inputUpdateBreakRuleDetail) {
    updateBreakRuleDetail(breakRuleDetail: $input){
      id      
    }
  }
`;