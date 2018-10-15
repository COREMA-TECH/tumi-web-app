import gql from 'graphql-tag';

/**
 * To get background check info by id
 */
export const GET_BACKGROUND_CHECK_INFO = gql`
    query States($parent: Int!) {
        getcatalogitem(Id: null, IsActive: 1, Id_Parent: $parent, Id_Catalog: 3) {
            Id
            Name
            IsActive
        }
    }
`;