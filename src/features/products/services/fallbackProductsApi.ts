import type { Product } from '@/core/products/domain/entities/Product'

const fallbackProducts: Product[] = [
  {
    id: 101,
    title: 'Mock Wireless Keyboard',
    price: 59.9,
    category: 'electronics',
    description: 'Local fallback product for unavailable API.',
    image: 'https://picsum.photos/seed/mock-keyboard/240/240',
  },
  {
    id: 102,
    title: 'Mock Sport Jacket',
    price: 89.5,
    category: "men's clothing",
    description: 'Local fallback product for unavailable API.',
    image: 'https://picsum.photos/seed/mock-jacket/240/240',
  },
]

export const fallbackProductsApi = {
  async all(category = 'all'): Promise<Product[]> {
    if (category === 'all') {
      return fallbackProducts
    }

    return fallbackProducts.filter((product) => product.category === category)
  },
  async categories(): Promise<string[]> {
    const values = Array.from(new Set(fallbackProducts.map((product) => product.category)))
    return ['all', ...values]
  },
  async one(id: number): Promise<Product | null> {
    return fallbackProducts.find((product) => product.id === id) ?? null
  },
}
