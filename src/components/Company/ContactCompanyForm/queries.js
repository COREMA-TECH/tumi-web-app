import gql from 'graphql-tag';

export const GET_ROLES_QUERY = gql`
    {
        getroles(IsActive: 1) {
            Id
            Name: Description
        }
    }
`;

export const GET_LANGUAGES_QUERY = gql`
    {
        getcatalogitem(IsActive: 1, Id_Catalog: 9) {
            Id
            Name
            IsActive
        }
    }
`;

export const GET_EMAILS_USER = gql`
    {
        getusers {
            Electronic_Address
        }
    }
`;

export const SEND_EMAIL = gql`
    query sendemail($username: String,$password: String,$email: String,$title:String) {
        sendemail(username:$username,password:$password,email:$email,title:$title)
    }
`;

export const GET_USER_INFORMATION = gql`
    query getUser ($Id_Contact: Int){
        user(Id_Contact:$Id_Contact){
            Id
            Code_User
            Electronic_Address
            Phone_Number
            Id_Roles
            Id_Language
            firstName
            lastName
            Id_Entity
        }
    }
`;