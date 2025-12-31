async function login() {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })

  const data = await res.json()
  if (!res.ok) return (msg.innerText = data.error)

  localStorage.setItem('token', data.token)
  location.href = '/dashboard.html'
}

async function register() {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })

  if (res.ok) location.href = '/login.html'
}
