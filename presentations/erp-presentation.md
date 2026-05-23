# ERP Presentation — Aroma Lab
### Enterprise Resource Planning

**Duration: 8-12 minutes**

---

## Slide 1: Title

**Aroma Lab — ERP System for Multi-Branch Coffee Chain**

Student: Bauyrzhan Shamenov
Course: Enterprise Resource Planning
Date: April 2025

---

## Slide 2: Organization Overview

**Aroma Lab** — coffee chain with 6 branches across Almaty, Kazakhstan

| Aspect | Detail |
|--------|--------|
| Branches | 6 locations |
| Employees | 14 staff (baristas, managers, accountant) |
| Products | 12 menu items (coffee, food, desserts) |
| Ingredients | 25 raw materials |
| Daily Transactions | ~24 sales per day |
| Revenue | ~55,000 KZT/day |

**Problem**: Each department (sales, inventory, finance) operates in an information silo. Data is recorded on paper, decisions are delayed, errors are frequent.

---

## Slide 3: As-Is Process (BPMN — Manual)

**Current "Order-to-Cash" Process — 5 Roles, All Manual**

```
Customer → Barista → Manager → Accountant → Supplier
```

| Step | Who | How | Time |
|------|-----|-----|------|
| Take order | Barista | Written on paper | 2-3 min |
| Record payment | Barista | Cash register | Manual |
| Count stock | Manager | Physical count at end of day | 30 min |
| Reorder supplies | Manager | Phone call to supplier | Next day |
| Create invoice | Accountant | From paper receipts | Days later |
| Monthly report | Accountant | Manual spreadsheet | Weekly effort |

**Pain Points**: 5% error rate, no real-time visibility, delayed invoicing, information silos

---

## Slide 4: To-Be Process (BPMN — Automated)

**Automated Process — 4 System Steps Replace Manual Work**

```
Barista uses POS → SYSTEM automatically:
  1. Deducts stock per recipe
  2. Generates fiscal invoice with VAT
  3. Updates stock alerts
  4. Refreshes KPI dashboard
```

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Sale recording | 2-3 min | 30 sec | 75% faster |
| Stock visibility | End of day | Real-time | Immediate |
| Invoice creation | Next day | Instant | 100% faster |
| KPI availability | Monthly | Real-time | 30x faster |
| Data entry errors | ~5% | ~0% | Eliminated |

---

## Slide 5: ERP System Selection

**Why Build Custom Instead of SAP / Odoo / 1C?**

| Criteria | SAP Business One | Odoo | 1C:Enterprise | Custom (Aroma Lab) |
|----------|-----------------|------|----------------|---------------------|
| Cost | $3,000+/user/yr | $24/user/mo | $500+/license | $0 (open-source) |
| Coffee-chain fit | Generic | Needs modules | RU-focused | Purpose-built |
| Setup time | Months | Weeks | Weeks | 6 weeks |
| Customization | Limited | Moderate | Moderate | Full |
| Learning curve | High | Medium | Medium | Low (intuitive POS) |

**Decision**: Custom system built with React + Node.js + SQLite — tailored to coffee chain operations, zero licensing cost, full control over features.

---

## Slide 6: IT Infrastructure

**3-Tier Architecture**

```
Presentation Tier    │  React 18 + Vite + Bootstrap 5
─────────────────────┼──────────────────────────────
Application Tier     │  Node.js + Express.js (18 REST endpoints)
─────────────────────┼──────────────────────────────
Data Tier            │  SQLite (14 tables, 4 triggers, 4 views)
```

**Cloud Deployment Model**: PaaS (Platform-as-a-Service)
- Backend: Railway / Render (auto-deploy from GitHub)
- Frontend: Vercel (optimized for React)
- Database: SQLite (embedded — no separate server)

**Hardware**: 512 MB RAM, 1 CPU core, 100 MB storage (minimal requirements)

---

## Slide 7: Database Schema (ER-Diagram)

**14 Tables with Key Relationships**

```
branch (6) ──┬── employee (14) ── position (8)
             ├── stock (150) ── ingredient (25)
             ├── sale (24+) ── sale_item (35+) ── product (12)
             └── purchase_order (3) ── purchase_item (3)

product ←──N:M──→ ingredient  (via recipe table, 36 rows)
sale ──1:1── invoice (auto-generated)
supplier (5) ── purchase_order
users (1) — authentication
```

**4 SQL Triggers**: auto-deduct stock, update sale total, create invoice, receive PO
**4 SQL Views**: food cost %, avg transaction, stock alerts, top products

---

## Slide 8: ERP Module 1 — Sales Management

**Scope**: Complete sales lifecycle — order to payment to receipt

**Pages**: POS (barista interface) + Sales History (manager view)

**Features**:
- Product grid with category filter and search
- Shopping cart with quantity adjustment
- 3 payment methods: Card, Kaspi QR, Cash
- Discount application (percentage-based)
- Digital receipt with fiscal number
- Cash change calculation

**How It Breaks Silos**:
- Before: Barista records on paper → Manager has no visibility → Accountant gets receipts days later
- After: One sale → instantly visible to all roles

---

## Slide 9: ERP Module 2 — Inventory Management

**Scope**: Stock tracking across all branches with auto-deduction and purchase orders

**Page**: Inventory (stock levels, alerts, POs)

**Features**:
- Real-time stock levels per branch
- Automatic stock deduction via recipe (SQLite trigger)
- Three-level alert system:

| Level | Condition | Action |
|-------|-----------|--------|
| CRITICAL (Red) | qty < min_stock | Immediate purchase order |
| WARNING (Yellow) | qty < min_stock x 1.3 | Plan reorder |
| OK (Green) | qty >= min_stock x 1.3 | No action |

- Purchase order creation and receipt → auto-replenish stock

**Automation**: When a Cappuccino is sold → coffee beans (-18g), milk (-150ml), cup (-1), lid (-1) — all deducted automatically

---

## Slide 10: ERP Module 3 — Finance / Accounting

**Scope**: Invoice automation, VAT calculation, financial analytics

**Pages**: Finance (invoices, GL entries) + Dashboard (KPIs, charts)

**Features**:
- Auto-generated fiscal invoice for every sale (SQLite trigger)
- VAT calculation at 12% (Kazakhstan tax rate)
- Fiscal number format: FN-YYYYMMDD-NNNNNN
- Revenue summary with VAT breakdown
- General ledger simulation (Dr Cash / Cr Revenue / Cr VAT)

**How It Breaks Silos**:
- Before: Accountant manually creates invoices from paper receipts
- After: Invoice auto-created with each sale → real-time revenue dashboard

---

## Slide 11: Cross-Module Integration (Process Automation Demo)

**One Sale Triggers All 3 Modules**

```
POS: Create sale (Cappuccino + Latte)
         │
         ├──→ INVENTORY: Stock deducted (8 ingredients updated)
         ├──→ FINANCE: Invoice auto-generated (FN-20250427-000025)
         └──→ DASHBOARD: KPIs recalculated
```

**Demo Script**:
1. Open POS → Add Cappuccino + Latte → Pay by card
2. Navigate to Inventory → See reduced stock levels
3. Navigate to Finance → See new invoice with VAT
4. Navigate to Dashboard → See updated KPIs

This is the core value of ERP: **integrated data flow between departments**.

---

## Slide 12: KPI Dashboard

**3 Key Performance Indicators**

| KPI | Formula | Current | Target | Status |
|-----|---------|---------|--------|--------|
| Food Cost % | COGS / Revenue x 100 | 15.7% | < 30% | On target |
| Avg Transaction | Revenue / Transactions | 2,382 KZT | > 2,000 KZT | On target |
| Stock Health | OK items / Total items | 97% | > 90% | On target |

**Dashboard Charts**:
- Daily revenue bar chart (last 30 days) — Recharts BarChart
- Stock health donut chart (OK / Warning / Critical) — Recharts PieChart
- Top products ranked table

**Business Decisions**: If Food Cost > 30% → review recipes. If Stock Health < 90% → trigger purchase orders.

---

## Slide 13: Implementation Roadmap

**5-Stage ERP Implementation Life Cycle**

| Stage | Duration | Activities |
|-------|----------|-----------|
| 1. Discovery & Planning | 2 weeks | Stakeholder interviews, As-Is BPMN, requirements |
| 2. Design & Architecture | 1 week | ER-diagram, API contracts, wireframes |
| 3. Development & Build | 3 weeks | Auth, POS, inventory, finance, dashboard |
| 4. Testing & UAT | 1 week | API testing, E2E automation flow, user acceptance |
| 5. Deployment & Go-Live | 1 week | Documentation, presentation, GitHub submission |

**Total**: 8 weeks from discovery to go-live

---

## Slide 14: Risks & Mitigation

| Risk | P x I | Score | Mitigation |
|------|-------|-------|------------|
| User resistance to new system | 3 x 4 | 12 | Intuitive POS (touch-friendly), demo credentials, gradual rollout |
| Data migration from manual records | 3 x 3 | 9 | Seed data (150+ rows), spreadsheet templates, parallel running |
| System downtime during peak hours | 2 x 5 | 10 | SQLite (embedded DB), cached POS data, paper fallback |

**Key Insight**: Choosing SQLite (embedded database) eliminates an entire class of infrastructure risks — no separate database server to fail.

---

## Slide 15: Conclusion & Next Steps

**Delivered**:
- 3 integrated ERP modules breaking information silos
- 4 automated processes (stock, invoicing, alerts, replenishment)
- 3 real-time KPIs with management dashboard
- 14-table relational database with 150+ seed records

**Next Steps (Future Scope)**:
- Mobile app for baristas (React Native)
- Multi-language support (Kazakh, Russian, English)
- PostgreSQL migration for production scale
- Integration with Kaspi Pay API for real payments
- HR module for shift scheduling and payroll

**Thank you! Questions?**

Demo: admin / 1234 | GitHub: [repository link]
