import gql from 'graphql-tag';

export const INSERT_DEPARTMENT = gql`
    mutation inscatalogitem($input: iParamCI!) {
        inscatalogitem(input: $input) {
            Id
        }
    }
`;

export const INSERT_CONTACT = gql`
    mutation inscontacts($input: iParamC!) {
        inscontacts(input: $input) {
            Id
        }
    }
`;

export const UDPATE_PROFILE_PICTURE = gql`
    mutation updateUrlphoto($id: Int!, $url: String!) {
        updateUrlphoto(id:$id,Urlphoto:$url){
            id
            idLanguage
            Urlphoto
          }
    }
`;