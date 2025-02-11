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
        cityInfo {
            Name
        }
        state
        stateInfo {
            Name
        }
        zipCode
        car
        area
        gender
        exemptions
        expireDateId
        marital
        typeOfId
        numberId
        employmentType
        employee{
            Employees{
                hireDate
                BusinessCompany{ Name }
            }
        }
        Accounts {
            bankName
            routingNumber
            accountNumber
        }
        optionHearTumi
        nameReferences
        recruiter
        { Full_Name }
    }
  }
`;

export const CREATE_DOCUMENTS_PDF_QUERY = gql`
query createdocumentspdf($contentHTML:String,$Name:String) {
    createdocumentspdf(contentHTML: $contentHTML, Name: $Name) 
}
`;
