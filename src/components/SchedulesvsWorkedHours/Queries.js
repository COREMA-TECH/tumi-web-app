import gql from 'graphql-tag';

export const GET_SHIFTVSWORKEDHOURS = gql`
query {
    shiftVsWorkedHours {
        schedulesHours
        workedHours
        difference
      	detail {
          id
          schedulesHours
          workedHours
          difference
          name
        }
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