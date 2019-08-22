import gql from 'graphql-tag';

export const INSERT_FORMS_QUERY = gql`
    mutation addForm($input: [inputInsertFormType]!) {
        addForm(forms: $input) {
            Id
        }
    }
`;

export const UPDATE_FORMS_QUERY = gql`
    mutation updateForm($input: inputUpdateFormType!) {
        updateForm(form: $input) {
            Id
        }
    }
`;
