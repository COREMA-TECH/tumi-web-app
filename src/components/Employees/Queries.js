import gql from 'graphql-tag';

/**
 * Query to get employees
 */
export const LIST_EMPLOYEES = gql`
{
      employees(isActive: true) {
        id
        firstName
        lastName
        electronicAddress
        mobileNumber
        idRole
        isActive
        Id_Deparment
        Contact_Title
      }
}   
`;