import { gql } from '@apollo/client/core'

// 全ての部屋を取得するクエリ
export const GET_ROOMS = gql`
  query get_rooms {
    rooms {
      id
      
    } 
  }
`

// 新しい部屋が作成されたときに通知するサブスクリプション
export const ROOM_ADDED = gql`
  subscription RoomAdded {
    roomAdded {
      id
      users {
        id
        name
      }
    }
  }
`

// ユーザー登録ミューテーション
export const POST_REGISTER = gql`
  mutation PostRegister($email: EmailAddress!, $name: String!, $password: String!) {
    post_register(input: { email: $email, name: $name, password: $password }) {
      token
    }
  }
`

// ユーザー情報を取得するクエリ
export const GET_USER = gql`
  query GetUser {
    user {
      email
      name
      password
    }
  }
`