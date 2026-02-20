export interface Product {
  id: number
  title: string
  price: number
  category: string
  description: string
  image: string
}

export interface ProductFilters {
  search: string
  category: string
  page: number
  pageSize: number
}

export interface ProductPage {
  items: Product[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}
