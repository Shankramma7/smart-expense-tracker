// Redirect if not logged in
if (!localStorage.getItem('token')) {
  location.href = '/login.html'
}

const token = localStorage.getItem('token')

let allExpenses = []
let editingId = null

// Helper for API calls
function api(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    }
  })
}

// Logout
function logout() {
  localStorage.clear()
  location.href = '/login.html'
}

// Load expenses
async function loadExpenses() {
  try {
    const res = await api('/api/expenses')
    allExpenses = await res.json()
    renderExpenses(allExpenses)
  } catch (err) {
    console.error('Failed to load expenses', err)
  }
}

// Render expenses + summaries
function renderExpenses(data) {
  const list = document.getElementById('list')
  const categorySummary = document.getElementById('categorySummary')
  const dateSummary = document.getElementById('dateSummary')
  const daily = document.getElementById('daily')
  const monthly = document.getElementById('monthly')

  list.innerHTML = ''
  categorySummary.innerHTML = ''
  dateSummary.innerHTML = ''

  const categoryTotals = {}
  const dateTotals = {}

  const today = new Date().toISOString().slice(0, 10)
  const currentMonth = today.slice(0, 7)

  let dailyTotal = 0
  let monthlyTotal = 0

  data.forEach(e => {
    const amount = Number(e.amount) || 0

    // Category total
    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + amount

    // Date total
    dateTotals[e.expense_date] =
      (dateTotals[e.expense_date] || 0) + amount

    // Daily total
    if (e.expense_date === today) {
      dailyTotal += amount
    }

    // Monthly total
    if (e.expense_date.startsWith(currentMonth)) {
      monthlyTotal += amount
    }

    // Expense list UI
    list.innerHTML += `
      <li>
        <div>
          <b>${e.title}</b>
          <small>📅 ${e.expense_date}</small>
        </div>

        <div>
          ₹${amount}
          <span>${e.category}</span>
          <button onclick="openEdit(${e.id}, '${e.title}', '${e.category}')">EDIT</button>
          <button onclick="deleteExpense(${e.id})">DELETE</button>
        </div>
      </li>
    `
  })

  // Update totals
  daily.innerText = `Today Total: ₹${dailyTotal}`
  monthly.innerText = `Monthly Total: ₹${monthlyTotal}`

  // Category summary UI
  Object.entries(categoryTotals).forEach(([cat, total]) => {
    categorySummary.innerHTML += `<li>${cat}: ₹${total}</li>`
  })

  // Date summary UI
  Object.entries(dateTotals).forEach(([date, total]) => {
    dateSummary.innerHTML += `<li>${date}: ₹${total}</li>`
  })
}

// Add expense
async function addExpense() {
  const title = document.getElementById('title')
  const amount = document.getElementById('amount')
  const date = document.getElementById('date')
  const category = document.getElementById('category')

  if (!title.value || !amount.value || !date.value) {
    alert('Please fill all fields')
    return
  }

  await api('/api/expenses', {
    method: 'POST',
    body: JSON.stringify({
      title: title.value,
      amount: amount.value,
      date: date.value,
      category: category.value
    })
  })

  // Clear inputs
  title.value = ''
  amount.value = ''
  date.value = ''
  category.value = ''

  loadExpenses()
}

// Open edit modal
function openEdit(id, title, category) {
  editingId = id
  document.getElementById('editTitle').value = title
  document.getElementById('editCategory').value = category
  document.getElementById('editModal').classList.remove('hidden')
}

// Save edited expense
async function saveEdit() {
  await api(`/api/expenses/${editingId}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: document.getElementById('editTitle').value,
      category: document.getElementById('editCategory').value
    })
  })

  closeEdit()
  loadExpenses()
}

// Close edit modal
function closeEdit() {
  document.getElementById('editModal').classList.add('hidden')
}

// Delete expense
async function deleteExpense(id) {
  if (!confirm('Delete this expense?')) return

  await api(`/api/expenses/${id}`, {
    method: 'DELETE'
  })

  loadExpenses()
}

// Initial load
loadExpenses()
