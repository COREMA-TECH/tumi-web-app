import gql from 'graphql-tag';

export const UPDATE_APPLICATION_INFO = gql`
    mutation updateApplication($codeuser: Int, $nameUser: String, $application: inputUpdateApplication) {
        updateApplication(codeuser: $codeuser, nameUser: $nameUser, application: $application) {
            id
        }
    }
`;

export const UPDATE_CONTACT_INFO = gql`
    mutation updateContact($contact: inputUpdateContact) {
        updateContact(contact: $contact) {
            Id
        }
    }
`;