import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════
// MES POC v3 — Dexlansoprazole DR Capsules 60mg (DXLPR)
// Synthetic demo data | 10-step batch execution | Mobile-first
// ═══════════════════════════════════════════════════════════

// ── Theme ──────────────────────────────────────────
const C = {
  pri: "#0D6E6E", pri2: "#0A5858", priL: "#E8F6F6", priG: "linear-gradient(135deg, #0D6E6E 0%, #14919B 100%)",
  bg: "#F6F8FA", card: "#FFFFFF", bor: "#E2E8F0", borL: "#F0F4F8",
  t1: "#0F172A", t2: "#334155", t3: "#64748B", t4: "#94A3B8",
  gr: "#059669", grL: "#ECFDF5", rd: "#DC2626", rdL: "#FEF2F2",
  yl: "#D97706", ylL: "#FFFBEB", bl: "#2563EB", blL: "#EFF6FF",
  pu: "#7C3AED", puL: "#F5F3FF", or: "#EA580C",
};

// ── 10 Batch Execution Stages ──────────────────────
const STAGES_10 = [
  { id: 1, name: "Sifting", short: "SFT", icon: "🔍", area: "R20", equip: ["EQ-401","EQ-402","EQ-403"], sop: "SOP-MFG-001 v2.0", desc: "Sifting of API & excipients through vibratory sifter" },
  { id: 2, name: "Binder Prep", short: "BND", icon: "🧪", area: "R25", equip: ["EQ-160","EQ-161"], sop: "SOP-MFG-002 v3.1", desc: "Binder solution preparation using planetary mixer" },
  { id: 3, name: "Granulation", short: "GRN", icon: "⚙️", area: "R20", equip: ["EQ-110","EQ-111"], sop: "SOP-MFG-003 v2.0", desc: "Wet granulation in RMG with 3 sub-lots" },
  { id: 4, name: "Drying", short: "DRY", icon: "🌡️", area: "R20", equip: ["EQ-220","EQ-221"], sop: "SOP-MFG-004 v2.1", desc: "Fluid bed drying per sub-lot with LOD monitoring" },
  { id: 5, name: "Milling", short: "MIL", icon: "🔩", area: "R20", equip: ["EQ-305","EQ-306","EQ-307"], sop: "SOP-MFG-005 v1.5", desc: "Sizing through multimill for uniform granule size" },
  { id: 6, name: "Blending", short: "BLN", icon: "🔄", area: "R22", equip: ["EQ-150","EQ-151"], sop: "SOP-MFG-006 v2.0", desc: "Dry mixing & lubrication in octagonal blender" },
  { id: 7, name: "Compression", short: "CMP", icon: "💊", area: "R30", equip: ["EQ-510","EQ-511","EQ-512"], sop: "SOP-MFG-007 v3.2", desc: "Tablet compression with IPC monitoring" },
  { id: 8, name: "Coating", short: "COT", icon: "🎨", area: "R40", equip: ["EQ-710","EQ-711"], sop: "SOP-MFG-008 v2.5", desc: "Film coating with Opadry dispersion" },
  { id: 9, name: "Inspection", short: "INS", icon: "✅", area: "P10", equip: ["EQ-801","EQ-802"], sop: "SOP-QC-010 v2.0", desc: "Visual inspection and yield reconciliation" },
  { id: 10, name: "Packing", short: "PKG", icon: "📦", area: "P15", equip: ["EP-401","EP-402","EP-403"], sop: "SOP-PKG-001 v4.0", desc: "Primary/secondary packing with serialization" },
];

// ── Equipment (Synthetic) ──────────────────────
const EQUIP = [
  { id: "EQ-401", name: "Vibratory Sifter VS-40", area: "Sifting (R20)", status: "Running", calibDue: "2025-04-15", clean: "Clean", qualStatus: "Qualified" },
  { id: "EQ-402", name: "Vibratory Sifter VS-40B", area: "Sifting (R20)", status: "Idle", calibDue: "2025-03-28", clean: "Clean", qualStatus: "Qualified" },
  { id: "EQ-110", name: "Rapid Mixer Granulator RMG-150", area: "Granulation (R20)", status: "Running", calibDue: "2025-03-15", clean: "Clean", qualStatus: "Qualified" },
  { id: "EQ-111", name: "Rapid Mixer Granulator RMG-150B", area: "Granulation (R20)", status: "Idle", calibDue: "2025-05-01", clean: "Dirty", qualStatus: "Due" },
  { id: "EQ-220", name: "Fluid Bed Dryer FBD-60", area: "Drying (R20)", status: "Running", calibDue: "2025-03-20", clean: "Clean", qualStatus: "Qualified" },
  { id: "EQ-305", name: "Multimill MM-30", area: "Milling (R20)", status: "Idle", calibDue: "2025-04-10", clean: "Clean", qualStatus: "Qualified" },
  { id: "EQ-150", name: "Octagonal Blender OB-200", area: "Blending (R22)", status: "Running", calibDue: "2025-05-01", clean: "Clean", qualStatus: "Qualified" },
  { id: "EQ-160", name: "Planetary Mixer PM-50", area: "Binder Prep (R25)", status: "Idle", calibDue: "2025-03-05", clean: "Clean", qualStatus: "Qualified" },
  { id: "EQ-510", name: "Rotary Tablet Press RTP-45", area: "Compression (R30)", status: "Running", calibDue: "2025-04-15", clean: "Clean", qualStatus: "Qualified" },
  { id: "EQ-601", name: "Metal Detector MD-200", area: "Compression (R30)", status: "Running", calibDue: "2025-02-28", clean: "Clean", qualStatus: "Qualified" },
  { id: "EQ-610", name: "Tablet Deduster TD-100", area: "Compression (R30)", status: "Running", calibDue: "2025-04-20", clean: "Clean", qualStatus: "Qualified" },
  { id: "EQ-710", name: "Auto Coater AC-48", area: "Coating (R40)", status: "Idle", calibDue: "2025-06-10", clean: "Dirty", qualStatus: "Qualified" },
  { id: "EQ-801", name: "Inspection Table IT-01", area: "Inspection (P10)", status: "Running", calibDue: "2025-05-15", clean: "Clean", qualStatus: "Qualified" },
  { id: "EP-401", name: "Blister Packing Machine BP-300", area: "Packing (P15)", status: "Running", calibDue: "2025-04-01", clean: "Clean", qualStatus: "Qualified" },
  { id: "EP-501", name: "Auto Cartonator AC-200", area: "Secondary Packing (P20)", status: "Idle", calibDue: "2025-05-20", clean: "Clean", qualStatus: "Qualified" },
];

// ── Batches (Synthetic DXLPR) ──────────────────────
const BATCHES = [
  { id: "DXLPR0185", product: "Dexlansoprazole DR 60mg", mfr: "MFR1:DXLPR:FR03/R1", bmr: "BMR1:DXLPR:FR03/R1", mpr: "MPR:DXLPR:C:FR03", bpr: "BPR:DXLPR:C:FR03", batchSize: "45.0L", packSize: "2X15", mfgDate: "JAN.2025", expDate: "JAN.2028", stage: "Compression", stageIdx: 7, progress: 65, status: "In Progress", yield: "98.2%", devs: 0 },
  { id: "DXLPR0186", product: "Dexlansoprazole DR 60mg", mfr: "MFR1:DXLPR:FR03/R1", bmr: "BMR1:DXLPR:FR03/R1", mpr: "MPR:DXLPR:C:FR03", bpr: "BPR:DXLPR:C:FR03", batchSize: "45.0L", packSize: "10X10", mfgDate: "JAN.2025", expDate: "JAN.2028", stage: "Coating", stageIdx: 8, progress: 80, status: "In Progress", yield: "97.8%", devs: 1 },
  { id: "DXLPR0187", product: "Dexlansoprazole DR 60mg", mfr: "MFR1:DXLPR:FR03/R1", bmr: "BMR1:DXLPR:FR03/R1", mpr: "MPR:DXLPR:C:FR03/R1", bpr: "BPR:DXLPR:C:FR03/R1", batchSize: "15.0L", packSize: "2X15", mfgDate: "FEB.2025", expDate: "FEB.2028", stage: "Blending", stageIdx: 6, progress: 55, status: "In Progress", yield: "-", devs: 0 },
  { id: "DXLPR0188", product: "Dexlansoprazole DR 60mg", mfr: "MFR1:DXLPR:FR03/R2", bmr: "BMR1:DXLPR:FR03/R2", mpr: "MPR:DXLPR:C:FR03/R1", bpr: "BPR:DXLPR:C:FR03/R1", batchSize: "45.0L", packSize: "2X15", mfgDate: "FEB.2025", expDate: "FEB.2028", stage: "Drying", stageIdx: 4, progress: 30, status: "In Progress", yield: "-", devs: 0 },
  { id: "DXLPR0189", product: "Dexlansoprazole DR 60mg", mfr: "MFR1:DXLPR:FR03/R2", bmr: "BMR1:DXLPR:FR03/R2", mpr: "MPR:DXLPR:C:FR03/R1", bpr: "BPR:DXLPR:C:FR03/R1", batchSize: "45.0L", packSize: "1X100", mfgDate: "FEB.2025", expDate: "FEB.2028", stage: "Packing", stageIdx: 10, progress: 92, status: "In Progress", yield: "98.5%", devs: 0 },
  { id: "DXLPR0183", product: "Dexlansoprazole DR 60mg", mfr: "MFR1:DXLPR:FR03/R1", bmr: "BMR1:DXLPR:FR03/R1", mpr: "MPR:DXLPR:C:FR03", bpr: "BPR:DXLPR:C:FR03", batchSize: "45.0L", packSize: "2X15", mfgDate: "DEC.2024", expDate: "DEC.2027", stage: "Complete", stageIdx: 10, progress: 100, status: "Released", yield: "99.0%", devs: 0 },
  { id: "DXLPR0184", product: "Dexlansoprazole DR 60mg", mfr: "MFR1:DXLPR:FR03/R1", bmr: "BMR1:DXLPR:FR03/R1", mpr: "MPR:DXLPR:C:FR03", bpr: "BPR:DXLPR:C:FR03", batchSize: "15.0L", packSize: "10X10", mfgDate: "JAN.2025", expDate: "JAN.2028", stage: "Complete", stageIdx: 10, progress: 100, status: "Under Review", yield: "97.5%", devs: 2 },
];

// ── 10-Step Execution for DXLPR0185 (Current batch in Compression) ──
const EXEC_STEPS_10 = [
  { step: 1, name: "Sifting", sop: "SOP-MFG-001 v2.0", status: "Completed", signedBy: "Op_Ravi_K", verifiedBy: "Sup_Meena_S", time: "08:15",
    params: [{ p: "Sieve #40 mesh", v: "Integrity PASS", s: "Pass" }, { p: "Sifted Granules Yield", v: "98.04%", s: "Pass" }],
    equip: "EQ-401 (Vibratory Sifter)", area: "R20", notes: "API + all excipients sifted through #40 mesh" },
  { step: 2, name: "Binder Preparation", sop: "SOP-MFG-002 v3.1", status: "Completed", signedBy: "Op_Ravi_K", verifiedBy: "Sup_Meena_S", time: "08:50",
    params: [{ p: "Viscosity of Coating Soln", v: "46.3 cps", s: "Pass" }],
    equip: "EQ-160 (Planetary Mixer)", area: "R25", notes: "PVP binder solution prepared and viscosity verified" },
  { step: 3, name: "Granulation (Wet)", sop: "SOP-MFG-003 v2.0", status: "Completed", signedBy: "Op_Ravi_K", verifiedBy: "Sup_Meena_S", time: "10:30",
    params: [
      { p: "Lot I: Impeller RPM", v: "46", s: "Pass" }, { p: "Lot I: Chopper RPM", v: "16", s: "Pass" },
      { p: "Lot II: Impeller RPM", v: "47", s: "Pass" }, { p: "Lot II: Chopper RPM", v: "16", s: "Pass" },
      { p: "Lot III: Impeller RPM", v: "46", s: "Pass" }, { p: "Lot III: Chopper RPM", v: "17", s: "Pass" },
    ],
    equip: "EQ-110 (RMG-150)", area: "R20", notes: "3 sub-lots granulated per BMR1:DXLPR:FR03/R1" },
  { step: 4, name: "Drying (FBD)", sop: "SOP-MFG-004 v2.1", status: "Completed", signedBy: "Op_Ravi_K", verifiedBy: "QA_Vinod_VK", time: "12:45",
    params: [
      { p: "Lot I: Inlet Temp", v: "59°C", s: "Pass" }, { p: "Lot I: Outlet Temp", v: "54°C", s: "Pass" }, { p: "Lot I: LOD", v: "1.88%", s: "Pass" },
      { p: "Lot II: Inlet Temp", v: "59°C", s: "Pass" }, { p: "Lot II: LOD", v: "1.76%", s: "Pass" },
      { p: "Lot III: Inlet Temp", v: "59°C", s: "Pass" }, { p: "Lot III: LOD", v: "2.08%", s: "Pass" },
    ],
    equip: "EQ-220 (FBD-60)", area: "R20", notes: "All 3 lots dried; LOD within 1-3% w/w spec" },
  { step: 5, name: "Milling/Sizing", sop: "SOP-MFG-005 v1.5", status: "Completed", signedBy: "Op_Ravi_K", verifiedBy: "Sup_Meena_S", time: "13:30",
    params: [{ p: "Screen Size", v: "1.0 mm", s: "Pass" }, { p: "Speed", v: "1500 RPM", s: "Pass" }],
    equip: "EQ-305 (Multimill MM-30)", area: "R20", notes: "Dried granules milled for uniform PSD" },
  { step: 6, name: "Blending & Lubrication", sop: "SOP-MFG-006 v2.0", status: "Completed", signedBy: "Op_Ravi_K", verifiedBy: "Sup_Meena_S", time: "14:15",
    params: [
      { p: "Dry Mixing-I RPM", v: "6 rpm / 20 min", s: "Pass" },
      { p: "Dry Mixing-II RPM", v: "6 rpm / 2 min", s: "Pass" },
      { p: "Compression RPM (Lubrication)", v: "50", s: "Pass" },
    ],
    equip: "EQ-150 (Octagonal Blender OB-200)", area: "R22", notes: "Blended with lubricant (MgSt) and blend uniformity passed" },
  { step: 7, name: "Compression", sop: "SOP-MFG-007 v3.2", status: "In Progress", signedBy: "Op_Suresh_M", verifiedBy: "-", time: "14:45",
    params: [
      { p: "Thickness", v: "1.0 - 3.46 mm", s: "Pass" },
      { p: "Hardness Min", v: "54.0 N", s: "Pass" }, { p: "Hardness Max", v: "72.0 N", s: "Pass" },
      { p: "Average Weight", v: "150.09 mg", s: "Pass" },
      { p: "Compression Yield", v: "98.01%", s: "Pass" },
    ],
    equip: "EQ-510 (RTP-45) + EQ-601 (MD-200) + EQ-610 (TD-100)", area: "R30", notes: "Machine running; real-time weight/hardness monitoring active" },
  { step: 8, name: "Coating", sop: "SOP-MFG-008 v2.5", status: "Pending", signedBy: "-", verifiedBy: "-", time: "-",
    params: [
      { p: "Pan Speed", v: "1-3 RPM", s: "Spec" },
      { p: "Bed Temp Max", v: "≤48°C", s: "Spec" },
      { p: "Exhaust Temp", v: "41-44°C", s: "Spec" },
      { p: "Atomizing Air Pressure", v: "6 bar", s: "Spec" },
      { p: "Target Coating Yield", v: "≥95%", s: "Spec" },
    ],
    equip: "EQ-710 (Auto Coater AC-48)", area: "R40", notes: "Awaiting compression completion" },
  { step: 9, name: "Inspection", sop: "SOP-QC-010 v2.0", status: "Pending", signedBy: "-", verifiedBy: "-", time: "-",
    params: [{ p: "Target Inspection Yield", v: "≥96%", s: "Spec" }],
    equip: "EQ-801 (Inspection Table)", area: "P10", notes: "Visual inspection + yield reconciliation" },
  { step: 10, name: "Packing", sop: "SOP-PKG-001 v4.0", status: "Pending", signedBy: "-", verifiedBy: "-", time: "-",
    params: [
      { p: "Forming Plate Temp", v: "101-128°C", s: "Spec" },
      { p: "Sealing Plate Temp", v: "131-159°C", s: "Spec" },
      { p: "Leak Test", v: "0 defects", s: "Spec" },
      { p: "Target Packing Yield", v: "≥97%", s: "Spec" },
    ],
    equip: "EP-401 (BP-300) + EP-501 (AC-200)", area: "P15/P20", notes: "Primary blister + secondary carton" },
];

// ── Materials (BOM for DXLPR0185) ──────────────────
const BOM_DATA = [
  { material: "Dexlansoprazole (API)", code: "RAND501", arNo: "025RM0116109", required: "3.750 kg", dispensed: "3.755 kg", lot: "LOT-DXL-2025-01", status: "Verified", holdTime: "72h" },
  { material: "Sugar Spheres", code: "REND101", arNo: "025RM0318527", required: "15.000 kg", dispensed: "15.012 kg", lot: "LOT-SS-2024-08", status: "Verified", holdTime: "96h" },
  { material: "Hypromellose Phthalate", code: "REND102", arNo: "025RM0353909", required: "2.250 kg", dispensed: "2.253 kg", lot: "LOT-HMP-2024-12", status: "Verified", holdTime: "48h" },
  { material: "Sucrose", code: "REND103", arNo: "025RM0353603", required: "8.100 kg", dispensed: "8.108 kg", lot: "LOT-SUC-2025-01", status: "Verified", holdTime: "96h" },
  { material: "Methacrylic Acid Copolymer", code: "REND104", arNo: "025RM0457255", required: "1.500 kg", dispensed: "1.502 kg", lot: "LOT-MAC-2024-11", status: "Verified", holdTime: "48h" },
  { material: "Talc", code: "REND105", arNo: "025RM0441828", required: "0.900 kg", dispensed: "0.901 kg", lot: "LOT-TLC-2024-10", status: "Verified", holdTime: "96h" },
  { material: "Triethyl Citrate", code: "REND106", arNo: "025RM0333045", required: "0.450 kg", dispensed: "0.451 kg", lot: "LOT-TEC-2025-01", status: "Verified", holdTime: "48h" },
  { material: "Polysorbate 80", code: "REND107", arNo: "025RM0132621", required: "0.225 kg", dispensed: "-", lot: "-", status: "Pending", holdTime: "-" },
  { material: "Colloidal Silicon Dioxide", code: "REND110", arNo: "025RM0354447", required: "0.675 kg", dispensed: "0.676 kg", lot: "LOT-CSD-2024-09", status: "Verified", holdTime: "96h" },
  { material: "Magnesium Carbonate", code: "REND109", arNo: "025RM0444533", required: "1.125 kg", dispensed: "1.126 kg", lot: "LOT-MGC-2024-12", status: "Verified", holdTime: "96h" },
];

// ── IPC Data ──────────────────────────────────────
const IPC_DATA = [
  { id: "IPC-001", batch: "DXLPR0185", stage: "Drying", check: "LOD (Loss on Drying)", limit: "1.0 - 3.0% w/w", result: "1.88%", status: "Pass", equip: "EQ-220", time: "12:30" },
  { id: "IPC-002", batch: "DXLPR0185", stage: "Blending", check: "Blend Uniformity (RSD)", limit: "NMT 5.0%", result: "2.3%", status: "Pass", equip: "EQ-150", time: "14:05" },
  { id: "IPC-003", batch: "DXLPR0185", stage: "Compression", check: "Avg Weight", limit: "150 ± 7.5 mg", result: "150.09 mg", status: "Pass", equip: "EQ-510", time: "15:00" },
  { id: "IPC-004", batch: "DXLPR0185", stage: "Compression", check: "Hardness", limit: "50 - 76 N", result: "54.0 - 72.0 N", status: "Pass", equip: "EQ-510", time: "15:00" },
  { id: "IPC-005", batch: "DXLPR0185", stage: "Compression", check: "Thickness", limit: "1.0 - 3.5 mm", result: "3.26 mm", status: "Pass", equip: "EQ-510", time: "15:00" },
  { id: "IPC-006", batch: "DXLPR0185", stage: "Compression", check: "Compression Yield", limit: "≥ 96.0%", result: "98.01%", status: "Pass", equip: "EQ-510", time: "16:00" },
  { id: "IPC-007", batch: "DXLPR0186", stage: "Coating", check: "Bed Temp Max", limit: "≤ 48°C", result: "47.2°C", status: "Pass", equip: "EQ-710", time: "10:00" },
  { id: "IPC-008", batch: "DXLPR0186", stage: "Coating", check: "Pan Speed", limit: "1 - 3 RPM", result: "2.8 RPM", status: "Pass", equip: "EQ-710", time: "10:30" },
  { id: "IPC-009", batch: "DXLPR0186", stage: "Coating", check: "Weight Gain", limit: "3.0% ± 0.5%", result: "3.7%", status: "Alert", equip: "EQ-710", time: "14:00" },
];

// ── Master Templates ──────────────────────
const TEMPLATES = [
  { id: "MFR2:DXLPR:FR01", product: "Dexlansoprazole DR 60mg", type: "MFR", version: "FR01", status: "Obsoleted", effectiveDate: "2019-01-15", stages: 10, prevVersion: "-", revisionReason: "Initial MFR release" },
  { id: "MFR2:DXLPR:FR02", product: "Dexlansoprazole DR 60mg", type: "MFR", version: "FR02", status: "Obsoleted", effectiveDate: "2020-03-01", stages: 10, prevVersion: "FR01/R1", revisionReason: "Granulation parameters updated per CPV data" },
  { id: "MFR2:DXLPR:FR02/R2", product: "Dexlansoprazole DR 60mg", type: "MFR", version: "FR02/R2", status: "Obsoleted", effectiveDate: "2022-06-01", stages: 10, prevVersion: "FR02/R1", revisionReason: "Coating process optimization" },
  { id: "MFR1:DXLPR:FR03", product: "Dexlansoprazole DR 60mg", type: "MFR", version: "FR03", status: "Obsoleted", effectiveDate: "2023-01-15", stages: 10, prevVersion: "FR02/R2", revisionReason: "Scale-up from 15L to 45L batch size" },
  { id: "MFR1:DXLPR:FR03/R1", product: "Dexlansoprazole DR 60mg", type: "MFR", version: "FR03/R1", status: "Approved", effectiveDate: "2024-06-01", stages: 10, prevVersion: "FR03", revisionReason: "Compression speed optimization & IPC frequency update" },
  { id: "MFR1:DXLPR:FR03/R2", product: "Dexlansoprazole DR 60mg", type: "MFR", version: "FR03/R2", status: "Under Review", effectiveDate: "-", stages: 10, prevVersion: "FR03/R1", revisionReason: "New coating machine qualification (EQ-711)" },
  { id: "BMR1:DXLPR:FR03/R1", product: "Dexlansoprazole DR 60mg", type: "BMR", version: "FR03/R1", status: "Approved", effectiveDate: "2024-06-01", stages: 10, prevVersion: "FR03", revisionReason: "Aligned with MFR FR03/R1 changes" },
  { id: "MPR:DXLPR:C:FR03", product: "Dexlansoprazole DR 60mg (2X15)", type: "MPR", version: "C:FR03", status: "Approved", effectiveDate: "2024-06-01", stages: 4, prevVersion: "B:FR02/R1", revisionReason: "New carton artwork per market requirement" },
];

// ── Deviations ──────────────────────
const DEVIATIONS = [
  { id: "DEV-2025-011", batch: "DXLPR0186", type: "Process", cat: "Minor", desc: "Coating weight gain exceeded upper limit by 0.2% (3.7% vs 3.5%)", status: "Open", by: "Op_Suresh_M", date: "2025-02-06", stage: "Coating" },
  { id: "DEV-2025-010", batch: "DXLPR0184", type: "Equipment", cat: "Major", desc: "EQ-711 qualification not completed before use", status: "Under Investigation", by: "Sup_Meena_S", date: "2025-01-20", stage: "Coating" },
  { id: "DEV-2025-009", batch: "DXLPR0184", type: "Material", cat: "Info", desc: "API lot change mid-dispensing (same AR No.)", status: "Closed", by: "QA_Vinod_VK", date: "2025-01-18", stage: "Sifting" },
];

// ── Audit Trail ──────────────────────
const AUDIT = [
  { id: "AUD-50124", ts: "2025-02-08 15:02:11", user: "Op_Suresh_M", action: "Batch Step Execution", detail: "DXLPR0185 Step 7 (Compression) started | Equip: EQ-510", module: "Batch" },
  { id: "AUD-50123", ts: "2025-02-08 14:16:33", user: "Op_Ravi_K", action: "E-Signature (Complete)", detail: "DXLPR0185 Step 6 (Blending) completed | Verified by Sup_Meena_S", module: "Signature" },
  { id: "AUD-50122", ts: "2025-02-08 13:31:05", user: "Op_Ravi_K", action: "IPC Entry", detail: "LOD Lot III = 2.08% for DXLPR0185 Step 4 [PASS within 1-3%]", module: "Quality" },
  { id: "AUD-50121", ts: "2025-02-08 12:48:22", user: "System", action: "Auto Data Capture", detail: "FBD Outlet Temp: 54°C captured from EQ-220 PLC for DXLPR0185", module: "Equipment" },
  { id: "AUD-50120", ts: "2025-02-08 08:17:55", user: "Op_Ravi_K", action: "Material Scan", detail: "API (RAND501) AR: 025RM0116109 scanned and verified for DXLPR0185", module: "Material" },
  { id: "AUD-50119", ts: "2025-02-08 08:05:41", user: "Op_Ravi_K", action: "Login", detail: "Successful login via User ID + Password + Biometric", module: "Security" },
  { id: "AUD-50118", ts: "2025-02-07 22:15:00", user: "System", action: "Hold Time Alert", detail: "CHT approaching limit (3h 30m / 4h) for EQ-710 Coating Machine", module: "Equipment" },
];

// ── Logbooks ──────────────────────
const LOGBOOKS = [
  { id: "LOG-301", type: "Equipment Usage", equip: "EQ-110 (RMG-150)", area: "Granulation (R20)", entries: 185, last: "2025-02-08 10:30", status: "Active" },
  { id: "LOG-302", type: "Cleaning Log", equip: "EQ-710 (AC-48)", area: "Coating (R40)", entries: 92, last: "2025-02-07 22:00", status: "Active" },
  { id: "LOG-303", type: "Area Logbook", equip: "-", area: "Compression Suite R30", entries: 340, last: "2025-02-08 14:50", status: "Active" },
  { id: "LOG-304", type: "FBD Drying Log", equip: "EQ-220 (FBD-60)", area: "Drying (R20)", entries: 165, last: "2025-02-08 12:45", status: "Active" },
  { id: "LOG-305", type: "Blister Line Log", equip: "EP-401 (BP-300)", area: "Packing (P15)", entries: 210, last: "2025-02-08 09:15", status: "Active" },
];

// ══════════════════════════════════════════════════════════
// ── UI COMPONENTS (Mobile-first) ──────────────────────────
// ══════════════════════════════════════════════════════════

const Badge = ({ s, sz = "sm" }) => {
  const m = { Running: C.gr, Connected: C.gr, Active: C.gr, Released: C.gr, Closed: C.gr, Clean: C.gr, Completed: C.gr, Pass: C.gr, Qualified: C.gr, Approved: C.gr, Verified: C.gr, Passed: C.gr, Idle: C.yl, "In Progress": C.bl, "Under Review": C.yl, "Under Testing": C.yl, "Under Investigation": C.yl, Pending: C.yl, Due: C.yl, Open: C.rd, Maintenance: C.rd, Dirty: C.rd, Fail: C.rd, Alert: C.or, Deactivated: C.t4, Obsoleted: C.t4, Spec: C.bl, Minor: C.yl, Major: C.or, Critical: C.rd, Info: C.bl };
  const c = m[s] || C.t4;
  return <span style={{ background: `${c}14`, color: c, padding: sz === "sm" ? "2px 8px" : "4px 12px", borderRadius: 20, fontSize: sz === "sm" ? 10 : 12, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap", letterSpacing: 0.2 }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: c, flexShrink: 0 }} />{s}</span>;
};

const Cd = ({ children, style = {}, onClick, accent }) => (
  <div onClick={onClick} style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.bor}`, padding: "14px 16px", cursor: onClick ? "pointer" : "default", borderTop: accent ? `3px solid ${accent}` : undefined, transition: "box-shadow 0.15s", ...style }}
    onMouseEnter={e => { if (onClick) e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}>
    {children}
  </div>
);

const KPI = ({ label, value, sub, color = C.pri, icon }) => (
  <Cd style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{icon}</div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.t1, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 11, color: C.t3, marginTop: 1 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color, marginTop: 1, fontWeight: 500 }}>{sub}</div>}
    </div>
  </Cd>
);

const Bar = ({ v, h = 5, c = C.pri }) => (
  <div style={{ width: "100%", height: h, background: C.borL, borderRadius: h, overflow: "hidden" }}>
    <div style={{ width: `${v}%`, height: "100%", background: c, borderRadius: h, transition: "width 0.6s" }} />
  </div>
);

const Sec = ({ children, sub }) => (
  <div style={{ marginBottom: 14 }}>
    <h2 style={{ fontSize: 16, fontWeight: 700, color: C.t1, margin: 0 }}>{children}</h2>
    {sub && <p style={{ fontSize: 12, color: C.t3, margin: "3px 0 0", lineHeight: 1.4 }}>{sub}</p>}
  </div>
);

const Grid = ({ cols = "repeat(auto-fit, minmax(160px, 1fr))", gap = 10, children, style = {} }) => (
  <div style={{ display: "grid", gridTemplateColumns: cols, gap, ...style }}>{children}</div>
);

// Mobile-friendly scrollable table
const Tbl = ({ cols, data, onRow }) => (
  <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", border: `1px solid ${C.bor}`, borderRadius: 10 }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: Math.max(cols.length * 110, 400) }}>
      <thead>
        <tr style={{ background: C.borL }}>
          {cols.map((c, i) => (
            <th key={i} style={{ padding: "8px 10px", textAlign: "left", fontWeight: 600, color: C.t2, borderBottom: `1px solid ${C.bor}`, whiteSpace: "nowrap", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>{c.l}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((r, ri) => (
          <tr key={ri} onClick={() => onRow?.(r)} style={{ borderBottom: `1px solid ${C.borL}`, cursor: onRow ? "pointer" : "default" }}
            onMouseEnter={e => { if (onRow) e.currentTarget.style.background = C.priL; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            {cols.map((c, ci) => (
              <td key={ci} style={{ padding: "8px 10px", color: C.t2 }}>{c.r ? c.r(r) : r[c.k]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BackBtn = ({ onClick, label = "Back" }) => (
  <button onClick={onClick} style={{ background: "none", border: "none", color: C.pri, fontWeight: 600, cursor: "pointer", padding: "4px 0", marginBottom: 12, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
    <span style={{ fontSize: 14 }}>←</span> {label}
  </button>
);

// ══════════════════════════════════════════════════════════
// ── TAB: DASHBOARD ────────────────────────────────────────
// ══════════════════════════════════════════════════════════

const DashboardTab = () => {
  const ab = BATCHES.filter(b => b.status === "In Progress").length;
  const re = EQUIP.filter(e => e.status === "Running").length;
  const od = DEVIATIONS.filter(d => !d.status.includes("Closed")).length;
  return (
    <div>
      <Sec sub="Dexlansoprazole DR Capsules 60mg (DXLPR) | Real-time production overview">Production Dashboard</Sec>
      <Grid cols="repeat(auto-fit, minmax(150px, 1fr))" gap={10} style={{ marginBottom: 18 }}>
        <KPI icon="⚡" label="Active Batches" value={ab} sub="2 in final stages" color={C.bl} />
        <KPI icon="🏭" label="Equipment Running" value={`${re}/${EQUIP.length}`} color={C.gr} />
        <KPI icon="📊" label="Avg. Yield" value="98.1%" sub="+0.2% vs last month" color={C.gr} />
        <KPI icon="⚠️" label="Open Deviations" value={od} sub={od > 0 ? "1 under investigation" : ""} color={od > 0 ? C.rd : C.gr} />
        <KPI icon="🔬" label="IPC Checks Today" value={IPC_DATA.length} sub={`${IPC_DATA.filter(i => i.status === "Alert").length} alerts`} color={C.or} />
        <KPI icon="📦" label="Total Batches (DXLPR)" value="230" sub="Since Jan 2019" color={C.pu} />
      </Grid>

      <Grid cols="1fr" gap={14} style={{ marginBottom: 18 }}>
        <Cd>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 12 }}>Active Batch Progress (10-Stage Flow)</div>
          {BATCHES.filter(b => b.status === "In Progress").map(b => (
            <div key={b.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, flexWrap: "wrap", gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>{b.id}</span>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: C.t3 }}>{b.stage}</span>
                  <span style={{ fontSize: 11, color: C.pri, fontWeight: 700 }}>{b.progress}%</span>
                </div>
              </div>
              <Bar v={b.progress} c={b.progress >= 90 ? C.gr : C.pri} />
              <div style={{ fontSize: 10, color: C.t4, marginTop: 3 }}>MFR: {b.mfr} | Size: {b.batchSize} | Pack: {b.packSize}</div>
            </div>
          ))}
        </Cd>
      </Grid>

      <Cd>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 10 }}>10-Stage Distribution</div>
        {STAGES_10.map(s => {
          const c = BATCHES.filter(b => b.status === "In Progress" && b.stage === s.name).length;
          return (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 20, fontSize: 12, textAlign: "center" }}>{s.icon}</div>
              <div style={{ width: 90, fontSize: 11, color: C.t3, textAlign: "right" }}>{s.name}</div>
              <div style={{ flex: 1, height: 16, background: C.borL, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${Math.max(c * 25, c > 0 ? 10 : 0)}%`, height: "100%", background: c > 0 ? C.pri : "transparent", borderRadius: 3 }} />
              </div>
              <div style={{ width: 20, fontSize: 12, fontWeight: 600, color: c > 0 ? C.pri : C.t4 }}>{c}</div>
            </div>
          );
        })}
      </Cd>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// ── TAB: BATCH EXECUTION (10-Step) ────────────────────────
// ══════════════════════════════════════════════════════════

const BatchTab = () => {
  const [sel, setSel] = useState(null);
  const b = BATCHES.find(x => x.id === sel);
  const [expandedStep, setExpandedStep] = useState(null);

  if (!sel) {
    return (
      <div>
        <Sec sub="Electronic batch execution per 21 CFR Part 11 | 10-stage guided workflow with maker-checker e-sign">Batch Execution (eBMR / eBPR)</Sec>
        <Tbl cols={[
          { l: "Batch", r: r => <span style={{ fontWeight: 600, color: C.pri }}>{r.id}</span> },
          { l: "MFR", r: r => <span style={{ fontSize: 10, fontFamily: "monospace" }}>{r.mfr}</span> },
          { l: "Size", k: "batchSize" },
          { l: "Stage", r: r => <span>{STAGES_10.find(s => s.name === r.stage)?.icon || "✅"} {r.stage}</span> },
          { l: "Progress", r: r => <div style={{ width: 80 }}><Bar v={r.progress} /></div> },
          { l: "Yield", k: "yield" },
          { l: "Status", r: r => <Badge s={r.status} /> },
          { l: "Devs", r: r => <span style={{ color: r.devs > 0 ? C.rd : C.gr, fontWeight: 600 }}>{r.devs}</span> },
        ]} data={BATCHES} onRow={r => setSel(r.id)} />
      </div>
    );
  }

  return (
    <div>
      <BackBtn onClick={() => setSel(null)} label="Back to Batch List" />

      {/* Batch Header */}
      <Cd style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.t1 }}>{b.id}</div>
            <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{b.product} | {b.batchSize} | {b.packSize}</div>
            <div style={{ fontSize: 10, color: C.t4, marginTop: 2, fontFamily: "monospace" }}>MFR: {b.mfr} | BMR: {b.bmr}</div>
            <div style={{ fontSize: 10, color: C.t4, fontFamily: "monospace" }}>MPR: {b.mpr} | BPR: {b.bpr}</div>
          </div>
          <Badge s={b.status} sz="md" />
        </div>
      </Cd>

      {/* 10-Stage Progress Bar */}
      <Cd style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, marginBottom: 10 }}>10-Stage Progress</div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 0, overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 4 }}>
          {STAGES_10.map((s, i) => {
            const done = i < (b.stageIdx - 1);
            const cur = i === (b.stageIdx - 1);
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <div style={{ textAlign: "center", minWidth: 40 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: done ? C.gr : cur ? C.pri : C.borL,
                    color: (done || cur) ? "#fff" : C.t4,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, margin: "0 auto",
                    boxShadow: cur ? `0 0 0 3px ${C.pri}30` : "none",
                  }}>
                    {done ? "✓" : s.id}
                  </div>
                  <div style={{ fontSize: 8, color: cur ? C.pri : done ? C.gr : C.t4, marginTop: 2, fontWeight: cur ? 700 : 400, lineHeight: 1.1 }}>{s.short}</div>
                </div>
                {i < STAGES_10.length - 1 && <div style={{ width: 12, height: 2, background: done ? C.gr : C.borL, marginBottom: 14, flexShrink: 0 }} />}
              </div>
            );
          })}
        </div>
      </Cd>

      {/* 10 Execution Steps - Accordion */}
      <Cd style={{ marginBottom: 12, padding: 0 }}>
        <div style={{ padding: "12px 16px 8px", fontSize: 12, fontWeight: 600, color: C.t1 }}>Step-by-Step Execution Log</div>
        {EXEC_STEPS_10.map(es => {
          const open = expandedStep === es.step;
          const isDone = es.status === "Completed";
          const isCur = es.status === "In Progress";
          return (
            <div key={es.step} style={{ borderBottom: `1px solid ${C.borL}` }}>
              <div
                onClick={() => setExpandedStep(open ? null : es.step)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", cursor: "pointer", background: isCur ? `${C.pri}06` : "transparent" }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                  background: isDone ? C.gr : isCur ? C.pri : C.borL,
                  color: (isDone || isCur) ? "#fff" : C.t4,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700,
                }}>{isDone ? "✓" : es.step}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>{es.name}</div>
                  <div style={{ fontSize: 10, color: C.t3 }}>{es.equip} | {es.area}</div>
                </div>
                <Badge s={es.status} />
                <span style={{ fontSize: 12, color: C.t4, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
              </div>
              {open && (
                <div style={{ padding: "0 16px 12px 48px" }}>
                  <div style={{ fontSize: 11, color: C.t3, marginBottom: 6 }}>
                    SOP: <span style={{ color: C.bl, textDecoration: "underline" }}>{es.sop}</span>
                    {es.signedBy !== "-" && <> | Executed: <b>{es.signedBy}</b> | Verified: <b>{es.verifiedBy}</b> | {es.time}</>}
                  </div>
                  <div style={{ fontSize: 10, color: C.t3, marginBottom: 8, fontStyle: "italic" }}>{es.notes}</div>
                  {es.params.length > 0 && (
                    <div style={{ background: C.borL, borderRadius: 6, padding: 8 }}>
                      <div style={{ fontSize: 9, fontWeight: 600, color: C.t3, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>CPP / IPC Parameters</div>
                      {es.params.map((pr, pi) => (
                        <div key={pi} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", borderBottom: pi < es.params.length - 1 ? `1px solid ${C.bor}` : "none" }}>
                          <span style={{ fontSize: 11, color: C.t2 }}>{pr.p}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "monospace", color: C.t1 }}>{pr.v}</span>
                            <Badge s={pr.s} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </Cd>

      {/* Yield & Hold Time Cards */}
      <Grid cols="repeat(auto-fit, minmax(200px, 1fr))" gap={10}>
        <Cd accent={C.gr}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, marginBottom: 6 }}>Yield Reconciliation</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: parseFloat(b.yield) >= 98 ? C.gr : C.or }}>{b.yield || "Pending"}</div>
          <div style={{ fontSize: 10, color: C.t4 }}>Acceptance: 95.0% - 101.0%</div>
          <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
            {[{ l: "Comp. Yield", v: "98.01%" }, { l: "Coat. Yield", v: "TBD" }, { l: "Insp. Yield", v: "TBD" }].map((y, i) => (
              <span key={i} style={{ padding: "2px 8px", background: C.borL, borderRadius: 4, fontSize: 10, color: C.t3 }}>{y.l}: <b>{y.v}</b></span>
            ))}
          </div>
        </Cd>
        <Cd accent={C.bl}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, marginBottom: 6 }}>Hold Time Tracking</div>
          {[{ l: "CHT (Granulation→Drying)", v: "2h 15m", lim: "4h", ok: true }, { l: "DHT (Drying→Blending)", v: "45m", lim: "48h", ok: true }, { l: "Material Hold", v: "52h", lim: "72h", ok: true }].map((h, i) => (
            <div key={i} style={{ padding: "4px 8px", background: h.ok ? C.grL : C.rdL, borderRadius: 4, border: `1px solid ${h.ok ? C.gr : C.rd}20`, marginBottom: 3 }}>
              <div style={{ fontSize: 9, color: C.t3 }}>{h.l}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: h.ok ? C.gr : C.rd }}>{h.v} <span style={{ fontSize: 9, fontWeight: 400, color: C.t4 }}>/ {h.lim}</span></div>
            </div>
          ))}
        </Cd>
        <Cd accent={C.pu}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, marginBottom: 6 }}>Shelf Life</div>
          <div style={{ fontSize: 11 }}>
            {[{ l: "Shelf Life", v: "3 years" }, { l: "Mfg Date", v: b.mfgDate }, { l: "Exp Date", v: b.expDate }, { l: "MFR Version", v: b.mfr }].map((r, i) => (
              <div key={i} style={{ padding: "3px 0", borderBottom: `1px solid ${C.borL}`, display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.t3 }}>{r.l}</span>
                <span style={{ fontWeight: 600, color: C.t1, fontSize: 11 }}>{r.v}</span>
              </div>
            ))}
          </div>
        </Cd>
      </Grid>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// ── TAB: MASTER TEMPLATES ─────────────────────────────────
// ══════════════════════════════════════════════════════════

const TemplatesTab = () => {
  const [sel, setSel] = useState(null);
  const t = TEMPLATES.find(x => x.id === sel);
  return (
    <div>
      <Sec sub="MFR/BMR/MPR/BPR version control | DXLPR has evolved through 8+ template revisions since 2019">Master Data & Templates</Sec>
      {!sel ? <>
        <Grid cols="repeat(auto-fit, minmax(100px, 1fr))" gap={8} style={{ marginBottom: 14 }}>
          <Cd accent={C.gr} style={{ textAlign: "center", padding: 10 }}><div style={{ fontSize: 18, fontWeight: 700, color: C.gr }}>{TEMPLATES.filter(t => t.status === "Approved").length}</div><div style={{ fontSize: 10, color: C.t3 }}>Approved</div></Cd>
          <Cd accent={C.yl} style={{ textAlign: "center", padding: 10 }}><div style={{ fontSize: 18, fontWeight: 700, color: C.yl }}>{TEMPLATES.filter(t => t.status === "Under Review").length}</div><div style={{ fontSize: 10, color: C.t3 }}>Under Review</div></Cd>
          <Cd accent={C.t4} style={{ textAlign: "center", padding: 10 }}><div style={{ fontSize: 18, fontWeight: 700, color: C.t4 }}>{TEMPLATES.filter(t => t.status === "Obsoleted").length}</div><div style={{ fontSize: 10, color: C.t3 }}>Obsoleted</div></Cd>
          <Cd accent={C.bl} style={{ textAlign: "center", padding: 10 }}><div style={{ fontSize: 18, fontWeight: 700, color: C.bl }}>{TEMPLATES.length}</div><div style={{ fontSize: 10, color: C.t3 }}>Total</div></Cd>
        </Grid>
        <Tbl cols={[
          { l: "Template ID", r: r => <span style={{ fontWeight: 600, color: C.pri, fontSize: 11 }}>{r.id}</span> },
          { l: "Type", k: "type" },
          { l: "Version", r: r => <span style={{ fontFamily: "monospace", fontWeight: 600, fontSize: 11 }}>{r.version}</span> },
          { l: "Status", r: r => <Badge s={r.status} /> },
          { l: "Stages", k: "stages" },
          { l: "Effective", k: "effectiveDate" },
        ]} data={TEMPLATES} onRow={r => setSel(r.id)} />
        <Cd style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, marginBottom: 8 }}>Template Evolution Timeline (DXLPR)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
            {TEMPLATES.filter(t => t.type === "MFR").map((t, i, arr) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ padding: "4px 10px", borderRadius: 16, background: t.status === "Approved" ? C.priL : t.status === "Under Review" ? C.ylL : C.borL, color: t.status === "Approved" ? C.pri : t.status === "Under Review" ? C.yl : C.t4, fontSize: 10, fontWeight: 600, border: `1px solid ${t.status === "Approved" ? C.pri : C.bor}30` }}>
                  {t.version}
                </div>
                {i < arr.length - 1 && <span style={{ margin: "0 2px", color: C.t4, fontSize: 10 }}>→</span>}
              </div>
            ))}
          </div>
        </Cd>
      </> : <>
        <BackBtn onClick={() => setSel(null)} label="Back to Templates" />
        <Cd style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div><div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>{t.id}</div><div style={{ fontSize: 12, color: C.t3 }}>{t.product} | {t.type} | {t.version}</div></div>
            <Badge s={t.status} sz="md" />
          </div>
        </Cd>
        <Grid cols="repeat(auto-fit, minmax(200px, 1fr))" gap={10}>
          <Cd>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.t1, marginBottom: 6 }}>Revision Reason</div>
            <div style={{ fontSize: 12, color: C.t2, lineHeight: 1.5 }}>{t.revisionReason}</div>
            <div style={{ fontSize: 10, color: C.t4, marginTop: 6 }}>Previous: {t.prevVersion || "None"}</div>
          </Cd>
          <Cd>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.t1, marginBottom: 6 }}>10-Stage Template</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {STAGES_10.map(s => <span key={s.id} style={{ padding: "2px 6px", background: C.borL, borderRadius: 4, fontSize: 9, color: C.t3 }}>{s.icon} {s.short}</span>)}
            </div>
          </Cd>
          <Cd>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.t1, marginBottom: 6 }}>Linked Batches</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.pri }}>{BATCHES.filter(b => b.mfr === t.id || b.bmr === t.id).length}</div>
            <div style={{ fontSize: 10, color: C.t4 }}>batches executed on this template</div>
          </Cd>
        </Grid>
      </>}
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// ── TAB: MATERIALS ────────────────────────────────────────
// ══════════════════════════════════════════════════════════

const MaterialsTab = () => (
  <div>
    <Sec sub="BOM, dispensing & AR number traceability | 1 API + 9 excipients per DXLPR batch">Materials Management</Sec>
    <Grid cols="repeat(auto-fit, minmax(100px, 1fr))" gap={8} style={{ marginBottom: 14 }}>
      {[
        { l: "Dispensed", v: BOM_DATA.filter(b => b.status === "Verified").length, c: C.gr },
        { l: "Pending", v: BOM_DATA.filter(b => b.status === "Pending").length, c: C.yl },
        { l: "BOM Items", v: BOM_DATA.length, c: C.bl },
      ].map((k, i) => <Cd key={i} accent={k.c} style={{ textAlign: "center", padding: 10 }}><div style={{ fontSize: 18, fontWeight: 700, color: k.c }}>{k.v}</div><div style={{ fontSize: 10, color: C.t3 }}>{k.l}</div></Cd>)}
    </Grid>
    <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, marginBottom: 8 }}>BOM for DXLPR0185: Dexlansoprazole DR 60mg | Batch Size: 45.0L</div>
    <Tbl cols={[
      { l: "Material", r: r => <div><div style={{ fontWeight: 500, fontSize: 11 }}>{r.material}</div><div style={{ fontSize: 9, color: C.t4 }}>{r.code}</div></div> },
      { l: "AR No.", r: r => <span style={{ fontFamily: "monospace", fontSize: 10 }}>{r.arNo}</span> },
      { l: "Required", k: "required" },
      { l: "Dispensed", r: r => <span style={{ fontWeight: 600 }}>{r.dispensed}</span> },
      { l: "Lot", r: r => <span style={{ fontSize: 10, fontFamily: "monospace" }}>{r.lot}</span> },
      { l: "Hold Time", k: "holdTime" },
      { l: "Status", r: r => <Badge s={r.status} /> },
    ]} data={BOM_DATA} />
  </div>
);

// ══════════════════════════════════════════════════════════
// ── TAB: EQUIPMENT ────────────────────────────────────────
// ══════════════════════════════════════════════════════════

const EquipmentTab = () => (
  <div>
    <Sec sub="Equipment status mapped to 10-stage flow | 15 equipment items across 7 production areas">Equipment & Instruments</Sec>
    <Grid cols="repeat(auto-fit, minmax(100px, 1fr))" gap={8} style={{ marginBottom: 14 }}>
      {[
        { l: "Total", v: EQUIP.length, c: C.bl, i: "🔧" },
        { l: "Running", v: EQUIP.filter(e => e.status === "Running").length, c: C.gr, i: "✅" },
        { l: "Needs Cleaning", v: EQUIP.filter(e => e.clean === "Dirty").length, c: C.rd, i: "🧹" },
        { l: "Qual Due", v: EQUIP.filter(e => e.qualStatus === "Due").length, c: C.yl, i: "📅" },
      ].map((k, i) => <Cd key={i} style={{ textAlign: "center", padding: 10 }}><div style={{ fontSize: 14 }}>{k.i}</div><div style={{ fontSize: 18, fontWeight: 700, color: k.c }}>{k.v}</div><div style={{ fontSize: 9, color: C.t3 }}>{k.l}</div></Cd>)}
    </Grid>
    <Tbl cols={[
      { l: "ID", r: r => <span style={{ fontWeight: 600, fontFamily: "monospace", fontSize: 11 }}>{r.id}</span> },
      { l: "Equipment", r: r => <span style={{ fontSize: 11 }}>{r.name}</span> },
      { l: "Area", r: r => <span style={{ fontSize: 10 }}>{r.area}</span> },
      { l: "Status", r: r => <Badge s={r.status} /> },
      { l: "Calib Due", r: r => <span style={{ color: new Date(r.calibDue) < new Date("2025-03-01") ? C.rd : C.t2, fontWeight: new Date(r.calibDue) < new Date("2025-03-01") ? 600 : 400, fontSize: 11 }}>{r.calibDue}</span> },
      { l: "Qual", r: r => <Badge s={r.qualStatus} /> },
      { l: "Clean", r: r => <Badge s={r.clean} /> },
    ]} data={EQUIP} />
    <Cd style={{ marginTop: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, marginBottom: 8 }}>Equipment to Stage Mapping</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {STAGES_10.map(s => (
          <div key={s.id} style={{ padding: "6px 10px", background: C.borL, borderRadius: 6, fontSize: 10, minWidth: 80 }}>
            <div style={{ fontWeight: 600, color: C.t1, marginBottom: 2 }}>{s.icon} {s.name}</div>
            <div style={{ color: C.t3, fontFamily: "monospace", fontSize: 9 }}>{s.equip.join(", ")}</div>
          </div>
        ))}
      </div>
    </Cd>
  </div>
);

// ══════════════════════════════════════════════════════════
// ── TAB: IPC & CONTROLS ──────────────────────────────────
// ══════════════════════════════════════════════════════════

const IPCTab = () => (
  <div>
    <Sec sub="In-process checks across 10 stages | CPP monitoring with auto-alert on OOL">IPC & Process Controls</Sec>
    <Grid cols="repeat(auto-fit, minmax(100px, 1fr))" gap={8} style={{ marginBottom: 14 }}>
      {[
        { l: "Total Checks", v: IPC_DATA.length, c: C.bl },
        { l: "Passed", v: IPC_DATA.filter(i => i.status === "Pass").length, c: C.gr },
        { l: "Alerts (OOL)", v: IPC_DATA.filter(i => i.status === "Alert").length, c: C.or },
      ].map((k, i) => <Cd key={i} accent={k.c} style={{ textAlign: "center", padding: 10 }}><div style={{ fontSize: 18, fontWeight: 700, color: k.c }}>{k.v}</div><div style={{ fontSize: 10, color: C.t3 }}>{k.l}</div></Cd>)}
    </Grid>
    <Tbl cols={[
      { l: "ID", r: r => <span style={{ fontFamily: "monospace", fontWeight: 600, fontSize: 10 }}>{r.id}</span> },
      { l: "Batch", k: "batch" },
      { l: "Stage", k: "stage" },
      { l: "Parameter", r: r => <span style={{ fontWeight: 500, fontSize: 11 }}>{r.check}</span> },
      { l: "Limit", r: r => <span style={{ fontSize: 10, fontFamily: "monospace" }}>{r.limit}</span> },
      { l: "Result", r: r => <span style={{ fontWeight: 600, color: r.status === "Pass" ? C.gr : C.or, fontFamily: "monospace" }}>{r.result}</span> },
      { l: "Status", r: r => <Badge s={r.status} /> },
    ]} data={IPC_DATA} />
    {IPC_DATA.some(i => i.status === "Alert") && (
      <Cd style={{ marginTop: 10, borderLeft: `4px solid ${C.or}` }}>
        <div style={{ fontSize: 11, color: C.or, fontWeight: 600 }}>Alert: DXLPR0186 Coating Weight Gain at 3.7% (limit 3.0% ± 0.5%)</div>
        <div style={{ fontSize: 10, color: C.t3, marginTop: 2 }}>DEV-2025-011 raised | QA notification triggered | Batch hold pending investigation</div>
      </Cd>
    )}
  </div>
);

// ══════════════════════════════════════════════════════════
// ── TAB: E-LOGBOOKS ──────────────────────────────────────
// ══════════════════════════════════════════════════════════

const LogbooksTab = () => (
  <div>
    <Sec sub="Electronic logbooks per area/equipment | Auto-linked to batch execution steps">E-Logbooks</Sec>
    <Tbl cols={[
      { l: "Log ID", r: r => <span style={{ fontWeight: 600, fontFamily: "monospace", fontSize: 11 }}>{r.id}</span> },
      { l: "Type", k: "type" },
      { l: "Equipment", k: "equip" },
      { l: "Area", k: "area" },
      { l: "Entries", r: r => <span style={{ fontWeight: 600 }}>{r.entries}</span> },
      { l: "Last Entry", r: r => <span style={{ fontSize: 10, fontFamily: "monospace" }}>{r.last}</span> },
      { l: "Status", r: r => <Badge s={r.status} /> },
    ]} data={LOGBOOKS} />
  </div>
);

// ══════════════════════════════════════════════════════════
// ── TAB: DEVIATIONS ──────────────────────────────────────
// ══════════════════════════════════════════════════════════

const DeviationsTab = () => (
  <div>
    <Sec sub="Deviation management with auto-linking to batch, stage, and equipment">Deviations & Quality Events</Sec>
    <Grid cols="repeat(auto-fit, minmax(100px, 1fr))" gap={8} style={{ marginBottom: 14 }}>
      {[
        { l: "Open", v: DEVIATIONS.filter(d => d.status === "Open").length, c: C.rd },
        { l: "Under Investigation", v: DEVIATIONS.filter(d => d.status === "Under Investigation").length, c: C.yl },
        { l: "Closed", v: DEVIATIONS.filter(d => d.status === "Closed").length, c: C.gr },
      ].map((k, i) => <Cd key={i} accent={k.c} style={{ textAlign: "center", padding: 10 }}><div style={{ fontSize: 18, fontWeight: 700, color: k.c }}>{k.v}</div><div style={{ fontSize: 10, color: C.t3 }}>{k.l}</div></Cd>)}
    </Grid>
    <Tbl cols={[
      { l: "ID", r: r => <span style={{ fontWeight: 600, color: C.rd, fontFamily: "monospace", fontSize: 10 }}>{r.id}</span> },
      { l: "Batch", k: "batch" },
      { l: "Stage", k: "stage" },
      { l: "Category", r: r => <Badge s={r.cat} /> },
      { l: "Type", k: "type" },
      { l: "Description", r: r => <span style={{ fontSize: 11 }}>{r.desc}</span> },
      { l: "Status", r: r => <Badge s={r.status} /> },
    ]} data={DEVIATIONS} />
  </div>
);

// ══════════════════════════════════════════════════════════
// ── TAB: AUDIT TRAIL ─────────────────────────────────────
// ══════════════════════════════════════════════════════════

const AuditTab = () => (
  <div>
    <Sec sub="21 CFR Part 11 compliant | Immutable, timestamped, user-attributed records">Audit Trail</Sec>
    <Tbl cols={[
      { l: "ID", r: r => <span style={{ fontFamily: "monospace", fontWeight: 600, fontSize: 10 }}>{r.id}</span> },
      { l: "Timestamp", r: r => <span style={{ fontFamily: "monospace", fontSize: 10 }}>{r.ts}</span> },
      { l: "User", r: r => <span style={{ fontWeight: 500 }}>{r.user}</span> },
      { l: "Action", k: "action" },
      { l: "Detail", r: r => <span style={{ fontSize: 10, color: C.t2 }}>{r.detail}</span> },
      { l: "Module", k: "module" },
    ]} data={AUDIT} />
    <Cd style={{ marginTop: 10, borderLeft: `4px solid ${C.pri}` }}>
      <div style={{ fontSize: 10, color: C.t3 }}>All records are immutable and cannot be modified or deleted. Every action is attributed to a specific user with timestamp, IP address, and session ID per 21 CFR Part 11 requirements.</div>
    </Cd>
  </div>
);

// ══════════════════════════════════════════════════════════
// ── TAB: REPORTS ─────────────────────────────────────────
// ══════════════════════════════════════════════════════════

const ReportsTab = () => (
  <div>
    <Sec sub="CPV/APR analytics from 230 DXLPR batches | Yield trend, CPP drift, and process capability">Reports & Analytics</Sec>
    <Cd style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, marginBottom: 10 }}>Yield Cascade Across 230 Batches (Jan 2019 - Dec 2024)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { stage: "Sifted Granules Yield", min: "96.67%", max: "98.53%", mean: "97.6%", target: "≥95%", c: C.gr },
          { stage: "Compression Yield", min: "96.5%", max: "99.5%", mean: "98.0%", target: "≥96%", c: C.gr },
          { stage: "Coating Yield", min: "94.5%", max: "100.5%", mean: "97.1%", target: "≥95%", c: C.gr },
          { stage: "Inspection Yield", min: "95.0%", max: "101.0%", mean: "98.2%", target: "≥96%", c: C.gr },
          { stage: "Packing Yield", min: "97.5%", max: "100.4%", mean: "99.0%", target: "≥97%", c: C.gr },
        ].map((y, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: C.t2 }}>{y.stage}</span>
              <span style={{ fontSize: 10, color: C.t3 }}>Range: {y.min} - {y.max} | Mean: <b style={{ color: y.c }}>{y.mean}</b></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ flex: 1 }}><Bar v={parseFloat(y.mean)} c={y.c} h={8} /></div>
              <span style={{ fontSize: 9, color: C.t4, minWidth: 40 }}>Target: {y.target}</span>
            </div>
          </div>
        ))}
      </div>
    </Cd>
    <Grid cols="repeat(auto-fit, minmax(200px, 1fr))" gap={10}>
      <Cd>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, marginBottom: 8 }}>CPP Summary (Compression)</div>
        {[
          { p: "Hardness", range: "48-76 N", mean: "63.2 N" },
          { p: "Thickness", range: "1.0-3.5 mm", mean: "2.1 mm" },
          { p: "Avg Weight", range: "145-155 mg", mean: "150.2 mg" },
          { p: "Comp Yield", range: "96.5-99.5%", mean: "98.0%" },
        ].map((c, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${C.borL}`, fontSize: 11 }}>
            <span style={{ color: C.t3 }}>{c.p}</span>
            <span style={{ color: C.t1 }}>{c.range} (μ: <b>{c.mean}</b>)</span>
          </div>
        ))}
      </Cd>
      <Cd>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, marginBottom: 8 }}>CPP Summary (Coating)</div>
        {[
          { p: "Pan Speed", range: "38-46 RPM", mean: "42.0 RPM" },
          { p: "Bed Temp", range: "95-100°C", mean: "97.5°C" },
          { p: "Viscosity", range: "42-52 cps", mean: "47.1 cps" },
          { p: "Coat Yield", range: "94.5-100.5%", mean: "97.1%" },
        ].map((c, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${C.borL}`, fontSize: 11 }}>
            <span style={{ color: C.t3 }}>{c.p}</span>
            <span style={{ color: C.t1 }}>{c.range} (μ: <b>{c.mean}</b>)</span>
          </div>
        ))}
      </Cd>
      <Cd>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, marginBottom: 8 }}>Batch Volume by Year</div>
        {[
          { yr: "2019", count: 35 }, { yr: "2020", count: 50 }, { yr: "2021", count: 55 },
          { yr: "2022", count: 40 }, { yr: "2023", count: 30 }, { yr: "2024", count: 20 },
        ].map((y, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ width: 30, fontSize: 10, color: C.t3, fontWeight: 600 }}>{y.yr}</span>
            <div style={{ flex: 1 }}><Bar v={y.count * 1.8} c={C.pri} h={12} /></div>
            <span style={{ width: 20, fontSize: 11, fontWeight: 600, color: C.pri }}>{y.count}</span>
          </div>
        ))}
      </Cd>
    </Grid>
  </div>
);

// ══════════════════════════════════════════════════════════
// ── MAIN APP ─────────────────────────────────────────────
// ══════════════════════════════════════════════════════════

const TABS = [
  { id: "dash", label: "Dashboard", icon: "📊", comp: DashboardTab },
  { id: "batch", label: "Batch Execution", icon: "⚡", comp: BatchTab },
  { id: "templ", label: "Templates", icon: "📋", comp: TemplatesTab },
  { id: "mat", label: "Materials", icon: "🧪", comp: MaterialsTab },
  { id: "equip", label: "Equipment", icon: "🔧", comp: EquipmentTab },
  { id: "ipc", label: "IPC & Controls", icon: "🔬", comp: IPCTab },
  { id: "log", label: "E-Logbooks", icon: "📓", comp: LogbooksTab },
  { id: "dev", label: "Deviations", icon: "⚠️", comp: DeviationsTab },
  { id: "audit", label: "Audit Trail", icon: "🔒", comp: AuditTab },
  { id: "report", label: "Reports", icon: "📈", comp: ReportsTab },
];

export default function App() {
  const [tab, setTab] = useState("dash");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const ActiveComp = TABS.find(t => t.id === tab)?.comp || DashboardTab;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ background: C.priG, color: "#fff", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isMobile && (
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", padding: 0, lineHeight: 1 }}>
              {menuOpen ? "✕" : "☰"}
            </button>
          )}
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.5 }}>MES</div>
            <div style={{ fontSize: 9, opacity: 0.75, letterSpacing: 0.3 }}>Manufacturing Execution System</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, opacity: 0.8 }}>DXLPR | Dexlansoprazole DR 60mg</div>
          <div style={{ fontSize: 9, opacity: 0.6 }}>Demo Data | {new Date().toLocaleDateString("en-IN")}</div>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 52px)" }}>
        {/* Sidebar / Mobile drawer */}
        {(isMobile ? menuOpen : true) && (
          <div style={{
            width: isMobile ? "100%" : 180,
            background: C.card,
            borderRight: isMobile ? "none" : `1px solid ${C.bor}`,
            padding: "8px 0",
            position: isMobile ? "fixed" : "sticky",
            top: isMobile ? 52 : 52,
            left: 0,
            height: isMobile ? "calc(100vh - 52px)" : "calc(100vh - 52px)",
            zIndex: 90,
            overflowY: "auto",
            boxShadow: isMobile ? "0 4px 20px rgba(0,0,0,0.15)" : "none",
          }}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); if (isMobile) setMenuOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  width: "100%", padding: isMobile ? "14px 20px" : "9px 14px",
                  border: "none", cursor: "pointer", textAlign: "left",
                  background: tab === t.id ? C.priL : "transparent",
                  color: tab === t.id ? C.pri : C.t3,
                  fontWeight: tab === t.id ? 600 : 400,
                  fontSize: isMobile ? 14 : 12,
                  borderLeft: tab === t.id ? `3px solid ${C.pri}` : "3px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: isMobile ? 18 : 14 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.bor}`, marginTop: 8 }}>
              <div style={{ fontSize: 9, color: C.t4, lineHeight: 1.5 }}>
                Product: DXLPR (Synthetic)<br />
                230 batches | 10 stages<br />
                21 CFR Part 11 compliant<br />
                v3.0 | PlutoxAI
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div style={{ flex: 1, padding: isMobile ? 12 : 20, maxWidth: "100%", overflow: "hidden" }}>
          <ActiveComp />
        </div>
      </div>
    </div>
  );
}
