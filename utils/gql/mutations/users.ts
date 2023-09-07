import { gql } from '@apollo/client';

export const UPSERT_USER = gql`
  mutation Mutation($where: UserWhereUniqueInput!, $data: UserCreateInput) {
    upsertUser(where: $where, data: $data) {
      id
    }
  }
`;

export const DELETE_USER = gql`
  mutation Mutation($where: UserWhereUniqueInput!) {
    deleteUser(where: $where) {
      deleted
      id
    }
  }
`;
