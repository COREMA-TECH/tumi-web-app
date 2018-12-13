import gql from 'graphql-tag';

/**
 * Mutation to create employees
 */
export const ADD_EMPLOYEES = gql`
    mutation addEmployees($Employees: [inputInsertEmployees]) {
        addEmployees(Employees: $Employees) {
            id
        }
    }
`;