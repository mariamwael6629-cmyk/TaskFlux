import client from './client'

export function register({ name, email, password }) {
  return client.post('/auth/register', { name, email, password }).then((r) => r.data)
}

export function login({ email, password }) {
  const form = new URLSearchParams()
  form.set('username', email)
  form.set('password', password)
  return client
    .post('/auth/login', form, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    .then((r) => r.data)
}

export function fetchMe() {
  return client.get('/auth/me').then((r) => r.data)
}
