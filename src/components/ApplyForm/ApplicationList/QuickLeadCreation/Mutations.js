import gql from 'graphql-tag';

export const CREATE_APPLICATION = gql`
mutation quickAddLead($application: inputInsertApplication, $speakEnglish: Boolean, $codeuser: Int, $nameUser: String) {
    quickAddLead(application: $application, speakEnglish: $speakEnglish, codeuser: $codeuser, nameUser: $nameUser) {
        id
    }
}
`;