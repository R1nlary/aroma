# Scheduling & Resource Planning

## 1. Gantt Chart

```
Week        |  1   |  2   |  3   |  4   |  5   |  6   |
            | Mar15| Mar22| Mar29| Apr05| Apr12| Apr19| Apr29
────────────┼──────┼──────┼──────┼──────┼──────┼──────┤
Planning    |██████|      |      |      |      |      |
  Charter   |████  |      |      |      |      |      |
  DB Design |  ████|      |      |      |      |      |
────────────┼──────┼──────┼──────┼──────┼──────┼──────┤
Backend     |  ████|██████|████  |      |      |      |
  Auth      |  ████|      |      |      |      |      |
  CRUD API  |      |████  |      |      |      |      |
  Sales API |      |  ████|██    |      |      |      | ← depends on Auth
  Inventory |      |      |  ████|      |      |      |
  Dashboard |      |      |    ██|██    |      |      |
────────────┼──────┼──────┼──────┼──────┼──────┼──────┤
Frontend    |      |██████|██████|██████|██    |      |
  Landing   |      |████  |      |      |      |      |
  Login     |      |████  |      |      |      |      |
  Admin     |      |  ████|      |      |      |      | ← depends on CRUD API
  POS       |      |      |██████|      |      |      | ← depends on Sales API
  Inventory |      |      |      |████  |      |      |
  Finance   |      |      |      |  ████|      |      |
  Dashboard |      |      |      |    ██|██    |      |
────────────┼──────┼──────┼──────┼──────┼──────┼──────┤
Testing     |      |      |      |      |██████|      |
────────────┼──────┼──────┼──────┼──────┼──────┼──────┤
Docs & Pres.|      |      |      |      |  ████|██████|
────────────┼──────┼──────┼──────┼──────┼──────┼──────┤
                                               ▲
                                          MILESTONE:
                                          MVP Ready
                                          Apr 29 Deadline
```

### Key Dependencies
1. **Auth** must be completed before any protected route
2. **Sales API** depends on Auth and Product CRUD
3. **POS Frontend** depends on Sales API
4. **Dashboard** depends on Sales, Inventory, and Invoice APIs
5. **Documentation** can start in parallel with testing

### Milestones
| Milestone | Target Date | Criteria |
|-----------|------------|----------|
| M1: Backend Complete | April 5, 2025 | All API endpoints functional |
| M2: Frontend Complete | April 15, 2025 | All pages render with real data |
| M3: MVP Ready | April 22, 2025 | End-to-end flow works (POS → Inventory → Invoice → Dashboard) |
| M4: Submission | April 29, 2025 | GitHub repo + documentation + presentation ready |

## 2. Team Roles & Responsibilities

| Role | Responsibility | Person |
|------|---------------|--------|
| **Project Manager** | Planning, scheduling, risk management, documentation | Student 1 |
| **Full-Stack Developer** | Backend API, frontend pages, database, testing | Student 1 |
| **UI/UX Designer** | Landing page design, component styling, responsive layout | Student 2 (or same) |

### RACI Matrix

| Task | PM | Developer | Designer |
|------|----|-----------|----------|
| Project Charter | A, R | C | I |
| Database Schema | C | A, R | I |
| Backend API | I | A, R | I |
| Frontend Pages | I | A, R | C |
| Landing Page | I | C | A, R |
| Testing | A | R | C |
| Documentation | A, R | C | I |
| Presentation | A, R | C | C |

*R = Responsible, A = Accountable, C = Consulted, I = Informed*

## 3. Resource Requirements

| Resource | Type | Availability |
|----------|------|-------------|
| Laptop/Desktop with Node.js | Hardware/Software | Available |
| GitHub account | Service | Free tier |
| VS Code / IDE | Software | Free |
| SQLite (bundled) | Database | No setup needed |
| Internet access | Infrastructure | Available |
