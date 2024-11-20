import './assets/main.css'
import { createApp, provide, h } from 'vue'
import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import App from './App.vue'
import router from './router'

// HTTPリンクを作成します
const httpLink = createHttpLink({
  uri: 'http://localhost:8080/query',
})

// WebSocketリンクを作成します
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:8080/query',
  options: {
    reconnect: true,
  },
})

// HTTPリンクとWebSocketリンクを分割します
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

// Apollo Clientを作成します
const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})

// Vueアプリケーションを作成します
const app = createApp({
  setup() {
    // Apollo Clientを提供します
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App),
})

// ルーターを使用するように設定します
app.use(router)

// アプリケーションをマウントします
app.mount('#app')
