import gql from 'graphql-tag';

/**
 * Query to get employees
 */
export const LIST_EMPLOYEES = gql`
{
      employees {
        id
        firstName
        lastName
        electronicAddress
        mobileNumber
        idRole
        isActive
      }
}   
`;