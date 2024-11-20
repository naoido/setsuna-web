import { gql } from '@apollo/client/core'

// 全てのTodoを取得するクエリ
export const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      text
      done
      user {
        id
        name
      }
    }
  }
`

// 新しいTodoが作成されたときに通知するサブスクリプション
export const TODO_ADDED = gql`
  subscription TodoAdded {
    todoAdded {
      id
      text
      done
      user {
        id
        name
      }
    }
  }
`