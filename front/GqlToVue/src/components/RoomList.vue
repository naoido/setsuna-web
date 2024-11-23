<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-toolbar flat>
          <v-toolbar-title>Rooms</v-toolbar-title>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-for="room in rooms" :key="room.id" cols="12" md="4">
        <v-card class="mb-4">
          <v-card-item>
            <v-card-title>Room {{ room.id }}</v-card-title>
            <v-card-subtitle>Users: {{ room.users.length }}</v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useQuery, useSubscription } from '@vue/apollo-composable'
import { GET_ROOMS, ROOM_ADDED } from '../graphql/queries'

const rooms = ref([])
const loading = ref(true)

onMounted(() => {
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
body {
  background-color: white;
}

.v-toolbar-title {
  font-size: 24px;
  font-weight: bold;
  color: black;
}

.v-card-title {
  font-size: 20px;
  font-weight: bold;
  color: black;
}

.v-card-subtitle {
  font-size: 16px;
  color: gray;
}
</style>