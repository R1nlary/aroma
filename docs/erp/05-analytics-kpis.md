# Analytics & KPIs

## 1. Key Performance Indicators (KPIs)

### KPI 1: Food Cost Percentage

| Aspect | Detail |
|--------|--------|
| **Definition** | Ratio of cost of goods sold (COGS) to revenue, expressed as a percentage |
| **Formula** | `Food Cost % = (COGS / Revenue) × 100` |
| **Target** | < 30% (industry standard for coffee shops: 25-35%) |
| **Data Source** | SQL View `v_food_cost` — joins `sale_item` with `recipe` and `ingredient.cost_per_unit` |
| **Measurement Frequency** | Real-time (recalculated on each dashboard load) |
| **Current Value** | ~16% (based on seed data) |

**Business Decision**:
- If Food Cost > 30% → review recipes (reduce ingredient quantities), renegotiate supplier prices
- If Food Cost < 20% → potential to increase ingredient quality or portions

**SQL View**:
```sql
CREATE VIEW v_food_cost AS
SELECT
    branch_id, branch_name, sale_date,
    revenue, cogs,
    ROUND(100.0 * cogs / revenue, 2) AS food_cost_pct
FROM (aggregated sale items with recipe costs);
```

### KPI 2: Average Transaction Value (ATV)

| Aspect | Detail |
|--------|--------|
| **Definition** | Average amount spent per customer transaction |
| **Formula** | `ATV = Total Revenue / Number of Transactions` |
| **Target** | > 2,000 KZT |
| **Data Source** | SQL View `v_avg_transaction` — `AVG(sale.total_amount)` grouped by date/branch |
| **Measurement Frequency** | Real-time |
| **Current Value** | ~2,307 KZT (based on seed data) |

**Business Decision**:
- If ATV declining → introduce combo deals (coffee + pastry), add upselling prompts in POS
- If ATV rising → validate that it's not due to price increases alienating customers

**SQL View**:
```sql
CREATE VIEW v_avg_transaction AS
SELECT
    branch_id, branch_name, sale_date,
    COUNT(sale_id) AS transactions,
    ROUND(AVG(total_amount), 0) AS avg_transaction_value,
    SUM(total_amount) AS total_revenue
FROM sale GROUP BY branch_id, sale_date;
```

### KPI 3: Stock Health / Availability Rate

| Aspect | Detail |
|--------|--------|
| **Definition** | Percentage of ingredient stock items at adequate levels |
| **Formula** | `Stock Health = (OK items / Total items) × 100` |
| **Target** | > 90% |
| **Data Source** | SQL View `v_stock_alerts` — compares `stock.quantity` vs `ingredient.min_stock` |
| **Measurement Frequency** | Real-time |
| **Current Value** | ~97% (based on seed data) |

**Alert Levels**:
| Level | Condition | Color | Action |
|-------|-----------|-------|--------|
| CRITICAL | `quantity < min_stock` | Red | Immediate purchase order needed |
| WARNING | `quantity < min_stock × 1.3` | Yellow | Plan to reorder soon |
| OK | `quantity >= min_stock × 1.3` | Green | No action needed |

**Business Decision**:
- If Stock Health < 90% → trigger purchase orders for critical items, adjust min_stock thresholds
- If Stock Health consistently 100% → may be over-ordering, tying up capital

---

## 2. Management Dashboard Mockup

### Layout

```
┌────────────────────────────────────────────────────────────────┐
│                    📊 Management Dashboard                      │
├──────────────────┬──────────────────┬──────────────────────────┤
│                  │                  │                          │
│   🍔 Food Cost   │  💳 Avg Txn      │  📦 Stock Health         │
│                  │                  │                          │
│     16.0%        │   2,307 KZT     │      97%                 │
│  ████░░░░░░░     │  █████████░░    │    ┌─────┐              │
│  Target: <30%    │  Target: >2,000  │    │ OK  │ ██████       │
│  ✅ On target    │  ✅ On target    │    │ Warn│ █            │
│                  │                  │    │ Crit│ ░            │
│                  │                  │    └─────┘              │
├──────────────────┴──────────────────┼──────────────────────────┤
│                                     │                          │
│   📈 Daily Revenue (Bar Chart)      │  🏆 Top Products         │
│                                     │                          │
│   8,000 ┤                           │  #  Name          Sold   │
│   6,000 ┤    ██                     │  1. Cappuccino    12     │
│   4,000 ┤ ██ ██ ██                  │  2. Latte         11     │
│   2,000 ┤ ██ ██ ██                  │  3. Raf Classic    4     │
│       0 └──────────                 │  4. Sandwich       3     │
│         Apr25 Apr26 Apr27           │  5. Americano      2     │
│                                     │                          │
└─────────────────────────────────────┴──────────────────────────┘
```

### Chart Specifications

| Chart | Type | X-Axis | Y-Axis | Library |
|-------|------|--------|--------|---------|
| Food Cost | Progress bar + gauge | — | Percentage | Native HTML |
| Avg Transaction | Progress bar | — | KZT | Native HTML |
| Stock Health | Donut/Pie chart | — | Count (OK/Warning/Critical) | Recharts PieChart |
| Daily Revenue | Bar chart | Date | Revenue (KZT) | Recharts BarChart |
| Top Products | Ranked table | — | — | HTML Table |

### Interactivity
- KPI cards update in real-time on page load
- Branch filter dropdown to view KPIs per location
- Revenue chart shows last 30 days
- Top products sorted by quantity sold (descending)

---

## 3. How KPIs Connect to ERP Modules

```
┌─────────────────┐        ┌─────────────────┐
│  SALES MODULE   │───────▶│  Food Cost %    │
│  (POS, Sales)   │        │  Avg Transaction│
└─────────────────┘        └─────────────────┘

┌─────────────────┐        ┌─────────────────┐
│  INVENTORY      │───────▶│  Stock Health % │
│  MODULE         │        │                 │
└─────────────────┘        └─────────────────┘

┌─────────────────┐        ┌─────────────────┐
│  FINANCE        │───────▶│  Revenue Charts │
│  MODULE         │        │  VAT Reporting  │
└─────────────────┘        └─────────────────┘
```

Each KPI draws data from one or more ERP modules, demonstrating how integrated data enables better decision-making — the core value of an ERP system.
