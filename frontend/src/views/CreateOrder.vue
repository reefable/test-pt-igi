<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

const products = ref([]);
const selectedProductId = ref('');
const quantity = ref(1);
const message = ref({ type: '', text: '' });
const loading = ref(false);
const router = useRouter();

// Fetch products for dropdown
onMounted(async () => {
  try {
    const res = await api.get('/products');
    products.value = res.data;
  } catch (err) {
    message.value = { type: 'error', text: 'Failed to load products.' };
  }
});

const selectedProduct = computed(() => 
  products.value.find(p => p.id === selectedProductId.value)
);

const totalCost = computed(() => {
  if (!selectedProduct.value) return 0;
  return (selectedProduct.value.price * quantity.value).toFixed(2);
});

const submitOrder = async () => {
  if (!selectedProductId.value) return;
  
  loading.value = true;
  message.value = { type: '', text: '' };

  try {
    await api.post('/orders', {
      product_id: selectedProductId.value,
      quantity: quantity.value
    });
    
    message.value = { type: 'success', text: 'Order placed successfully!' };
    
    // Redirect after short delay
    setTimeout(() => router.push('/orders'), 1500);
  } catch (err) {
    message.value = { 
      type: 'error', 
      text: err.response?.data?.error || 'Failed to place order.' 
    };
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto py-10 px-4 sm:px-6">
    <div class="bg-white shadow rounded-lg p-8">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Place New Order</h2>

      <div class="space-y-6">
        <!-- Product Select -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Select Product</label>
          <select v-model="selectedProductId" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 border focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option disabled value="">-- Choose a product --</option>
            <option v-for="p in products" :key="p.id" :value="p.id" :disabled="p.stock === 0">
              {{ p.name }} - ${{ p.price }} (Stock: {{ p.stock }})
            </option>
          </select>
        </div>

        <!-- Quantity -->
        <div v-if="selectedProduct">
          <label class="block text-sm font-medium text-gray-700">Quantity</label>
          <input type="number" v-model="quantity" min="1" :max="selectedProduct.stock" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          <p class="mt-1 text-sm text-gray-500">Max available: {{ selectedProduct.stock }}</p>
        </div>

        <!-- Summary -->
        <div class="bg-gray-50 p-4 rounded-md flex justify-between items-center">
          <span class="font-medium text-gray-700">Total Cost:</span>
          <span class="text-xl font-bold text-blue-600">${{ totalCost }}</span>
        </div>

        <!-- Feedback Message -->
        <div v-if="message.text" :class="`p-4 rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`">
          {{ message.text }}
        </div>

        <!-- Action -->
        <button 
          @click="submitOrder" 
          :disabled="loading || !selectedProductId || quantity < 1"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {{ loading ? 'Processing...' : 'Confirm Order' }}
        </button>
      </div>
    </div>
  </div>
</template>