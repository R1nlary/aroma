# PM Presentation — Aroma Lab ERP
### Project Management for IT

---

## Slide 1: Title

**Aroma Lab — ERP System for Coffee Chain**

Student: Bauyrzhan Shamenov
Course: Project Management for IT
Date: April 2025

---

## Slide 2: Problem Statement

**Current Situation (As-Is)**
- 6 coffee shop branches in Almaty operate with manual processes
- Orders written on paper — 5% error rate
- Stock counted manually at end of day — stockouts discovered too late
- Invoices created days after sales — delayed financial visibility
- No KPI tracking — monthly reports compiled by hand

**Impact**: Lost revenue, wasted ingredients, delayed decisions

---

## Slide 3: Project Scope & Goals

**SMART Goals**:
1. Reduce order processing time by 75% (from 3 min to 30 sec)
2. Achieve real-time stock visibility across all 6 branches
3. Automate 100% of invoice generation with VAT calculation
4. Deliver a working MVP within 6 weeks

**Scope**: 3 ERP modules (Sales, Inventory, Finance) + Management Dashboard

**Out of Scope**: HR/payroll, mobile app, multi-language support

---

## Slide 4: Work Breakdown Structure (WBS)

```
Aroma Lab ERP
├── 1. Planning (2 weeks)
│   ├── Requirements gathering
│   ├── Stakeholder interviews
│   └── Project charter
├── 2. Backend Development (2 weeks)
│   ├── Database schema (14 tables)
│   ├── REST API (18 endpoints)
│   └── Process automation (4 triggers)
├── 3. Frontend Development (2 weeks)
│   ├── 8 pages (Landing → Dashboard)
│   └── ERP module UIs
├── 4. Testing (1 week)
│   └── API + UI + E2E automation flow
└── 5. Deployment (1 week)
    ├── Documentation (10 files)
    └── GitHub submission
```

**8 User Stories** prioritized as P1 (must-have) → P3 (nice-to-have)

---

## Slide 5: Schedule (Gantt Chart)

| Week | Phase | Deliverables |
|------|-------|-------------|
| 1-2 | Planning | Charter, WBS, Backlog |
| 3 | Design | Schema, API contracts, wireframes |
| 4 | Foundation | Auth, CRUD, Landing page |
| 5 | Core ERP | POS, sales automation, inventory |
| 6 | Analytics | Finance, dashboard, KPIs |
| 7 | Testing | UAT, seed data validation |
| 8 | Deploy | Docs, presentation, handoff |

**Milestones**: M1 (Plan approved) → M2 (Backend ready) → M3 (MVP complete) → M4 (Handoff)

---

## Slide 6: Resources & Budget

**Team**: 1 developer (full-stack), 1 domain expert (stakeholder)

**Cost-Benefit Analysis**:

| Item | Cost (KZT) |
|------|-----------|
| Development (160 hrs x 5,000) | 800,000 |
| Cloud hosting (12 months) | 36,000 |
| **Total Investment** | **836,000** |

| Benefit | Annual Savings |
|---------|---------------|
| Reduced labor (manual counting) | 480,000 |
| Reduced waste (stock alerts) | 360,000 |
| Faster invoicing | 240,000 |
| **Total Savings** | **1,080,000** |

**ROI**: Breakeven in ~9 months

---

## Slide 7: Risk Management

| # | Risk | P | I | Score | Mitigation |
|---|------|---|---|-------|------------|
| R1 | User resistance | 3 | 4 | 12 | Intuitive UI, training |
| R2 | Data migration errors | 3 | 3 | 9 | Seed data, gradual entry |
| R3 | Scope creep | 4 | 5 | 20 | MoSCoW prioritization |
| R4 | Tech debt | 3 | 3 | 9 | Code reviews |
| R5 | System downtime | 2 | 5 | 10 | SQLite (embedded), fallback |

**Highest risk**: R3 (Scope Creep) — mitigated by strict P1/P2/P3 prioritization

---

## Slide 8: MVP Demo

**Live Demo Flow**:

1. **Landing Page** — public-facing site with contact form
2. **Login** — JWT authentication (admin / 1234)
3. **Admin** — Create, edit, delete products (CRUD)
4. **POS** — Create a sale (Cappuccino + Latte)
5. **Inventory** — See stock reduced automatically
6. **Finance** — See auto-generated invoice with VAT
7. **Dashboard** — See KPIs update in real-time

**Tech Stack**: React 18 + Node.js + Express + SQLite

---

## Slide 9: Results & Lessons Learned

**Delivered**:
- 8 functional pages, 18 API endpoints
- 14-table database with 150+ seed records
- 4 automated triggers (stock, invoice, totals, PO receipt)
- 10 documentation files

**Key Lessons**:
1. SQLite triggers eliminated need for complex backend logic
2. Seed data was critical for meaningful KPI demos
3. MoSCoW prioritization prevented scope creep
4. One codebase can satisfy both PM and ERP requirements

---

## Slide 10: Thank You

**Aroma Lab ERP** — from manual chaos to integrated coffee chain management

- GitHub: [repository link]
- Tech: React + Node.js + SQLite
- Demo: admin / 1234

**Questions?**
