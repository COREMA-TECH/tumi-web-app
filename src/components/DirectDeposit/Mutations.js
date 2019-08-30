import gql from 'graphql-tag';

export const INSERT_ACCOUNT_INFO = gql`
  mutation addApplicationAccount($input: inputInsertApplicationAccount, $documents: [inputInsertApplicationAccountDocument]) {
    addApplicationAccount(applicationAccount: $input, applicationAccountDocs: $documents) {
      id
    }
  }   
`;