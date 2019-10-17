import gql from 'graphql-tag';


/**
 * To get basic info about the applicant
 */
export const GET_APPLICANT_INFO = gql`
    query applicantW4($ApplicationId: Int!){
          applicantW4(ApplicationId: $ApplicationId){
                id
                html
                url
                fieldsData
          }
    }
`;

export const CREATE_DOCUMENTS_PDF_QUERY = gql`
query createdocumentspdf($contentHTML:String,$Name:String) {
    createdocumentspdf(contentHTML: $contentHTML, Name: $Name) 
}
`;

export const GET_GENERAL_INFO = gql`
  query getApplication($id:Int){
    applications(id:$id){
      id
      firstName
      middleName
      lastName    
      socialSecurityNumber
      streetAddress,
      city,
      marital,
      cityInfo{
        Name
      },
      state,
      stateInfo{
        Name
      },
      zipCode,
      exemptions
    }
  }
`;



