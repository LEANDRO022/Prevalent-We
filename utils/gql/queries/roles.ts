import { gql } from '@apollo/client';

export const GET_ROLES = gql`
  query Query {
    roles {
      id
      name
    }
  }
`;

export const GET_ROLE = gql`
  query Query($roleId: String) {
    role(id: $roleId) {
      id
      name
    }
  }
`;
