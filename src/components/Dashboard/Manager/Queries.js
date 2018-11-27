import gql from 'graphql-tag';

export const GET_CATALOG = gql`
    {
        getcatalogitem(Id_Catalog: 13) {
            Id
            Name
        }
    }
`;

