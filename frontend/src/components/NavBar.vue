<script setup>
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <span class="text-xl font-bold text-blue-600">IGI SimpleOrder</span>
          
          <div v-if="authStore.isAuthenticated" class="ml-10 flex space-x-4">
            <router-link to="/products" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Products</router-link>
            <router-link to="/order/new" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">New Order</router-link>
            <router-link to="/orders" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">History</router-link>
          </div>
        </div>

        <div class="flex items-center">
          <div v-if="authStore.isAuthenticated" class="flex items-center gap-4">
            <span class="text-sm text-gray-500">Hi, {{ authStore.user?.username }}</span>
            <button @click="handleLogout" class="text-red-500 hover:text-red-700 text-sm font-medium">Logout</button>
          </div>
          <router-link v-else to="/login" class="text-blue-600 hover:text-blue-800 font-medium">Login</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@reference "../assets/main.css";    
.router-link-active {
  @apply text-blue-600 font-bold bg-blue-50;
}
</style>