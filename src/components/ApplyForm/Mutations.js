import gql from 'graphql-tag';

export const CREATE_APPLICATION = gql`
    mutation createApplication(
    $firstName: String!,
    $middleName: String!,
    $lastName: String!,
    $date: String!,
    $streetAddress: String!,
    $aptNumber: String!,
    $city: Int!,
    $state: Int!,
    $zipCode: Int!,
    $homePhone: String,
    $cellPhone: String!,
    $socialSecurityNumber: String!,
    $emailAddress: String!,
    $positionApplyingFor: Int!,
    $dateAvailable: String!,
    $scheduleRestrictions: Boolean!,
    $scheduleExplain: String,
    $convicted: Boolean!,
    $convictedExplain: String,
    $comment: String!
    ) {
        createApplication(
            firstName: $firstName
            middleName: $middleName
            lastName: $lastName
            date: $date
            streetAddress: $streetAddress
            aptNumber: $aptNumber
            city: $city
            state: $state
            zipCode: $zipCode
            homePhone: $homePhone
            cellPhone: $cellPhone
            socialSecurityNumber: $socialSecurityNumber
            emailAddress: $emailAddress
            positionApplyingFor: $positionApplyingFor
            dateAvailable: $dateAvailable
            scheduleRestrictions: $scheduleRestrictions
            scheduleExplain: $scheduleExplain
            convicted: $convicted
            convictedExplain: $convictedExplain
            comment: $comment
        ) {
            id
        }
    }
`;