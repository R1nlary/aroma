# IT Infrastructure & Data Design

## 1. System Architecture

### 3-Tier Architecture

```
┌─────────────────────────────────────────────────────┐
│                  PRESENTATION TIER                    │
│                                                       │
│   React 18 + Vite         Bootstrap 5 + Recharts     │
│   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│   │Landing│ │Login │ │Admin │ │ POS  │ │Dashb.│    │
│   └──────┘ └──────┘ └──────┘ └──────┘ └──────┘    │
│                      ▲                               │
│                      │ HTTP / JSON (REST API)        │
├──────────────────────┼──────────────────────────────┤
│                  APPLICATION TIER                     │
│                      ▼                               │
│   Node.js + Express.js                               │
│   ┌──────────────────────────────────────────┐      │
│   │  Routes: auth, products, sales,           │      │
│   │          inventory, invoices, dashboard    │      │
│   ├──────────────────────────────────────────┤      │
│   │  Services: sale.service (automation),      │      │
│   │            purchase.service               │      │
│   ├──────────────────────────────────────────┤      │
│   │  Middleware: JWT auth, CORS, JSON parser  │      │
│   └──────────────────────────────────────────┘      │
│                      ▲                               │
│                      │ SQL via better-sqlite3        │
├──────────────────────┼──────────────────────────────┤
│                    DATA TIER                          │
│                      ▼                               │
│   SQLite (aroma_lab_en.db)                           │
│   ┌──────────────────────────────────────────┐      │
│   │  14 Tables │ 4 Triggers │ 4 Views        │      │
│   │  6 Indexes │ Seed data (150+ rows)       │      │
│   └──────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────┘
```

## 2. Cloud Deployment Model

### Options Analysis

| Model | Description | Example | Pros | Cons |
|-------|-------------|---------|------|------|
| **IaaS** | Rent virtual machine, install everything | Hetzner VPS, AWS EC2 | Full control | Must manage OS, runtime, security |
| **PaaS** (Recommended) | Platform manages runtime | Railway (backend) + Vercel (frontend) | Easy deployment, auto-scaling | Less control, vendor lock-in |
| **SaaS** | Aroma Lab *is* the SaaS product | — | End users just open browser | Development effort needed |

### Recommended Stack
- **Backend**: Deploy on **Railway** or **Render** (PaaS) — auto-deploys from GitHub
- **Frontend**: Deploy on **Vercel** — optimized for React/Vite, free tier
- **Database**: SQLite file bundled with backend (for MVP); migrate to PostgreSQL for production

### Hardware Requirements
| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Server RAM | 512 MB | 1 GB |
| Storage | 100 MB | 500 MB |
| CPU | 1 core | 2 cores |
| Client | Any modern browser | Chrome/Firefox/Safari |

---

## 3. Relational Database Schema (ER-Diagram)

### Entity-Relationship Diagram

```
                    ┌──────────┐
                    │  branch  │
                    ├──────────┤
                    │ branch_id│ PK
                    │ name     │
                    │ address  │
                    │ phone    │
                    └────┬─────┘
                         │
           ┌─────────────┼─────────────┬──────────────┐
           │1:N          │1:N          │1:N           │1:N
    ┌──────┴─────┐ ┌─────┴──────┐ ┌───┴────────┐ ┌──┴──────────┐
    │  employee  │ │   stock    │ │    sale     │ │purchase_order│
    ├────────────┤ ├────────────┤ ├────────────┤ ├─────────────┤
    │employee_id │ │ stock_id   │ │ sale_id    │ │ po_id       │
    │ full_name  │ │ branch_id  │FK│ branch_id │FK│ supplier_id│FK
    │ branch_id  │FK│ingredient │FK│employee_id│FK│ branch_id  │FK
    │position_id │FK│  _id      │ │ sale_time  │ │ order_date │
    │ hire_date  │ │ quantity   │ │total_amount│ │ status     │
    │hourly_rate │ │last_updated│ │payment_meth│ │total_amount│
    │ is_active  │ └──────┬─────┘ └──────┬─────┘ └──────┬─────┘
    └──────┬─────┘        │              │               │
           │              │         1:N  │          1:N  │
    ┌──────┴──────┐       │     ┌────────┴──┐   ┌───────┴───────┐
    │  position   │       │     │ sale_item  │   │ purchase_item │
    ├─────────────┤       │     ├───────────┤   ├───────────────┤
    │ position_id │ PK    │     │sale_item_id│   │ item_id      │
    │ title       │       │     │ sale_id   │FK  │ po_id        │FK
    │ base_salary │       │     │product_id │FK  │ingredient_id │FK
    └─────────────┘       │     │ quantity  │   │ quantity      │
                          │     │unit_price │   │ unit_price    │
    ┌──────────┐          │     └──────┬────┘   └───────────────┘
    │  shift   │          │            │
    ├──────────┤          │      ┌─────┴──────┐
    │ shift_id │ PK       │      │  product   │
    │employee  │FK        │      ├────────────┤
    │  _id     │          │      │ product_id │ PK
    │start_time│          │      │ name       │
    │ end_time │          │      │ category   │
    └──────────┘          │      │ price      │
                          │      │ is_active  │
    ┌──────────┐          │      └──────┬─────┘
    │ supplier │          │             │
    ├──────────┤          │        N:M  │ (via recipe)
    │supplier  │ PK       │      ┌──────┴─────┐
    │  _id     │          │      │   recipe   │
    │ name     │          │      ├────────────┤
    │ contact  │          │      │ recipe_id  │ PK
    │ bin      │          │      │ product_id │FK
    │ is_active│          │      │ingredient  │FK
    └──────────┘          │      │  _id       │
                          │      │ quantity   │
    ┌──────────┐          │      └──────┬─────┘
    │ invoice  │          │             │
    ├──────────┤          │      ┌──────┴──────┐
    │invoice_id│ PK       └──────┤ ingredient  │
    │ sale_id  │FK (1:1)         ├─────────────┤
    │fiscal_num│                 │ingredient_id│ PK
    │vat_amount│                 │ name        │
    │issued_at │                 │ unit        │
    └──────────┘                 │cost_per_unit│
                                 │ min_stock   │
    ┌──────────┐                 └─────────────┘
    │  users   │
    ├──────────┤
    │ user_id  │ PK
    │ username │ UNIQUE
    │pass_hash │
    │ role     │
    │created_at│
    └──────────┘
```

### Table Summary

| Table | Rows (seed) | Description |
|-------|------------|-------------|
| branch | 6 | Coffee shop locations in Almaty |
| position | 8 | Job titles and base salaries |
| employee | 14 | Staff across branches |
| shift | 7 | Work schedule records |
| product | 12 | Menu items (coffee, food, desserts) |
| ingredient | 25 | Raw materials with cost and min stock |
| recipe | 36 | Product-to-ingredient mapping (N:M) |
| stock | 150 | Per-branch ingredient quantities |
| supplier | 5 | Ingredient suppliers |
| purchase_order | 3 | Orders to suppliers |
| purchase_item | 3 | Line items in purchase orders |
| sale | 24+ | Sales transactions |
| sale_item | 35+ | Products sold per transaction |
| invoice | 24+ | Auto-generated fiscal invoices |
| users | 1 | System authentication |

### Key Relationships
- `branch` → `employee` (1:N) — each branch has multiple employees
- `product` ↔ `ingredient` (N:M via `recipe`) — products have multiple ingredients
- `sale` → `sale_item` → `product` — sales contain multiple products
- `sale` → `invoice` (1:1) — each sale generates one invoice
- `branch` → `stock` → `ingredient` — per-branch ingredient quantities
