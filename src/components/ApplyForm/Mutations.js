import gql from "graphql-tag";

const CREATE_APPLICATION = gql`
              mutation createApplication(
                    $firstName: String!, 
                    $middleName: String!,
                    $lastName: String!,
                    $date: String!,
                    $streetAddress: String!,
                    $aptNumber: Int!,
                    $city: Int!,
                    $state: Int!,
                    $zipCode: Int!,
                    $homePhone: String!,
                    $cellPhone: String!,
                    $socialSecurityNumber: String!,
                    $emailAddress: String!,
                    $positionApplyingFor: Int!,
                    $dateAvailable: String!,
                    $scheduleRestrictions: Int!,
                    $scheduleExplain: String,
                    $convicted: Int!,
                    $convictedExplain: String,
                    $comment: String!
              ) {
                    createApplication(type: $type) {
                          id
                    }
              }
`;

export default CREATE_APPLICATION;