<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const products = ref([]);
const loading = ref(true);

const fetchProducts = async () => {
  try {
    const res = await api.get('/products');
    products.value = res.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProducts);
</script>

<template>
  <div class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl font-bold mb-6">Available Products</h1>
    
    <div v-if="loading" class="text-center text-gray-500">Loading products...</div>
    
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="product in products" :key="product.id" class="bg-white border rounded-lg shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">{{ product.name }}</h2>
          <p class="text-gray-500 mt-2">Stock: <span :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'">{{ product.stock }}</span></p>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <span class="text-xl font-bold text-blue-600">${{ product.price }}</span>
          <router-link to="/order/new" class="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded hover:bg-blue-100">Order Now</router-link>
        </div>
      </div>
    </div>
  </div>
</template>