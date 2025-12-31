# 💰 Smart Expense Tracker

A full-stack expense tracking application built using **Cloudflare Workers**, **D1 SQL**, and **KV**, featuring authentication, CRUD operations, summaries, and a modern UI.

---

## 🚀 Live Demo
🔗 smart-expense-tracker.shankrammalingadahalli.workers.dev

---

## 📌 Features

### 🔐 Authentication
- User Registration
- User Login
- Logout
- Session management using Cloudflare KV

### 💸 Expense Management (CRUD)
- Add expense (name, amount, date)
- Edit expense (name, category)
- Delete expense
- Expense list with real-time updates

### 📊 Insights & Summaries
- Daily total expenses
- Monthly total expenses
- Category-wise summary
- Date-wise summary

### 🎨 UI/UX
- Modern glassmorphism UI
- Responsive design (mobile & desktop)
- Smooth animations
- Clean and professional layout

---

## 🛠 Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Cloudflare Workers
- **Database:** Cloudflare D1 (SQL)
- **Auth & Sessions:** Cloudflare KV
- **Deployment:** Cloudflare Workers

---

## 🗄 Database Schema

```sql
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  amount REAL,
  category TEXT,
  expense_date TEXT,
  status TEXT DEFAULT 'ACTIVE',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
