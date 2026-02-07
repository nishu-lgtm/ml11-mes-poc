# MES POC | Micro Labs ML11 Facility

**Manufacturing Execution System** proof-of-concept for Micro Labs Limited, Veerasandra (ML11) facility. Built against URS:ML11:25:0009 and QAP/MLCM/0095/ANX/0026-000.

![React](https://img.shields.io/badge/React-18.3-blue) ![Vite](https://img.shields.io/badge/Vite-6.0-purple) ![License](https://img.shields.io/badge/License-Proprietary-red)

---

## What This Demonstrates

A 13-module MES interface covering pharmaceutical batch manufacturing workflows for an oral solid dosage (OSD) facility with 12 equipment items across 7 production areas.

### Modules

| # | Module | Coverage |
|---|--------|----------|
| 1 | **Dashboard** | Real-time KPIs, batch progress, equipment status, deviation summary |
| 2 | **Master Templates** | BMR/BPR/MFR template registry with version control and change control traceability |
| 3 | **Batch Execution** | Stage-wise tracking, yield monitoring, maker-checker e-signatures, parameter capture |
| 4 | **Materials & Dispensing** | BOM management, balance integration, dispensing workflow with barcode labels |
| 5 | **Equipment** | 12 equipment items from Annexure-I, calibration tracking, CHT/DHT, PPM schedules |
| 6 | **IPC & Controls** | In-process checks across all stages with limits, sampling points, auto-alerts |
| 7 | **Sampling & Labels** | Sampling plans, e-TRF generation, container-level barcode labels |
| 8 | **Deviations & CAPA** | Categorized deviation management, escalation matrix, CAPA tracking, root cause |
| 9 | **E-Logbooks** | Equipment cleaning, usage, area clearance logs with digital signatures |
| 10 | **Integration Hub** | 8-system connectivity (SAP, LIMS, DMS, WMS, EMS, SCADA, BMS, QMS) |
| 11 | **Reports** | MIS, APR, CPV, and compliance report generation |
| 12 | **Compliance** | 21 CFR Part 11, GAMP5 Cat 5, ALCOA+, Annexure-15 qualification checklist |
| 13 | **Users & Access** | Role-based privilege matrix (5 roles × 6 permissions), audit trail |

### Regulatory Alignment

- **21 CFR Part 11** — Electronic records/signatures, audit trails, access controls
- **GAMP5 Category 5** — Configurable software classification
- **ALCOA+ Principles** — Data integrity framework
- **ICH Q10** — Pharmaceutical Quality System
- **ANSI/ISA-95** — MES integration standard
- **WHO/PIC/S GMP** — Manufacturing compliance

### Real Client Data Used

- 12 equipment items from Annexure-I (granulation, compression, capsule filling, coating, packing)
- 6 balances with actual specifications (Mettler Toledo, Sartorius, A&D)
- 7 active batches across OSD product lines (Metformin, Atorvastatin, Amoxicillin, etc.)
- 8 integration endpoints matching ML11 IT landscape

---

## Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

Output goes to `dist/`.

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Vercel auto-detects Vite — no config needed
5. Deploy

---

## Tech Stack

- **React 18** — Single-file component architecture (zero external UI libraries)
- **Vite 6** — Build tooling
- **Inline CSS** — No Tailwind/CSS framework dependency, fully self-contained
- **Zero backend** — Pure frontend POC with simulated data

## Project Structure

```
ml11-mes-poc/
├── index.html          # Entry point
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx        # React mount
    └── App.jsx         # Full MES application (780 lines)
```

---

## URS Coverage

Based on cross-reference against 276 URS requirements:

| Category | Requirements | Present | Partial | Missing |
|----------|-------------|---------|---------|---------|
| Business Functionality (BFR) | 16 | 5 | 6 | 5 |
| Technical Requirements (TER) | 111 | 18 | 30 | 63 |
| Data Requirements (DAR) | 11 | 0 | 0 | 11 |
| User Management (UMR) | 5 | 3 | 2 | 0 |
| System Interfaces (SIR) | 10 | 7 | 3 | 0 |
| Performance (PER) | 12 | 2 | 4 | 6 |
| Reports (ROR) | 7 | 1 | 3 | 3 |
| Error Handling (EHR) | 9 | 0 | 0 | 9 |
| Security (SEC) | 44 | 5 | 11 | 28 |
| Regulatory (REG) | 23 | 3 | 8 | 12 |
| Environmental (ENR) | 2 | 0 | 0 | 2 |
| Training (TRR) | 3 | 0 | 0 | 3 |
| Documentation (DOR) | 15 | 0 | 0 | 15 |
| Service & Support (SSR) | 8 | 0 | 0 | 8 |
| **Total** | **276** | **41 (14.9%)** | **59 (21.4%)** | **176 (63.8%)** |

> This is a **Proof of Concept**. Production implementation would require backend services, database integration, validated environments, and formal qualification (IQ/OQ/PQ).

---

## License

Proprietary. For demonstration purposes only. Not for production use without authorization.

---

*Built for FDC/Micro Labs ML11 regulatory technology evaluation.*
