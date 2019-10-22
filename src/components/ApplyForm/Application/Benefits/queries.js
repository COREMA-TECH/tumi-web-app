import gql from 'graphql-tag';

export const GET_APPLICANT_INFO = gql`
    query lastApplicantLegalDocument($ApplicationId: Int!, $ApplicationDocumentTypeId: Int!) {
        lastApplicantLegalDocument(ApplicationDocumentTypeId: $ApplicationDocumentTypeId, ApplicationId: $ApplicationId) {
            id
            fieldsData
            url
            completed
        }
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