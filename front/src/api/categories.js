import client from './client'

export const getCategories  = ()          => client.get('/categories')
export const createCategory = (title)     => client.post('/categories', { title })
export const updateCategory = (id, title) => client.put(`/categories/${id}`, { title })
export const deleteCategory = (id)        => client.delete(`/categories/${id}`)
