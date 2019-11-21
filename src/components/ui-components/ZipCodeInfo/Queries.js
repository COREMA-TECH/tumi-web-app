import gql from 'graphql-tag';

export const GET_CITY_STATE_QUERY = gql`
query coordenadas($Zipcode:String){
    zipCodeStateCity(Zipcode:$Zipcode){
      Zipcode
      countryId
      stateId
      stateRelation {
        Id
        Name
      }
      cityRelation {
        Id
        Name
      }
    }
  }

`;