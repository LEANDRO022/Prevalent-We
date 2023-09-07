import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query Users(
    $where: UserWhereFilterInput
    $take: Int
    $skip: Int
    $orderBy: OrderByInputUser
  ) {
    users(where: $where, take: $take, skip: $skip, orderBy: $orderBy) {
      id
      firstName
      enabled
      email
      deleted
      company {
        name
      }
      lastName
      role {
        name
      }
      profile {
        phone
        title
        address
        city {
          name
          state {
            name
            country {
              name
            }
          }
        }
      }
    }
  }
`;

export const GET_USER = gql`
  query Query($userId: String!) {
    user(id: $userId) {
      id
      lastName
      firstName
      company {
        id
        name
      }
      deleted
      email
      enabled
      image
      profile {
        phone
        id
        city {
          Company {
            id
            name
          }
          code
        }
        title
        address
      }
      role {
        name
        id
      }
    }
  }
`;

export const GET_USERS_COUNT = gql`
  query Query($where: UserWhereFilterInput) {
    usersCount(where: $where)
  }
`;
