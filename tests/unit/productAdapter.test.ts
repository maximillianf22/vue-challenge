import { describe, expect, it } from 'vitest'
import {
  adaptFakeStoreProduct,
  adaptFakeStoreProducts,
} from '@/features/products/adapters/productAdapter'

describe('productAdapter', () => {
  it('maps fake store payload to domain shape', () => {
    const result = adaptFakeStoreProducts([
      {
        id: 1,
        title: 'Test',
        price: 10,
        category: 'electronics',
        description: 'Desc',
        image: 'img.png',
      },
    ])

    expect(result[0]).toEqual({
      id: 1,
      title: 'Test',
      price: 10,
      category: 'electronics',
      description: 'Desc',
      image: 'img.png',
    })
  })

  it('validates fake store product payload', () => {
    const result = adaptFakeStoreProduct({
      id: 2,
      title: 'A',
      price: 22,
      category: 'jewelery',
      description: 'D',
      image: 'i.png',
    })

    expect(result.id).toBe(2)
  })
})
