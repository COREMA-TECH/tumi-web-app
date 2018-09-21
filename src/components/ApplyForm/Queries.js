import gql from 'graphql-tag';

/**
 * Query to get states
 */
export const GET_STATES_QUERY = gql`
    query States($parent: Int!) {
        getcatalogitem(Id: null, IsActive: 1, Id_Parent: $parent, Id_Catalog: 3) {
            Id
            Name
            IsActive
        }
    }
`;

/**
 * Query to get cities
 */
export const GET_CITIES_QUERY = gql`
    query Cities($parent: Int!) {
        getcatalogitem(Id: null, IsActive: 1, Id_Parent: $parent, Id_Catalog: 5) {
            Id
            Name
            IsActive
        }
    }
`;

