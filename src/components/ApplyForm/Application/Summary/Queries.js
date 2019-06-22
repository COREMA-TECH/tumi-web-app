import gql from 'graphql-tag';

export const GET_SUMMARY_INFO = gql`
query applications($id: Int){
    applications(id:$id){
        id
        firstName
        lastName
        middleName
        socialSecurityNumber
        homePhone
        cellPhone
        birthDay
        streetAddress
        city
        state
        zipCode
        car
        area
        gender
        expireDateId
        typeOfId
        employee{Employees{BusinessCompany{Name}}}
        Account
        {bankName
        routingNumber
        accountNumber}
        recruiter
        {Full_Name}
    }
  }
`;

export const CREATE_DOCUMENTS_PDF_QUERY = gql`
query createdocumentspdf($contentHTML:String,$Name:String) {
    createdocumentspdf(contentHTML: $contentHTML, Name: $Name) 
}
`;
