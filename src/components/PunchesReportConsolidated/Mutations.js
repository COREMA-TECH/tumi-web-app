//updateMarkedEmployees
import gql from 'graphql-tag';

export const UPDATE_MARKED_EMPLOYEE = gql`
mutation updateMarkedEmployees($markedemployees: inputUpdateMarkedEmployees){
        updateMarkedEmployees(markedemployees: $markedemployees){
            id
        }
    }
`;