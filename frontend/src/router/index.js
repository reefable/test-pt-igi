import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

// Lazy load views for performance
const Login = () => import('../views/Login.vue');
const ProductList = () => import('../views/ProductList.vue');
const CreateOrder = () => import('../views/CreateOrder.vue');
const OrderHistory = () => import('../views/OrderHistory.vue');

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/products', name: 'Products', component: ProductList, meta: { requiresAuth: true } },
  { path: '/order/new', name: 'CreateOrder', component: CreateOrder, meta: { requiresAuth: true } },
  { path: '/orders', name: 'OrderHistory', component: OrderHistory, meta: { requiresAuth: true } },
  { path: '/', redirect: '/products' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/products');
  } else {
    next();
  }
});

export default router;