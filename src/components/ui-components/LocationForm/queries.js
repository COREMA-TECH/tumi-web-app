import gql from 'graphql-tag';

export const GET_CATALOGS_QUERY = gql`
    query getCatalog($Id_Catalog: Int!, $Id_Parent: Int, $Value: String) {
            catalogitem(Id_Catalog: $Id_Catalog, Id_Parent: $Id_Parent, Value: $Value) {
            Id
            Name
            DisplayLabel
            Value
        }
    }  
`;

export const GET_CITY_STATE_QUERY = gql`
	query coordenadas($Zipcode:String){
		zipcode_City_State(Zipcode:$Zipcode){
          Zipcode
          State
          City
		  Lat
          Long
          countryId
          stateId
		}
	  }

`;