import client from './client'

export const getOperations = () => client.get('/operations')

export const createOperation = (data) => client.post('/operations', data)

export const updateOperation = (id, data) => client.put(`/operations/${id}`, data)

export const deleteOperation = (id) => client.delete(`/operations/${id}`)
