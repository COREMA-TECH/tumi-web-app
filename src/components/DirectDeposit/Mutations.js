import gql from 'graphql-tag';

export const INSERT_ACCOUNT_INFO = gql`
    mutation addApplicationAccount ($input: inputApplicationAccount, $documents: [inputApplicationAccountDocument]){
        addApplicationAccount(applicationAccount: $input, applicationAccountDocs: $documents){
            id
        }
    }
`;