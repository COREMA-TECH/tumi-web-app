import gql from 'graphql-tag';

export const GET_DOCUMENT_TYPE = gql`
    query applicationDocumentTypes($name: String) {
        applicationDocumentTypes(name: $name) {
            id
            name
            description
        }
    }
`;

/**
 * To get basic info about the applicant
 */
export const GET_APPLICANT_INFO = gql`
    query applications($id: Int!) {
        applications(id: $id) {
            id
            firstName
            middleName
            lastName
            streetAddress
            birthDay
            socialSecurityNumber
            zipCode
            state
            city
        }
    }
`;


export const GET_ANTI_HARRASMENT_INFO = gql`
    query lastApplicantLegalDocument($ApplicationId: Int!, $ApplicationDocumentTypeId: Int!) {
        lastApplicantLegalDocument(ApplicationDocumentTypeId: $ApplicationDocumentTypeId, ApplicationId: $ApplicationId) {
            id
            fieldsData
            url
            completed
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
      exemptions,
      gender,
      birthDay,
      homePhone,
      cellPhone
    }
  }
`;



