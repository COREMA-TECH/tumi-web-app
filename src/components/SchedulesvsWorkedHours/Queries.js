import gql from 'graphql-tag';

export const GET_SHIFTVSWORKEDHOURS = gql`
query {
    shiftVsWorkedHours {
        id
        name
        schedulesHours
        workedHours
        difference
    }
}
`;

export const GET_USERS_QUERY = gql`
  query user {
    user(Id_Roles: 3, IsActive: 1) {
      Id
      firstName
      lastName
    }
  }
`;