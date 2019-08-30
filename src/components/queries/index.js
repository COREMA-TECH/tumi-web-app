import gql from 'graphql-tag';

export const GET_PERMISSION = gql`
    query features($RoleId: Int){
        features(RoleId:$RoleId){
            id
            code
        }
    }
`;
