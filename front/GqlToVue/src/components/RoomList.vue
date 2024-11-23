<template>
  <v-container>
    <h1>Rooms</h1>
    
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-for="room in rooms" :key="room.id" cols="12" md="6">
        <v-card  color="white" hover link prepend-icon="mdi-fencing">
          <v-card-item >
            <v-card-title>Room {{ room.id }}</v-card-title>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useQuery, useSubscription, useMutation } from '@vue/apollo-composable'
import { GET_ROOMS, ROOM_ADDED, POST_REGISTER } from '../graphql/queries'
import Cookies from 'js-cookie'

const rooms = ref([])
const loading = ref(true)

const email = ref('akb@a')
const name = ref('ak')
const password = ref('ak')




//const { mutate: register, onDone } = useMutation(POST_REGISTER)

onMounted(() => {
  /* ユーザー登録ミューテーションを実行し、トークンをクッキーに保存
  register({ email: email.value, name: name.value, password: password.value })
  onDone(({ data }) => {
     if (data && data.post_register && data.post_register.token) {
       Cookies.set('authToken', data.post_register.token, { expires: 7 }) // トークンをクッキーに保存（有効期限7日）
       console.log('Token saved:', data.post_register.token)
     }
  })*/

  const { result, loading: queryLoading, error } = useQuery(GET_ROOMS)

  if (error.value) {
    console.error('GraphQL Error:', error.value)
  }

  watch(result, (newResult) => {
    if (newResult) {
      rooms.value = newResult.rooms
      loading.value = queryLoading.value
      console.log('Data updated:', rooms.value)
    }
  })

  const { result: subscriptionResult, error: subscriptionError } = useSubscription(ROOM_ADDED)
  watch(subscriptionResult, (newSubscriptionResult) => {
    if (newSubscriptionResult) {
      rooms.value = [...rooms.value, newSubscriptionResult.roomAdded]
      console.log('New room added:', newSubscriptionResult.roomAdded)
    }
    if (subscriptionError.value) {
      console.error('Subscription Error:', subscriptionError.value)
    }
  })
})
</script>

<style scoped>


.v-card-title {
  font-size: 20px;
  font-weight: bold;
  color: gray;
}




</style>