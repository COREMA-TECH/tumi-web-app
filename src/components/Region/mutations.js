import gql from 'graphql-tag';

export const DELETE_CATALOG_ITEM_QUERY = gql`
mutation delcatalogitem($Id: Int!) {
	delcatalogitem(Id: $Id, IsActive: 0) {
		Id
	}
}
`;

export const INSERT_CATALOG_ITEM_QUERY = gql`
		mutation inscatalogitem($input: iParamCI!) {
			inscatalogitem(input: $input) {
				Id
			}
		}
	`;

export const UPDATE_CATALOG_ITEM_QUERY = gql`
		mutation updcatalogitem($input: iParamCI!) {
			updcatalogitem(input: $input) {
				Id
			}
		}
	`;

export const UPDATE_REGION_USERS_QUERY = gql`
	mutation updregionusers($Id: Int!, $IdRegion:Int!)
	{
		updregionusers(Id:$Id,IdRegion:$IdRegion){
			Id
		}
	}
	`;

export const UPDATE_REGION_BUSINESSCOMPANY_QUERY = gql`
	mutation updregionbusinescompanies ($Id:Int!, $Region:Int!){
		updregionbusinescompanies(Id:$Id,Region:$Region)
		{Id}
	}
	`;

export const INSERT_CONFIG_REGIONS_QUERY = gql`
mutation addConfigRegions($configregions: [inputConfigRegionsQuery])
{addConfigRegions(configregions: $configregions)
  {regionId}
}
`;

export const UPDATE_CONFIG_REGIONS_QUERY = gql`
mutation updateConfigRegions($configregions: inputUpdateConfigRegions)
{updateConfigRegions(configregions: $configregions)
  {regionId}
}
`;