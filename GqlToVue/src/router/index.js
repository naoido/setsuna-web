import { createRouter, createWebHistory } from 'vue-router'
import RoomList from '../components/RoomList.vue'

const routes = [
  {
    path: '/',
    name: 'rooms',
    component: RoomList,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
