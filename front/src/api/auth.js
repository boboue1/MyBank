import client from './client'

export const login = (email, password) =>
  client.post('/login', { email, password })

export const register = (email, password, firstName, lastName) =>
  client.post('/register', { email, password, firstName, lastName })

export const me = () => client.get('/me')
