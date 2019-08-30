import gql from 'graphql-tag';

/**
 * Mutation to create employees
 */
export const ADD_EMPLOYEES = gql`
    mutation addEmployees($Employees: [inputInsertEmployees],$codeuser: Int, $nameUser: String) {
        addEmployees(Employees: $Employees, codeuser: $codeuser, nameUser: $nameUser) {
            id
        }
    }
`;


/**
 * Mutation to delete employees
 */
export const DELETE_EMPLOYEE = gql`
    mutation deleteEmployees($id: Int,$codeuser: Int, $nameUser: String) {
        deleteEmployees(id: $id, codeuser: $codeuser, nameUser: $nameUser) {
            id
        }
    }
`;


/**
 * Mutation to update employees
 */
export const UPDATE_EMPLOYEE = gql`
    mutation updemployees($employees: inputUpdateEmployees, $codeuser: Int, $nameUser: String) {
        updateEmployees(employees: $employees, codeuser: $codeuser, nameUser: $nameUser) {
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
