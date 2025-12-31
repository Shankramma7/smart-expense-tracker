CREATE TABLE expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  amount REAL,
  category TEXT,
  expense_date TEXT,
  status TEXT DEFAULT 'ACTIVE',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

