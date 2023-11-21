import { gql } from '@apollo/client';


//Just copy paste from apollo playground
export const REGISTER_USER = gql`
 mutation Register($registerInput: RegisterInput) {
  register(registerInput: $registerInput) {
    id
    token
    username
    date_joined
    account_mobile
    account_email
    role
    address {
      street
      barangay
      cityOrMunicipality
      province
      region
    }
  }
}
 `;

export const LOGIN_USER = gql`
  mutation Login($loginCred: String!, $password: String!) {
  login(login_cred: $loginCred, password: $password) {
    id
    token
    username
    date_joined
    account_mobile
    account_email
    role
  }
}
 `;

export const VALIDATE_REG_PERSONAL_INFO = gql`
  mutation ValidateRegPersonalInfo($registerInput: RegisterInput) {
    validateRegPersonalInfo(registerInput: $registerInput) {
      errors
      valid
    }
  }
`;
