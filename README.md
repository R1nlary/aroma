# Aroma Lab ERP

Coffee-chain ERP system with Sales, Inventory, and Finance modules.  
Built with **React 18 + Vite** (frontend) and **Node.js + Express** (backend) on **SQLite**.

## Quick Start

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Seed admin user
cd ../server && node src/seed.js

# 3. Start both servers
npm run dev          # API on http://localhost:3001
cd ../client && npm run dev   # UI on http://localhost:5173
```

Login: `admin` / `1234`

## Features

| Page | Description |
|------|-------------|
| Landing | Hero section, features, contact form |
| Login | JWT authentication |
| Admin | Product CRUD (create, edit, delete) |
| POS | Point-of-sale: product grid, cart, payment, receipt |
| Sales | Sales history with detail view |
| Inventory | Stock levels, alerts (OK/Warning/Critical), purchase orders |
| Finance | Auto-generated invoices, VAT (12%), GL journal entries |
| Dashboard | 3 KPI cards, daily revenue chart, top products |

## ERP Automation

A single sale in POS triggers:
1. Stock deduction per recipe (SQLite trigger)
2. Invoice generation with fiscal number and VAT (SQLite trigger)
3. KPI dashboard updates in real-time (SQL views)

## Project Structure

```
aroma-lab/
├── server/
│   └── src/
│       ├── index.js              # Express entry point
│       ├── db.js                 # SQLite connection
│       ├── seed.js               # Create admin user
│       ├── middleware/auth.js    # JWT verification
│       ├── routes/               # 7 route files (18 endpoints)
│       └── services/             # Sale + purchase automation
├── client/
│   └── src/
│       ├── pages/                # 8 pages (Landing, Login, Admin, POS, Sales, Inventory, Finance, Dashboard)
│       ├── components/           # Navbar
│       ├── context/              # AuthContext (JWT)
│       └── hooks/                # useFetch
├── docs/
│   ├── pm/                       # 5 PM documentation files
│   └── erp/                      # 5 ERP documentation files
├── aroma_lab_en.db               # SQLite database (seed data included)
└── aroma_lab_sqlite_en.sql       # Schema reference (14 tables, 4 triggers, 4 views)
```

## Tech Stack

- **Frontend**: React 18, Vite, Bootstrap 5, Recharts
- **Backend**: Express.js, better-sqlite3, JWT, bcryptjs
- **Database**: SQLite (14 tables, 4 triggers, 4 views, 150+ seed rows)

## Documentation

### PM Project
- [Project Charter](docs/pm/01-project-charter.md)
- [Scope & Requirements (WBS)](docs/pm/02-scope-requirements.md)
- [Schedule & Resources (Gantt)](docs/pm/03-schedule-resources.md)
- [Risks & Stakeholders](docs/pm/04-risk-stakeholders.md)
- [Closure & Lessons Learned](docs/pm/05-closure-lessons.md)

### ERP Project
- [BPMN (As-Is / To-Be)](docs/erp/01-bpmn.md)
- [IT Infrastructure & ER-Diagram](docs/erp/02-infrastructure.md)
- [ERP Modules](docs/erp/03-modules.md)
- [Roadmap & Risks](docs/erp/04-roadmap-risks.md)
- [Analytics & KPIs](docs/erp/05-analytics-kpis.md)
