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