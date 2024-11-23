import './assets/base.css'
import './assets/main.css'
import { createApp, provide, h } from 'vue'
import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/client/link/context'
import Cookies from 'js-cookie'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// HTTPリンクを作成します
const httpLink = createHttpLink({
  uri: 'http://localhost:8080/query',
})

// WebSocketリンクを作成します
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:8080/query',
  options: {
    reconnect: true, // 接続が切れた場合に自動的に再接続するオプション
    connectionParams: {
      authToken: Cookies.get('authToken'), // クッキーからトークンを取得
    },
    lazy: true,
    inactivityTimeout: 30000, // アイドルタイムアウトを設定
  },
})

// 認証リンクを作成します
const authLink = setContext((_, { headers }) => {
  const token = Cookies.get('authToken') // クッキーからトークンを取得
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
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
  authLink.concat(httpLink)
)

// Apollo Clientを作成します
const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})

const vuetify = createVuetify({
  components,
  directives,
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
app.use(vuetify)

// アプリケーションをマウントします
app.mount('#app')
