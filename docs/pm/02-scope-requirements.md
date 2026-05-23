# Scope & Requirements Management

## 1. Work Breakdown Structure (WBS)

```
1.0 Aroma Lab ERP MVP
│
├── 1.1 Planning & Design
│   ├── 1.1.1 Project Charter
│   ├── 1.1.2 Requirements gathering
│   ├── 1.1.3 Database schema design
│   ├── 1.1.4 UI/UX wireframes
│   └── 1.1.5 Technology stack selection
│
├── 1.2 Backend Development
│   ├── 1.2.1 Project setup (Express.js, SQLite)
│   ├── 1.2.2 Authentication module (JWT + bcrypt)
│   ├── 1.2.3 Product CRUD API
│   ├── 1.2.4 Sales API + automation service
│   ├── 1.2.5 Inventory API + alerts
│   ├── 1.2.6 Invoice API
│   └── 1.2.7 Dashboard / KPI API
│
├── 1.3 Frontend Development
│   ├── 1.3.1 Project setup (React + Vite)
│   ├── 1.3.2 Landing page with contact form
│   ├── 1.3.3 Login page
│   ├── 1.3.4 Admin page (product CRUD)
│   ├── 1.3.5 POS page
│   ├── 1.3.6 Inventory page
│   ├── 1.3.7 Finance page
│   └── 1.3.8 Dashboard page (KPI charts)
│
├── 1.4 Testing & Quality
│   ├── 1.4.1 API endpoint testing
│   ├── 1.4.2 UI testing (manual)
│   ├── 1.4.3 Automation flow verification
│   └── 1.4.4 Seed data validation
│
└── 1.5 Deployment & Documentation
    ├── 1.5.1 GitHub repository setup
    ├── 1.5.2 PM documentation
    ├── 1.5.3 ERP documentation
    ├── 1.5.4 Presentations
    └── 1.5.5 Final defense preparation
```

## 2. Product Backlog (Prioritized User Stories)

| Priority | ID | User Story | Acceptance Criteria |
|----------|-----|-----------|-------------------|
| P1 | US-01 | As an **admin**, I want to log in securely so that only authorized users can access the management system | JWT-based login with username/password; invalid credentials show error; session persists via token |
| P1 | US-02 | As a **barista**, I want to create sales orders via POS so that I can serve customers quickly | Product grid with categories; cart with qty adjustment; payment method selection; receipt on completion |
| P1 | US-03 | As a **manager**, I want stock to auto-deduct on sale so that inventory is always accurate | When a sale is completed, ingredient quantities decrease according to recipes |
| P2 | US-04 | As an **accountant**, I want invoices auto-generated so that I don't create them manually | Each sale auto-creates an invoice with fiscal number and VAT calculation (12%) |
| P2 | US-05 | As a **manager**, I want to see KPI dashboards so that I can make data-driven decisions | Dashboard shows food cost %, avg transaction value, stock health with charts |
| P2 | US-06 | As a **manager**, I want low-stock alerts so that I can prevent stockouts | Inventory page highlights CRITICAL and WARNING items based on min_stock thresholds |
| P3 | US-07 | As an **admin**, I want to manage products (create/edit/delete) to keep the menu up to date | CRUD form; table with all products; edit inline; delete with confirmation |
| P3 | US-08 | As a **visitor**, I want to see a professional landing page to understand the product | Hero section, feature cards, contact form; responsive design |

## 3. Sprint Plan (2-week sprints)

| Sprint | Duration | Stories | Deliverables |
|--------|----------|---------|--------------|
| Sprint 1 | Week 1-2 | US-01, US-07, US-08 | Login, CRUD, Landing page |
| Sprint 2 | Week 3-4 | US-02, US-03, US-04 | POS, stock automation, invoices |
| Sprint 3 | Week 5-6 | US-05, US-06 | Dashboard, inventory alerts, documentation |
