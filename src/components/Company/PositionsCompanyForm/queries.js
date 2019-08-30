import gql from 'graphql-tag';

export const GET_POSTIONS_QUERY = gql`
		query getposition($Id_Entity: Int) {
			getposition(IsActive: 1, Id_Entity: $Id_Entity) {
				Id
				Id_Department
				Position
                Id_positionApplying
				Bill_Rate
				Pay_Rate
				Shift
				IsActive,
				Comment,
				catalogItem_id				
			}
		}
	`;

export const GET_POSITIONS_QUERY = gql`
query getposition ($Id_Entity:Int){
        getcatalogitem(Id_Catalog: 6, IsActive: 1,Id_Entity:$Id_Entity) {
            Id
            IsActive
			Description		
        }
    }
`;
export const GET_RATE_QUERY = gql`
		query getbusinesscompanies($Id: Int) {
			getbusinesscompanies(Id: $Id, IsActive: 1, Contract_Status: null) {
				Rate
			}
		}
	`;

export const GET_DEPARTMENTS_QUERY = gql`
	query getcatalogitem ($Id_Entity:Int)
		{
			getcatalogitem(IsActive: 1, Id_Catalog: 8,Id_Entity:$Id_Entity) {
				Id
				Code: Name
				Name: Description
				IsActive
			}
		}
    `;

export const GET_UNIQUEPOSITION_QUERY = gql`
query uniquePosition($Position: String, $Id_Entity: Int, $IdToExclude:Int){
  uniquePosition(Position:$Position,Id_Entity:$Id_Entity,Id:$IdToExclude) {
    Id
    Id_Contract
    Position
    Bill_Rate
    Pay_Rate
    Id_Entity
  }
}
`;