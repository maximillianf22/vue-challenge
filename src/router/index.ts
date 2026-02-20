import { createRouter, createWebHistory } from 'vue-router'
import ProductsPage from '@/features/products/pages/ProductsPage.vue'
import ProductDetailPage from '@/features/products/pages/ProductDetailPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/products',
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsPage,
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: ProductDetailPage,
    },
  ],
})
