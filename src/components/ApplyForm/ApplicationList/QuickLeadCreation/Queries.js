import gql from 'graphql-tag';

export const GET_POSITIONS_QUERY = gql`
    query getPosition{
        workOrder {
            id
            position {
                Position
            }
            BusinessCompany {
                Id
                Code
            }
        }
    }
`;