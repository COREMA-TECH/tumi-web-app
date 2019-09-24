import gql from 'graphql-tag';

export const CREATE_RULE = gql`
  mutation createBusinessRule($input:inputBusinessRule){
    addBusinesRule(input:$input){
      id
      name
    }
  }
`;

export const UPDATE_RULE = gql`
  mutation updateBusinessRule($id:Int,$input:inputBusinessRule){
    updateBusinessRule(id:$id,input:$input){
      id
      name
    }
  }
`;