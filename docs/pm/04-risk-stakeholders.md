# Risk & Stakeholder Management

## 1. Stakeholder Register

| Stakeholder | Role | Power | Interest | Strategy |
|-------------|------|-------|----------|----------|
| University Instructor | Project Sponsor, evaluates deliverables | High | High | **Manage Closely**: Regular progress updates, align deliverables with grading rubric |
| End Users (Baristas) | Operate POS daily, provide feedback | Low | High | **Keep Informed**: Intuitive UI, demo credentials, minimal training needed |
| End Users (Managers) | Monitor KPIs, manage inventory | Medium | High | **Keep Satisfied**: Dashboard accuracy, real-time alerts, actionable insights |
| Accountant | Receives auto-generated invoices | Low | Medium | **Monitor**: Correct VAT calculation, proper fiscal numbering |
| Development Team (Students) | Build and deliver the MVP | High | High | **Manage Closely**: Clear task assignments, regular sync meetings |

### Stakeholder Power-Interest Grid

```
        HIGH POWER
            │
    Keep    │   Manage
  Satisfied │   Closely
            │
  ──────────┼──────────  HIGH INTEREST
            │
   Monitor  │   Keep
            │   Informed
            │
        LOW POWER
```

- **Manage Closely** (High Power, High Interest): Instructor, Dev Team
- **Keep Satisfied** (High Power, Low Interest): —
- **Keep Informed** (Low Power, High Interest): Baristas, Managers
- **Monitor** (Low Power, Low Interest): Accountant

## 2. Risk Matrix

| ID | Risk | Probability (1-5) | Impact (1-5) | Score | Mitigation Strategy |
|----|------|--------------------|--------------|-------|---------------------|
| R1 | **Scope creep** — Adding features beyond MVP requirements | 4 | 3 | 12 | Fixed WBS and prioritized product backlog; P3 stories are cut first if timeline is tight |
| R2 | **Technical complexity** — Process automation (triggers, transactions) harder than expected | 3 | 4 | 12 | Reference existing SQLite triggers as specification; implement in application layer for transparency |
| R3 | **Time constraints** — Deadline pressure from multiple courses | 4 | 5 | 20 | MVP-first approach; phase implementation by priority; documentation can be parallelized |
| R4 | **Demo failure** — Database or server issues during final defense | 2 | 5 | 10 | Pre-seeded SQLite database (portable, no server needed); local demo fallback; test demo script beforehand |
| R5 | **Lack of testing** — Bugs discovered during presentation | 3 | 3 | 9 | Manual testing checklist; focus on golden path (POS → Inventory → Invoice → Dashboard) |

### Risk Heat Map

```
Impact  5 │     │     │     │ R3  │     │
        4 │     │     │ R2  │     │     │
        3 │     │     │ R5  │ R1  │     │
        2 │     │     │     │     │     │
        1 │     │     │     │     │     │
          └─────┴─────┴─────┴─────┴─────┘
            1     2     3     4     5
                  Probability →

  Score 1-5: Low (Green) | 6-14: Medium (Yellow) | 15+: High (Red)
```

### Risk Response Plan

| Risk | Response Type | Action |
|------|--------------|--------|
| R1 (Scope creep) | **Avoid** | Strict adherence to WBS; any new feature request goes to backlog |
| R2 (Technical complexity) | **Mitigate** | Incremental development; test each automation step individually |
| R3 (Time constraints) | **Mitigate** | Start with highest-priority items; daily progress tracking |
| R4 (Demo failure) | **Mitigate** | Pre-seeded portable database; backup screenshots of all features |
| R5 (Lack of testing) | **Accept** | Focus testing on critical paths; accept minor UI bugs |
