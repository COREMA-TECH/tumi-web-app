import gql from 'graphql-tag';

export const GET_INITIAL_DATA = gql`
query data {
    employees(isActive:true) {
      id
      firstName
      lastName
      electronicAddress
      mobileNumber
      
    } 
    getbusinesscompanies(Id: null, IsActive: 1, Contract_Status: null, Id_Parent: -1) {
          Id
          Code
          Name         
    } 
  }
`;

export const GET_POSITION = gql`
  query positions($Id_Entity: Int){
    getposition(Id_Entity: $Id_Entity){
      Id
      Position      
    }
  }
`;

export const GET_CITIES_QUERY = gql`
query Cities($id: Int) {
	getcatalogitem(Id: $id, IsActive: 1,  Id_Catalog: 5) {
		Id
		Name
		IsActive
	}
}
`;
