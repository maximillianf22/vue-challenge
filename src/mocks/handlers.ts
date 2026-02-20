import { http, HttpResponse } from 'msw'

const products = [
  {
    id: 101,
    title: 'Mock Wireless Keyboard',
    price: 59.9,
    category: 'electronics',
    description: 'Mock product for predictable demos and tests.',
    image: 'https://picsum.photos/seed/mock-keyboard/240/240',
  },
  {
    id: 102,
    title: 'Mock Sport Jacket',
    price: 89.5,
    category: "men's clothing",
    description: 'MSW fallback item for offline development.',
    image: 'https://picsum.photos/seed/mock-jacket/240/240',
  },
]

export const handlers = [
  http.get('https://fakestoreapi.com/products', () => HttpResponse.json(products)),
  http.get('https://fakestoreapi.com/products/categories', () => {
    const categories = Array.from(new Set(products.map((product) => product.category)))
    return HttpResponse.json(categories)
  }),
  http.get('https://fakestoreapi.com/products/category/:category', ({ params }) => {
    const category = decodeURIComponent(String(params.category))
    const filtered = products.filter((product) => product.category === category)
    return HttpResponse.json(filtered)
  }),
  http.get('https://fakestoreapi.com/products/:id', ({ params }) => {
    const found = products.find((product) => product.id === Number(params.id))

    if (!found) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(found)
  }),
]
