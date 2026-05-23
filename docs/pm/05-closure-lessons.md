# Project Closure & Lessons Learned

## 1. Project Summary

| Item | Details |
|------|---------|
| Project Name | Aroma Lab — Integrated Coffee Chain Management System |
| Duration | 6 weeks (March 15 – April 29, 2025) |
| Team Size | 1-2 students |
| Technology | React + Node.js (Express) + SQLite |
| Deliverables | Working MVP, Documentation, Presentation |

## 2. Deliverable Completion Status

| Deliverable | Status | Notes |
|-------------|--------|-------|
| Landing Page (with contact form) | Complete | Responsive, professional design |
| Login Page (JWT auth) | Complete | Secure authentication with bcrypt |
| Product CRUD Module | Complete | Full create/read/update/delete |
| Point-of-Sale (POS) | Complete | Category filtering, cart, multi-payment |
| Inventory Management | Complete | Stock levels, alerts, purchase orders |
| Finance Module | Complete | Auto-generated invoices, VAT calculation |
| KPI Dashboard | Complete | 3 KPIs with charts (Recharts) |
| Process Automation | Complete | Sale → stock deduction → invoice (single transaction) |
| Documentation | Complete | 10 documents across PM and ERP |
| Presentation | Complete | PM (6-10 slides) + ERP (8-12 min) |

## 3. Planned vs. Actual Schedule

| Phase | Planned | Actual | Variance |
|-------|---------|--------|----------|
| Planning & Design | Week 1 | Week 1 | On time |
| Backend Development | Week 1-3 | Week 1-2 | 1 week ahead |
| Frontend Development | Week 2-4 | Week 2-4 | On time |
| Testing | Week 5 | Week 4-5 | Started early |
| Documentation | Week 5-6 | Week 5-6 | On time |

## 4. Lessons Learned

### What Worked Well
1. **Reusing existing schema**: Starting with a pre-designed 13-table SQLite database with triggers and views saved approximately 1 week of development time
2. **MVP-first approach**: Building the PM requirements first (login, CRUD, landing) provided a working baseline early, which reduced risk
3. **SQLite as database**: Zero-configuration database eliminated setup friction and made demos portable
4. **Automation via triggers**: Existing SQLite triggers handled stock deduction and invoice creation reliably

### What Could Be Improved
1. **Testing**: Manual testing was adequate for the MVP, but automated tests would catch regressions faster
2. **Mobile responsiveness**: Some ERP pages (inventory, finance) could be optimized for mobile
3. **Error handling**: Error messages from the API could be more user-friendly
4. **Documentation timing**: Starting documentation earlier (in parallel with development) would reduce end-of-project rush

### Recommendations for Future Iterations
1. Add PostgreSQL support for production deployment
2. Implement role-based access control (barista vs. manager vs. admin)
3. Add email notifications for low-stock alerts
4. Build a mobile-optimized POS view for tablet use
5. Add unit and integration tests

## 5. Final Metrics

| Metric | Value |
|--------|-------|
| Total API endpoints | 18 |
| Database tables | 14 |
| React pages | 8 |
| Automated processes | 4 (stock deduction, sale total, invoice creation, PO receipt) |
| KPI views | 3 (food cost, avg transaction, stock health) |
| Lines of code (approx.) | ~3,500 |
| GitHub commits | [to be filled] |

## 6. Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Manager | [Student Name] | _____________ | April 29, 2025 |
| Sponsor | [Instructor Name] | _____________ | April 29, 2025 |
