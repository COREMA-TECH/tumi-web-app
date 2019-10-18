import gql from 'graphql-tag';

export const GET_DOCUMENT_TYPES = gql`
    query applicationDocumentTypes {
        applicationDocumentTypes {
            id
            name
            description
        }
    }
`;

export const GET_HISTORICAL_DOCUMENTS = gql`
    query applicantLegalDocuments($ApplicationId: Int) {
        applicantLegalDocuments(ApplicationId: $ApplicationId) {
          id
          ApplicationId
          ApplicationDocumentTypeId
          url
          ApplicationDocumentType {
            id
            name
          }
          User{
              Id
              Full_Name
          }
          createdAt
        }
    }
`;