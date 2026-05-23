# ERP Module & Functional Scope

## 1. Module Overview

Aroma Lab implements **3 core ERP modules** that address the primary operational silos in a multi-branch coffee chain:

| Module | Pages | Key Features |
|--------|-------|--------------|
| Sales Management | POS, Sales History | Order creation, payment processing, receipt generation |
| Inventory Management | Inventory, Purchase Orders | Stock tracking, auto-deduction, low-stock alerts, PO management |
| Finance / Accounting | Finance, Dashboard | Auto-invoices, VAT calculation, revenue tracking, KPI analytics |

---

## 2. Module 1: Sales Management

### Scope
Handles the entire sales lifecycle from order creation to payment and receipt.

### Functional Requirements
- Product browsing with category filter and search
- Shopping cart with quantity adjustment
- Multi-payment support: Card, Kaspi QR, Cash
- Cash change calculation
- Discount application (percentage-based)
- Digital receipt with fiscal number
- Sales history with detail drill-down

### System Pages
- **POS Page** — primary interface for baristas
- **Sales Page** — historical sales data with filters

### How It Breaks Silos
**Before**: Barista records sale on paper → manager has no visibility → accountant gets paper receipts days later
**After**: Barista uses POS → sale instantly visible to manager (Sales page) and accountant (Finance page)

### Data Flow
```
Barista selects products → Cart → Payment → [SYSTEM] Records sale → Receipt shown
                                                ↓
                              sale + sale_item tables updated
                                                ↓
                              Triggers fire (stock, invoice, total)
```

---

## 3. Module 2: Inventory Management

### Scope
Tracks ingredient stock levels across all branches, with automatic deduction on sale and purchase order management for replenishment.

### Functional Requirements
- Real-time stock levels per branch (filterable)
- Automatic stock deduction when sale is completed (via recipe quantities)
- Three-level alert system: OK / WARNING / CRITICAL
- Global alerts view across all branches
- Purchase order creation to suppliers
- PO receipt → automatic stock replenishment
- Cost tracking per ingredient

### System Pages
- **Inventory Page** — stock levels, alerts, purchase orders

### How It Breaks Silos
**Before**: Manager counts stock manually at end of day → writes reorder list on paper → calls supplier
**After**: System auto-deducts stock per recipe on each sale → dashboard shows alerts in real-time → manager creates PO in system → marks received → stock auto-replenishes

### Alert Logic
```sql
CASE
    WHEN quantity < min_stock           THEN 'CRITICAL'  -- red
    WHEN quantity < min_stock * 1.3     THEN 'WARNING'   -- yellow
    ELSE 'OK'                                            -- green
END
```

### Automation: Stock Deduction
When a Cappuccino (product_id = 3) is sold:
```
Recipe lookup → Coffee beans: 18g, Milk: 150ml, Cup 350ml: 1, Lid: 1
Stock UPDATE → Each ingredient quantity reduced by recipe amount
Trigger: trg_deduct_stock fires automatically on sale_item INSERT
```

---

## 4. Module 3: Finance / Accounting

### Scope
Automates invoice generation, VAT calculation, and provides financial analytics through KPI dashboards.

### Functional Requirements
- Auto-generated fiscal invoice for every sale
- VAT calculation at 12% (Kazakhstan tax rate)
- Fiscal number format: `FN-YYYYMMDD-NNNNNN`
- Invoice listing with date filters
- Revenue summary (total, VAT breakdown)
- General ledger entry simulation (Dr Cash, Cr Revenue, Cr VAT)
- KPI dashboard with 3 key metrics
- Interactive charts (daily revenue, top products)

### System Pages
- **Finance Page** — invoices, revenue summary, GL entries
- **Dashboard Page** — KPI cards, charts, analytics

### How It Breaks Silos
**Before**: Accountant manually creates invoices from paper receipts → monthly revenue report compiled by hand
**After**: Invoice auto-created with each sale (trigger) → real-time dashboard shows revenue, food cost, stock health

### KPI Definitions

| KPI | Formula | Target | Business Decision |
|-----|---------|--------|-------------------|
| Food Cost % | COGS / Revenue × 100 | < 30% | If high → review recipes, renegotiate supplier prices |
| Avg Transaction Value | Revenue / Transactions | > 2,000 KZT | If declining → introduce combos, upselling |
| Stock Health | OK items / Total items × 100 | > 90% | If low → trigger purchase orders, adjust min_stock |

---

## 5. Cross-Module Integration

The key differentiator of an ERP system vs. standalone applications is **data integration**. In Aroma Lab, a single sale in the POS triggers a cascade of events across all 3 modules:

```
                    ┌─────────────────┐
                    │  SALE CREATED   │
                    │  (POS Module)   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
    ┌─────────────┐ ┌──────────────┐ ┌─────────────┐
    │  INVENTORY  │ │   FINANCE    │ │  DASHBOARD  │
    │  MODULE     │ │   MODULE     │ │  (KPIs)     │
    ├─────────────┤ ├──────────────┤ ├─────────────┤
    │ Stock       │ │ Invoice auto-│ │ Food cost   │
    │ deducted    │ │ generated    │ │ recalculated│
    │ per recipe  │ │ with VAT     │ │             │
    │             │ │              │ │ Avg txn     │
    │ Alerts      │ │ Revenue      │ │ updated     │
    │ recalculated│ │ updated      │ │             │
    │             │ │              │ │ Stock health│
    │ PO needed?  │ │ GL entries   │ │ refreshed   │
    └─────────────┘ └──────────────┘ └─────────────┘
```

### Demo Flow
1. Open **POS** → Create a sale (Cappuccino + Latte)
2. Navigate to **Inventory** → See reduced stock levels for coffee beans, milk, cups
3. Navigate to **Finance** → See new invoice with fiscal number and VAT
4. Navigate to **Dashboard** → See updated KPIs (revenue up, stock health may change)

This demonstrates real-time, automated data flow between "departments" — the core value proposition of an ERP system.

---

## 6. Justification: Why These 3 Modules?

| Current Problem (Silo) | ERP Module | Solution |
|------------------------|------------|----------|
| Baristas record sales separately from managers and accountants | **Sales Management** | Shared database — one sale visible everywhere |
| Procurement team doesn't know when stock is low until physical count | **Inventory Management** | Real-time stock levels with auto-deduction and alerts |
| Accountant creates invoices manually, days after sales | **Finance / Accounting** | Auto-generated invoices with correct VAT, instant GL entries |
