export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url)
    const path = url.pathname

    if (path === '/') {
      return Response.redirect(new URL('/login.html', req.url), 302)
    }

    const json = (d, s = 200) =>
      new Response(JSON.stringify(d), {
        status: s,
        headers: { 'Content-Type': 'application/json' }
      })

    const getUser = async () => {
      const token = req.headers.get('Authorization')
      if (!token) return null
      return env.USER_PREFSS.get(`session:${token}`)
    }

    /* REGISTER */
    if (req.method === 'POST' && path === '/api/register') {
      const { email, password } = await req.json()
      if (!email || !password) return json({ error: 'Required' }, 400)

      if (await env.USER_PREFSS.get(`user:${email}`))
        return json({ error: 'User exists' }, 409)

      await env.USER_PREFSS.put(
        `user:${email}`,
        JSON.stringify({ email, password })
      )
      return json({ success: true })
    }

    /* LOGIN */
    if (req.method === 'POST' && path === '/api/login') {
      const { email, password } = await req.json()
      const user = await env.USER_PREFSS.get(`user:${email}`, { type: 'json' })

      if (!user || user.password !== password)
        return json({ error: 'Invalid credentials' }, 401)

      const token = crypto.randomUUID()
      await env.USER_PREFSS.put(`session:${token}`, email, {
        expirationTtl: 86400
      })

      return json({ token })
    }

    /* AUTH GUARD */
    if (
      path.startsWith('/api/') &&
      path !== '/api/login' &&
      path !== '/api/register'
    ) {
      if (!(await getUser()))
        return json({ error: 'Unauthorized' }, 401)
    }

    /* GET EXPENSES */
    if (req.method === 'GET' && path === '/api/expenses') {
      const { results } = await env.expense_db
        .prepare(
          `SELECT * FROM expenses
           WHERE status='ACTIVE'
           ORDER BY expense_date DESC`
        )
        .all()
      return json(results)
    }

    /* ADD EXPENSE */
    if (req.method === 'POST' && path === '/api/expenses') {
      const data = await req.json()

      const result = await env.expense_db
        .prepare(
          `INSERT INTO expenses (title,amount,category,expense_date)
           VALUES (?,?,?,?)`
        )
        .bind(
          data.title,
          data.amount,
          data.category || 'Other',
          data.date
        )
        .run()

      return json({ success: true })
    }

    /* UPDATE EXPENSE */
    if (req.method === 'PUT' && path.startsWith('/api/expenses/')) {
      const id = path.split('/').pop()
      const data = await req.json()

      await env.expense_db
        .prepare(
          `UPDATE expenses SET title=?, category=? WHERE id=?`
        )
        .bind(data.title, data.category, id)
        .run()

      return json({ updated: true })
    }

    /* DELETE EXPENSE */
    if (req.method === 'DELETE' && path.startsWith('/api/expenses/')) {
      const id = path.split('/').pop()

      await env.expense_db
        .prepare(
          `UPDATE expenses SET status='DELETED' WHERE id=?`
        )
        .bind(id)
        .run()

      return json({ deleted: true })
    }

    return new Response('Not Found', { status: 404 })
  }
}
