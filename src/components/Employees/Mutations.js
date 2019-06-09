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


/**
 * Mutation to delete employees
 */
export const DELETE_EMPLOYEE = gql`
    mutation deleteEmployees($id: Int) {
        deleteEmployees(id: $id) {
            id
        }
    }
`;


/**
 * Mutation to update employees
 */
export const UPDATE_EMPLOYEE = gql`
    mutation updemployees($employees: inputUpdateEmployees) {
        updateEmployees(employees: $employees) {
            id
        }
    }
`;

export const INSERT_USER_QUERY = gql`
    mutation insusers($input: inputInsertUser, $idEmployee: Int) {
        addUser(user: $input, idEmployee: $idEmployee) {
            Id
            Code_User
            Electronic_Address
        }
    }
`;

export const INSERT_CONTACT = gql`
    mutation addContacts($contacts: [inputContact]) {
        addContacts(contacts: $contacts) {
            Id
        }
    }
`;
