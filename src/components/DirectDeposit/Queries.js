import gql from 'graphql-tag';

export const GET_APPLICATION_ACCOUNTS = gql`
query applicationAccounts ($applicationId: Int) {
  applicationAccounts(applicationId: $applicationId) {
    id
    applicationId
    firstName
    lastName
    city
    state
    zipcode
    bankName
    accountNumber
    routingNumber
    accountType
    amount
    amountType
    address
    
    applicationDocuments {
      id
      applicationAccountId
      path
      name
      extension      
    }
  }
}
`;