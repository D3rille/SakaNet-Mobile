import { gql } from '@apollo/client';


export const GET_OTP = gql`
  query GenerateOTP($email: String!) {
    generateOTP(email: $email)
  }
`;


export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!, $newPassword: String!) {
    forgotPassword(email: $email, newPassword: $newPassword)
  }
`;


