<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const orders = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await api.get('/orders');
    orders.value = res.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl font-bold mb-6">My Order History</h1>

    <div class="bg-white shadow overflow-hidden rounded-lg">
      <div v-if="loading" class="p-6 text-center text-gray-500">Loading history...</div>
      
      <div v-else-if="orders.length === 0" class="p-6 text-center text-gray-500">
        No orders found. <router-link to="/order/new" class="text-blue-600 hover:underline">Place your first order!</router-link>
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{{ order.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order.product_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ new Date(order.order_date).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{{ order.quantity }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">${{ order.total_price }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>