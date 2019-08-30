import gql from 'graphql-tag';

export const GET_EMPLOYEES = gql`
    query employees($idEntity: Int) {
        employees(idEntity: $idEntity) {
            id
            firstName
            lastName           
        }
    }  
`;

export const GET_BREAK_RULES = gql`
query breakRules($businessCompanyId: Int){
    breakRules(businessCompanyId: $businessCompanyId){
      id
      name
      code
      isPaid
      isAutomatic
      lenght
      isActive
      
      breakRuleDetail{
        id
        shiftReached
        isRepeating
        days
        breakStartTime
        breakPlacement
      }
      
      businessCompany {
        Id
        Code
      }
      
      employee_BreakRule {
        employees {
          id
          firstName
          lastName
          isActive
        }
      }
    }
  }
`