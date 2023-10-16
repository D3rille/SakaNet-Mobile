import { gql } from '@apollo/client';

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
// Testing server
export const HELLO = gql`
  query Query {
    hello
  }
`;