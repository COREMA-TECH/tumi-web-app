import gql from 'graphql-tag';

export const CREATE_APPLICATION = gql`
    mutation addLead($application: inputInsertApplication, $codeuser: Int, $nameUser: String) {
        addLead(application: $application, codeuser: $codeuser, nameUser: $nameUser) {
            id
        }
    }
`;