# Business Process Modeling (BPMN)

## 1. Core Process: "Order-to-Cash" (Sales Cycle)

This document models the core business process of a coffee shop — from customer order to completed transaction, inventory update, and financial recording.

---

## 2. As-Is Process (Manual Operations)

### Description
Before implementing Aroma Lab ERP, all operations are manual:

```
┌──────────────────────────────────────────────────────────────────────┐
│                    AS-IS: Manual Sales Process                       │
├──────────┬───────────┬──────────────┬───────────┬───────────────────┤
│ Customer │  Barista  │   Manager    │Accountant │    Supplier       │
├──────────┼───────────┼──────────────┼───────────┼───────────────────┤
│          │           │              │           │                   │
│ ●Start   │           │              │           │                   │
│ │        │           │              │           │                   │
│ ▼        │           │              │           │                   │
│ [Place   │           │              │           │                   │
│  order   │           │              │           │                   │
│  verbally]───►       │              │           │                   │
│          │ [Write    │              │           │                   │
│          │  order on │              │           │                   │
│          │  paper]   │              │           │                   │
│          │ │         │              │           │                   │
│          │ ▼         │              │           │                   │
│          │ [Make     │              │           │                   │
│          │  drink]   │              │           │                   │
│          │ │         │              │           │                   │
│          │ ▼         │              │           │                   │
│ [Pay] ◄──┤ [Record   │              │           │                   │
│          │  payment  │              │           │                   │
│ ●End     │  manually]│              │           │                   │
│          │ │         │              │           │                   │
│          │ ▼         │              │           │                   │
│          │           │ [Count stock │           │                   │
│          │           │  manually    │           │                   │
│          │           │  at end of   │           │                   │
│          │           │  day]        │           │                   │
│          │           │ │            │           │                   │
│          │           │ ▼            │           │                   │
│          │           │ [Write       │           │                   │
│          │           │  reorder     │           │                   │
│          │           │  list on     │           │                   │
│          │           │  paper]──────┼───────────┼──► [Receive      │
│          │           │              │           │     phone call]   │
│          │           │              │           │    │              │
│          │           │              │           │    ▼              │
│          │           │              │           │   [Deliver       │
│          │           │              │ ◄─────────┼──  goods]        │
│          │           │              │[Create    │                   │
│          │           │              │ invoices  │                   │
│          │           │              │ from paper│                   │
│          │           │              │ receipts] │                   │
│          │           │              │ │         │                   │
│          │           │              │ ▼         │                   │
│          │           │              │[Monthly   │                   │
│          │           │              │ revenue   │                   │
│          │           │              │ report]   │                   │
└──────────┴───────────┴──────────────┴───────────┴───────────────────┘
```

### Pain Points
1. **Data entry errors** — handwritten orders lead to mistakes
2. **No real-time stock visibility** — stockouts discovered too late
3. **Delayed invoicing** — invoices created days/weeks after sales
4. **Information silos** — barista, manager, accountant use separate records
5. **No KPI tracking** — monthly reports are manual and delayed

---

## 3. To-Be Process (Automated with Aroma Lab ERP)

### Description
After implementing Aroma Lab ERP, the process is streamlined with 4 automated steps:

```
┌──────────────────────────────────────────────────────────────────────┐
│                TO-BE: Automated Sales Process                        │
├──────────┬───────────┬──────────────┬───────────┬───────────────────┤
│ Customer │  Barista  │  ⚙ SYSTEM   │  Manager  │    Supplier       │
├──────────┼───────────┼──────────────┼───────────┼───────────────────┤
│          │           │              │           │                   │
│ ●Start   │           │              │           │                   │
│ │        │           │              │           │                   │
│ ▼        │           │              │           │                   │
│ [Place   │           │              │           │                   │
│  order]──┼──►        │              │           │                   │
│          │ [Select   │              │           │                   │
│          │  items in │              │           │                   │
│          │  POS]     │              │           │                   │
│          │ │         │              │           │                   │
│          │ ▼         │              │           │                   │
│          │ [Make     │              │           │                   │
│          │  drink]   │              │           │                   │
│          │ │         │              │           │                   │
│          │ ▼         │              │           │                   │
│          │ [Select   │              │           │                   │
│          │  payment &│              │           │                   │
│ [Pay] ◄──┤  complete │              │           │                   │
│          │  sale]    │              │           │                   │
│ ●End     │ │         │              │           │                   │
│          │ └─────────┼──►           │           │                   │
│          │           │ ⚙[AUTO:     │           │                   │
│          │           │  Deduct stock│           │                   │
│          │           │  per recipe] │           │                   │
│          │           │ │            │           │                   │
│          │           │ ▼            │           │                   │
│          │           │ ⚙[AUTO:     │           │                   │
│          │           │  Generate    │           │                   │
│          │           │  fiscal      │           │                   │
│          │           │  invoice]    │           │                   │
│          │           │ │            │           │                   │
│          │           │ ▼            │           │                   │
│          │           │ ⚙[AUTO:     │           │                   │
│          │           │  Check stock │           │                   │
│          │           │  vs min      │──────►    │                   │
│          │           │  levels]     │ [View     │                   │
│          │           │              │  alerts on│                   │
│          │           │              │  dashboard│                   │
│          │           │              │  ]        │                   │
│          │           │              │ │         │                   │
│          │           │              │ ▼         │                   │
│          │           │              │ [Create PO│                   │
│          │           │              │  in system│──► [Receive PO]   │
│          │           │              │  ]        │    │              │
│          │           │              │           │    ▼              │
│          │           │              │ [Mark PO  │◄── [Deliver      │
│          │           │              │  received]│    goods]         │
│          │           │              │ │         │                   │
│          │           │              │ └─────────┼──►                │
│          │           │ ⚙[AUTO:     │           │                   │
│          │           │  Replenish   │           │                   │
│          │           │  stock]      │           │                   │
│          │           │ │            │           │                   │
│          │           │ ▼            │           │                   │
│          │           │ ⚙[AUTO:     │           │                   │
│          │           │  Update KPI  │           │                   │
│          │           │  dashboard]  │           │                   │
└──────────┴───────────┴──────────────┴───────────┴───────────────────┘
```

### Automated Steps (⚙)
1. **Stock deduction** — SQLite trigger `trg_deduct_stock` fires on each `sale_item` insert
2. **Invoice generation** — SQLite trigger `trg_create_invoice` fires when `sale.total_amount` is updated
3. **Stock alerts** — Real-time SQL view `v_stock_alerts` compares current vs. minimum stock
4. **Stock replenishment** — SQLite trigger `trg_receive_po` fires when PO status changes to 'received'
5. **KPI dashboard** — SQL views `v_food_cost`, `v_avg_transaction`, `v_top_products` aggregate data in real-time

---

## 4. Process Improvement Metrics

| Metric | As-Is (Manual) | To-Be (Automated) | Improvement |
|--------|---------------|-------------------|-------------|
| Time to record a sale | 2-3 min (paper) | 30 sec (POS) | 75% faster |
| Stock visibility | End of day | Real-time | Immediate |
| Invoice creation | Next day (manual) | Instant (auto) | 100% faster |
| KPI availability | Monthly (manual report) | Real-time (dashboard) | 30x faster |
| Data entry errors | ~5% error rate | ~0% (system-calculated) | Eliminated |
