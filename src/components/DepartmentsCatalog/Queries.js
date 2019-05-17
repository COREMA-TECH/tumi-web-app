import gql from 'graphql-tag';

export const GET_DEPARTMENTS = gql`
    query getcatalogitem{
    getcatalogitem(Id_Catalog: 8, IsActive: 1) {
            Id
            Name
            DisplayLabel
            Description
            Value
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

export const DELETE_CATALOG_ITEM_QUERY = gql`
    mutation delcatalogitem($Id: Int!) {
        delcatalogitem(Id: $Id, IsActive: 0) {
            Id
        }
    }
`;

export const GET_DEPARTMENT = gql`
    query catalogitem($input:Int){
        catalogitem(Id: $input) {
            Id
            Name
            DisplayLabel
            Description
            Value
            Date_Created
        }
    }
`;