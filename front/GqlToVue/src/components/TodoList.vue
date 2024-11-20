<template>
  <div>
    <h1>Todo List</h1>
    <div v-if="loading">Loading...</div>
    <ul v-else>
      <li v-for="todo in todos" :key="todo.id">
        <p>{{ todo.text }} ({{ todo.done ? 'Done' : 'Not Done' }})</p>
        <p>Created by: {{ todo.user.name }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useQuery, useSubscription } from '@vue/apollo-composable'
import { GET_TODOS, TODO_ADDED } from '../graphql/queries'

// todosのリストを格納するためのrefを作成します
const todos = ref([])

// ローディング状態を格納するためのrefを作成します
const loading = ref(true)

// コンポーネントがマウントされたときにデータを取得します
onMounted(() => {
  const { result, loading: queryLoading, error } = useQuery(GET_TODOS)

  // エラーが発生した場合に詳細を表示します
  if (error.value) {
    console.error('GraphQL Error:', error.value)
  }

  // データが取得されたらtodosに格納します
  watch(result, (newResult) => {
    if (newResult) {
      todos.value = newResult.todos
      loading.value = queryLoading.value
      console.log('Data updated:', todos.value)
    }
  })

  // サブスクリプションを使用してリアルタイムにデータを更新します
  const { result: subscriptionResult, error: subscriptionError } = useSubscription(TODO_ADDED)
  watch(subscriptionResult, (newSubscriptionResult) => {
    if (newSubscriptionResult) {
      todos.value = [...todos.value, newSubscriptionResult.todoAdded]
      console.log('New todo added:', newSubscriptionResult.todoAdded)
    }
    if (subscriptionError.value) {
      console.error('Subscription Error:', subscriptionError.value)
    }
  })
})
</script>

<style scoped>
/* スタイルを追加します */
</style>