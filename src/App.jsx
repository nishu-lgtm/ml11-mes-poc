import { useState, useEffect } from "react";

// ── Constants ──────────────────────────────────────────
const O = "#EE711D", DK = "#1A1A2E", LB = "#FFF8F3";
const G50 = "#F9FAFB", G100 = "#F3F4F6", G200 = "#E5E7EB", G300 = "#D1D5DB";
const G400 = "#9CA3AF", G500 = "#6B7280", G600 = "#4B5563", G700 = "#374151", G800 = "#1F2937";
const GR = "#059669", RD = "#DC2626", YL = "#D97706", BL = "#2563EB", PU = "#7C3AED";

// ── Data ──────────────────────────────────────────────
const EQUIP = [
  { id: "PR571", name: "High Shear Granulator", make: "Glatt System", area: "Granulation", status: "Running", calibDue: "2025-03-15", clean: "Clean", cht: "4h", dht: "24h", ppmDue: "2025-04-01", qualStatus: "Qualified" },
  { id: "PR572", name: "Fluid Bed Dryer", make: "Glatt System", area: "Drying", status: "Idle", calibDue: "2025-02-28", clean: "Clean", cht: "6h", dht: "48h", ppmDue: "2025-03-15", qualStatus: "Qualified" },
  { id: "PR573", name: "High Shear Granulator", make: "Glatt System", area: "Granulation", status: "Maintenance", calibDue: "2025-04-10", clean: "Dirty", cht: "4h", dht: "24h", ppmDue: "2025-05-01", qualStatus: "Due" },
  { id: "PR575", name: "Fluid Bed Dryer", make: "Glatt System", area: "Drying", status: "Running", calibDue: "2025-03-20", clean: "Clean", cht: "6h", dht: "48h", ppmDue: "2025-04-10", qualStatus: "Qualified" },
  { id: "PR331", name: "Octagonal Blender", make: "Tapasya", area: "Blending", status: "Idle", calibDue: "2025-05-01", clean: "Clean", cht: "2h", dht: "12h", ppmDue: "2025-06-01", qualStatus: "Qualified" },
  { id: "PR520", name: "Roll Compactor", make: "FITZPATRICK", area: "Compaction", status: "Running", calibDue: "2025-03-05", clean: "Clean", cht: "4h", dht: "24h", ppmDue: "2025-03-20", qualStatus: "Qualified" },
  { id: "PR716", name: "HATA Compression Machine", make: "Parle Elizabeth", area: "Compression", status: "Running", calibDue: "2025-04-15", clean: "Clean", cht: "8h", dht: "72h", ppmDue: "2025-05-15", qualStatus: "Qualified" },
  { id: "PR562", name: "Legacy 6100 Compression", make: "ACG-Pam", area: "Compression", status: "Idle", calibDue: "2025-03-25", clean: "Clean", cht: "8h", dht: "72h", ppmDue: "2025-04-20", qualStatus: "Qualified" },
  { id: "PR176", name: "AF-150 Capsule Filling", make: "PAM", area: "Capsule Filling", status: "Running", calibDue: "2025-02-20", clean: "Clean", cht: "4h", dht: "24h", ppmDue: "2025-03-10", qualStatus: "Qualified" },
  { id: "PR726", name: "Coating Machine", make: "Bectochem Loedige", area: "Coating", status: "Idle", calibDue: "2025-06-10", clean: "Dirty", cht: "12h", dht: "48h", ppmDue: "2025-07-01", qualStatus: "Qualified" },
  { id: "PR460", name: "Blister Packing Machine", make: "ACG PAM PAC", area: "Packing", status: "Running", calibDue: "2025-04-01", clean: "Clean", cht: "4h", dht: "24h", ppmDue: "2025-05-01", qualStatus: "Qualified" },
  { id: "PR636", name: "B Max Blister Pack", make: "ACG Pam Pharma", area: "Packing", status: "Idle", calibDue: "2025-05-20", clean: "Clean", cht: "4h", dht: "24h", ppmDue: "2025-06-15", qualStatus: "Qualified" },
];

const BALANCES = [
  { id: "BAL-01", name: "Mettler Toledo XPR-205", location: "Dispensing Bay 1", capacity: "220g", lc: "0.01mg", status: "Connected", lastCalib: "2025-02-01", nextCalib: "2025-03-01", dailyCheck: "Pass", lastWeight: "125.340 g", checkTime: "07:15" },
  { id: "BAL-02", name: "Mettler Toledo XS-6002S", location: "Dispensing Bay 2", capacity: "6.1kg", lc: "0.01g", status: "Connected", lastCalib: "2025-01-28", nextCalib: "2025-02-28", dailyCheck: "Pass", lastWeight: "4521.23 g", checkTime: "07:20" },
  { id: "BAL-03", name: "Sartorius Cubis II", location: "Granulation Room", capacity: "12kg", lc: "0.1g", status: "Connected", lastCalib: "2025-02-05", nextCalib: "2025-03-05", dailyCheck: "Pass", lastWeight: "8750.5 g", checkTime: "07:10" },
  { id: "BAL-04", name: "A&D GX-6100", location: "Compression Suite", capacity: "6.1kg", lc: "0.01g", status: "Connected", lastCalib: "2025-01-20", nextCalib: "2025-02-20", dailyCheck: "Fail", lastWeight: "-", checkTime: "07:25" },
  { id: "BAL-05", name: "Mettler Toledo ICS-449", location: "Packing Area", capacity: "150kg", lc: "1g", status: "Disconnected", lastCalib: "2025-01-15", nextCalib: "2025-02-15", dailyCheck: "Pending", lastWeight: "-", checkTime: "-" },
  { id: "BAL-06", name: "Sartorius Practum 5101", location: "QC Lab", capacity: "5.1kg", lc: "0.1g", status: "Connected", lastCalib: "2025-02-03", nextCalib: "2025-03-03", dailyCheck: "Pass", lastWeight: "342.1 g", checkTime: "07:05" },
];

const BATCHES = [
  { id: "BN-2025-001", product: "Metformin HCl 500mg", stage: "Compression", progress: 65, status: "In Progress", start: "2025-02-01", size: "500 kg", yield: "98.2%", devs: 0, mfr: "MFR-MET-003", template: "TPL-MET-v3.2" },
  { id: "BN-2025-002", product: "Atorvastatin 10mg", stage: "Coating", progress: 80, status: "In Progress", start: "2025-01-28", size: "300 kg", yield: "97.8%", devs: 1, mfr: "MFR-ATV-002", template: "TPL-ATV-v2.1" },
  { id: "BN-2025-003", product: "Amoxicillin 250mg Caps", stage: "Capsule Filling", progress: 45, status: "In Progress", start: "2025-02-03", size: "200 kg", yield: "99.1%", devs: 0, mfr: "MFR-AMX-001", template: "TPL-AMX-v1.3" },
  { id: "BN-2025-004", product: "Losartan 50mg", stage: "Blending", progress: 25, status: "In Progress", start: "2025-02-05", size: "400 kg", yield: "-", devs: 0, mfr: "MFR-LOS-001", template: "TPL-LOS-v1.1" },
  { id: "BN-2025-005", product: "Ciprofloxacin 500mg", stage: "Packing", progress: 95, status: "In Progress", start: "2025-01-20", size: "600 kg", yield: "98.5%", devs: 0, mfr: "MFR-CIP-004", template: "TPL-CIP-v4.0" },
  { id: "BN-2024-198", product: "Omeprazole 20mg", stage: "Complete", progress: 100, status: "Released", start: "2025-01-10", size: "350 kg", yield: "99.0%", devs: 0, mfr: "MFR-OMP-002", template: "TPL-OMP-v2.0" },
  { id: "BN-2024-199", product: "Azithromycin 500mg", stage: "Complete", progress: 100, status: "Under Review", start: "2025-01-15", size: "250 kg", yield: "97.5%", devs: 2, mfr: "MFR-AZM-001", template: "TPL-AZM-v1.2" },
];

const TEMPLATES = [
  { id: "TPL-MET-v3.2", product: "Metformin HCl 500mg", type: "BMR", version: "3.2", status: "Approved", effectiveDate: "2025-01-15", approvedBy: "QA Head", stages: 9, changeCtrl: "CC-2025-003", prevVersion: "v3.1", revisionReason: "Updated compression parameters per CPV data" },
  { id: "TPL-ATV-v2.1", product: "Atorvastatin 10mg", type: "BMR", version: "2.1", status: "Approved", effectiveDate: "2025-01-01", approvedBy: "QA Head", stages: 10, changeCtrl: "CC-2024-045", prevVersion: "v2.0", revisionReason: "Coating process optimization" },
  { id: "TPL-AMX-v1.3", product: "Amoxicillin 250mg Caps", type: "BMR", version: "1.3", status: "Approved", effectiveDate: "2024-11-20", approvedBy: "QA Head", stages: 8, changeCtrl: "CC-2024-038", prevVersion: "v1.2", revisionReason: "Capsule fill weight range update" },
  { id: "TPL-LOS-v1.1", product: "Losartan 50mg", type: "BMR", version: "1.1", status: "Approved", effectiveDate: "2025-02-01", approvedBy: "QA Head", stages: 9, changeCtrl: "CC-2025-001", prevVersion: "v1.0", revisionReason: "Initial template revision post validation" },
  { id: "TPL-CIP-v4.0", product: "Ciprofloxacin 500mg", type: "BPR", version: "4.0", status: "Approved", effectiveDate: "2024-12-10", approvedBy: "QA Head", stages: 7, changeCtrl: "CC-2024-042", prevVersion: "v3.2", revisionReason: "Packing line changeover update" },
  { id: "TPL-OMP-v2.0", product: "Omeprazole 20mg", type: "BMR", version: "2.0", status: "Approved", effectiveDate: "2024-10-01", approvedBy: "QA Head", stages: 10, changeCtrl: "CC-2024-030", prevVersion: "v1.5", revisionReason: "Enteric coating spec revision" },
  { id: "TPL-AZM-v1.2", product: "Azithromycin 500mg", type: "BMR", version: "1.2", status: "Approved", effectiveDate: "2024-09-15", approvedBy: "QA Head", stages: 9, changeCtrl: "CC-2024-025", prevVersion: "v1.1", revisionReason: "Granulation endpoint update" },
  { id: "TPL-MET-v3.3", product: "Metformin HCl 500mg", type: "BMR", version: "3.3", status: "Under Review", effectiveDate: "-", approvedBy: "-", stages: 9, changeCtrl: "CC-2025-008", prevVersion: "v3.2", revisionReason: "Blending time optimization per scale-up study" },
  { id: "TPL-CLEAN-001", product: "General", type: "Cleaning Checklist", version: "1.0", status: "Approved", effectiveDate: "2024-06-01", approvedBy: "QA Head", stages: 5, changeCtrl: "CC-2024-015", prevVersion: "-", revisionReason: "Initial release" },
];

const BOM_DATA = [
  { batch: "BN-2025-001", material: "Metformin HCl API", code: "RM-001-A", sapCode: "100045", required: "250.00 kg", dispensed: "250.12 kg", arNo: "AR-2025-0456", lot: "LOT-MET-2025-01", container: "CTN-001", status: "Verified", holdTime: "72h", holdExpiry: "2025-02-08 14:00", dispensedBy: "Operator_A", dispensedAt: "2025-02-01 08:30" },
  { batch: "BN-2025-001", material: "Povidone K30", code: "RM-002-B", sapCode: "100089", required: "25.00 kg", dispensed: "25.05 kg", arNo: "AR-2025-0461", lot: "LOT-PVP-2024-12", container: "CTN-002", status: "Verified", holdTime: "48h", holdExpiry: "2025-02-06 10:00", dispensedBy: "Operator_A", dispensedAt: "2025-02-01 09:15" },
  { batch: "BN-2025-001", material: "Microcrystalline Cellulose", code: "RM-003-C", sapCode: "100092", required: "150.00 kg", dispensed: "150.08 kg", arNo: "AR-2025-0458", lot: "LOT-MCC-2024-11", container: "CTN-003", status: "Verified", holdTime: "96h", holdExpiry: "2025-02-09 08:00", dispensedBy: "Operator_B", dispensedAt: "2025-02-01 10:00" },
  { batch: "BN-2025-001", material: "Magnesium Stearate", code: "RM-004-D", sapCode: "100101", required: "5.00 kg", dispensed: "5.02 kg", arNo: "AR-2025-0462", lot: "LOT-MGS-2025-01", container: "CTN-004", status: "Verified", holdTime: "24h", holdExpiry: "2025-02-05 12:00", dispensedBy: "Operator_A", dispensedAt: "2025-02-01 10:30" },
  { batch: "BN-2025-001", material: "Purified Water", code: "RM-005-W", sapCode: "100200", required: "70.00 L", dispensed: "70.00 L", arNo: "AR-2025-0460", lot: "INLINE", container: "PW-SYS", status: "Auto-captured", holdTime: "24h", holdExpiry: "2025-02-02 08:30", dispensedBy: "System", dispensedAt: "2025-02-01 08:30" },
  { batch: "BN-2025-001", material: "HPMC E5 (Coating)", code: "PM-001-H", sapCode: "200015", required: "12.50 kg", dispensed: "-", arNo: "-", lot: "-", container: "-", status: "Pending", holdTime: "-", holdExpiry: "-", dispensedBy: "-", dispensedAt: "-" },
];

const SAMPLING_DATA = [
  { id: "SMP-2025-001", batch: "BN-2025-001", stage: "Blending", type: "Blend Uniformity", qty: "10 x 5g", samplePoints: "Top/Middle/Bottom", sampledBy: "QC Officer", sampledAt: "2025-02-03 14:30", status: "Collected", trf: "TRF-2025-0234", limsRef: "LIMS-BU-2025-001" },
  { id: "SMP-2025-002", batch: "BN-2025-001", stage: "Compression", type: "Hardness/Friability/DT", qty: "20 tablets", samplePoints: "Start/Middle/End", sampledBy: "QC Officer", sampledAt: "2025-02-05 10:15", status: "Under Testing", trf: "TRF-2025-0238", limsRef: "LIMS-CT-2025-003" },
  { id: "SMP-2025-003", batch: "BN-2025-001", stage: "Compression", type: "Weight Variation", qty: "20 tablets", samplePoints: "Every 30 min", sampledBy: "IPC Inspector", sampledAt: "2025-02-05 11:00", status: "Passed", trf: "TRF-2025-0239", limsRef: "LIMS-WV-2025-002" },
  { id: "SMP-2025-004", batch: "BN-2025-002", stage: "Coating", type: "Appearance / Weight Gain", qty: "10 tablets", samplePoints: "Post-coating", sampledBy: "QC Officer", sampledAt: "2025-02-06 09:00", status: "Collected", trf: "TRF-2025-0241", limsRef: "LIMS-CT-2025-005" },
  { id: "SMP-2025-005", batch: "BN-2025-002", stage: "Packing", type: "AQL Inspection", qty: "125 units", samplePoints: "Per AQL Table", sampledBy: "QC Inspector", sampledAt: "-", status: "Pending", trf: "-", limsRef: "-" },
];

const IPC_DATA = [
  { id: "IPC-001", batch: "BN-2025-001", stage: "Granulation", check: "LOD (Loss on Drying)", limit: "1.5% - 2.5%", result: "1.8%", status: "Pass", equipment: "PR571", operator: "Operator_A", time: "2025-02-02 14:30", frequency: "End of drying" },
  { id: "IPC-002", batch: "BN-2025-001", stage: "Blending", check: "Blend Time", limit: "15 ± 2 min", result: "16 min", status: "Pass", equipment: "PR331", operator: "Operator_A", time: "2025-02-03 10:00", frequency: "Per batch" },
  { id: "IPC-003", batch: "BN-2025-001", stage: "Compression", check: "Individual Weight", limit: "500 ± 25 mg", result: "498 mg", status: "Pass", equipment: "PR716", operator: "Operator_B", time: "2025-02-05 09:00", frequency: "Every 30 min" },
  { id: "IPC-004", batch: "BN-2025-001", stage: "Compression", check: "Hardness", limit: "8 - 12 kP", result: "10.5 kP", status: "Pass", equipment: "PR716", operator: "Operator_B", time: "2025-02-05 09:30", frequency: "Every 30 min" },
  { id: "IPC-005", batch: "BN-2025-001", stage: "Compression", check: "Disintegration Time", limit: "NMT 15 min", result: "8 min", status: "Pass", equipment: "DT-001", operator: "QC Officer", time: "2025-02-05 10:00", frequency: "Every 2 hours" },
  { id: "IPC-006", batch: "BN-2025-001", stage: "Compression", check: "Friability", limit: "NMT 1.0%", result: "0.45%", status: "Pass", equipment: "FRB-001", operator: "QC Officer", time: "2025-02-05 10:15", frequency: "Every 2 hours" },
  { id: "IPC-007", batch: "BN-2025-002", stage: "Coating", check: "Weight Gain %", limit: "3.0% ± 0.5%", result: "3.6%", status: "Alert", equipment: "PR726", operator: "Operator_C", time: "2025-02-06 16:00", frequency: "End of coating" },
  { id: "IPC-008", batch: "BN-2025-002", stage: "Coating", check: "Pan Speed", limit: "6 ± 1 RPM", result: "6.5 RPM", status: "Pass", equipment: "PR726", operator: "System", time: "2025-02-06 14:00", frequency: "Continuous" },
];

const EXEC_STEPS = [
  { step: 1, name: "Line Clearance", sop: "SOP-MFG-001 v4.0", status: "Completed", signedBy: "Operator_A", verifiedBy: "Supervisor_B", time: "08:00", notes: "Area clear, previous product residue absent" },
  { step: 2, name: "Material Verification", sop: "SOP-MFG-002 v3.1", status: "Completed", signedBy: "Operator_A", verifiedBy: "QA_Reviewer", time: "08:30", notes: "All 5 materials verified against BOM" },
  { step: 3, name: "Sifting of API & Excipients", sop: "SOP-MFG-003 v2.0", status: "Completed", signedBy: "Operator_A", verifiedBy: "Supervisor_B", time: "09:15", notes: "Sieve #40 mesh, integrity check passed" },
  { step: 4, name: "Dry Mixing", sop: "SOP-MFG-004 v2.0", status: "Completed", signedBy: "Operator_A", verifiedBy: "Supervisor_B", time: "09:45", notes: "10 min @ 80 RPM in PR571" },
  { step: 5, name: "Granulation (Binder Addition)", sop: "SOP-MFG-005 v3.0", status: "Completed", signedBy: "Operator_A", verifiedBy: "Supervisor_B", time: "10:30", notes: "PVP solution added over 5 min, wet massing 3 min" },
  { step: 6, name: "Drying (FBD)", sop: "SOP-MFG-006 v2.1", status: "Completed", signedBy: "Operator_A", verifiedBy: "QA_Reviewer", time: "12:00", notes: "Inlet temp 60°C, LOD achieved: 1.8%" },
  { step: 7, name: "Sizing / Milling", sop: "SOP-MFG-007 v1.5", status: "Completed", signedBy: "Operator_A", verifiedBy: "Supervisor_B", time: "13:00", notes: "Screen size 1.0mm, speed 1500 RPM" },
  { step: 8, name: "Lubrication / Final Blending", sop: "SOP-MFG-008 v2.0", status: "Completed", signedBy: "Operator_A", verifiedBy: "Supervisor_B", time: "13:45", notes: "MgSt added, blended 5 min @ 12 RPM" },
  { step: 9, name: "Compression", sop: "SOP-MFG-009 v3.2", status: "In Progress", signedBy: "Operator_B", verifiedBy: "-", time: "14:00", notes: "Machine: PR716, Target: 500mg ± 5%, Speed: 45 RPM" },
  { step: 10, name: "IPC - Compression", sop: "SOP-QC-015 v2.0", status: "Pending", signedBy: "-", verifiedBy: "-", time: "-", notes: "Wt variation, hardness, friability, DT per schedule" },
  { step: 11, name: "Coating", sop: "SOP-MFG-010 v2.5", status: "Pending", signedBy: "-", verifiedBy: "-", time: "-", notes: "HPMC coating, 3% wt gain target" },
  { step: 12, name: "Final Inspection & Yield", sop: "SOP-MFG-012 v1.0", status: "Pending", signedBy: "-", verifiedBy: "-", time: "-", notes: "Final yield calculation and reconciliation" },
];

const STAGES = ["Dispensing","Granulation","Drying","Blending","Compression","Coating","Capsule Filling","Inspection","Packing","Complete"];

const DEVIATIONS = [
  { id: "DEV-2025-001", batch: "BN-2025-002", type: "Process", cat: "Minor", desc: "Compression force exceeded upper limit by 0.5 kN", status: "Open", by: "Operator A", date: "2025-02-04", stage: "Compression" },
  { id: "DEV-2025-002", batch: "BN-2024-199", type: "Equipment", cat: "Major", desc: "Coating pan temperature deviation +3°C from setpoint", status: "Under Investigation", by: "Supervisor B", date: "2025-01-18", stage: "Coating" },
  { id: "DEV-2025-003", batch: "BN-2024-199", type: "Material", cat: "Info", desc: "Raw material lot change during dispensing", status: "Closed", by: "QA Officer", date: "2025-01-16", stage: "Dispensing" },
  { id: "DEV-2024-045", batch: "BN-2024-185", type: "Process", cat: "Critical", desc: "Hold time exceeded for granulation intermediate", status: "Closed - CAPA", by: "Prod Head", date: "2024-12-10", stage: "Granulation" },
];

const AUDIT = [
  { id: "AUD-10245", ts: "2025-02-08 09:15:23", user: "Operator_A", action: "Batch Step Execution", detail: "Completed Step 8: Lubrication for BN-2025-001 [Old: In Progress → New: Completed]", module: "Batch", ip: "192.168.1.45" },
  { id: "AUD-10244", ts: "2025-02-08 09:10:05", user: "QA_Reviewer", action: "E-Signature (Approve)", detail: "Approved stage: Blending for BN-2025-004 | Reason: Stage review complete", module: "Signature", ip: "192.168.1.22" },
  { id: "AUD-10243", ts: "2025-02-08 08:55:12", user: "Admin_01", action: "User Create", detail: "Created user: New_Operator_C [Role: Operator, Dept: Production]", module: "Security", ip: "192.168.1.10" },
  { id: "AUD-10242", ts: "2025-02-08 08:30:00", user: "System", action: "Auto Data Capture", detail: "Balance BAL-03: Gross=8750.5g, Tare=0.0g, Net=8750.5g for BN-2025-001 Step 4", module: "Equipment", ip: "System" },
  { id: "AUD-10241", ts: "2025-02-08 08:15:33", user: "Supervisor_B", action: "Deviation Initiate", detail: "DEV-2025-001 for BN-2025-002 [Cat: Minor, Type: Process]", module: "Quality", ip: "192.168.1.33" },
  { id: "AUD-10240", ts: "2025-02-08 07:45:10", user: "Operator_A", action: "Login", detail: "Successful login via User ID + Password + Biometric", module: "Security", ip: "192.168.1.45" },
  { id: "AUD-10239", ts: "2025-02-07 22:30:00", user: "System", action: "Hold Time Alert", detail: "CHT approaching limit (3h 45m / 4h) for PR726 Coating Machine", module: "Equipment", ip: "System" },
  { id: "AUD-10238", ts: "2025-02-07 18:00:15", user: "QA_Head", action: "Template Approve", detail: "Approved TPL-MET-v3.2 [Old: Under Review → New: Approved] | CC: CC-2025-003", module: "Document", ip: "192.168.1.15" },
];

const INTEGRATIONS = [
  { name: "SAP ERP", ver: "ECC 6.0 EHP 7", supplier: "SAP", status: "Connected", sync: "2025-02-08 09:14:00", type: "Bi-directional", details: "BOM, Production Orders, Material Master, Batch Release" },
  { name: "Caliber LIMS", ver: "3.2.1 (E)", supplier: "Caliber", status: "Connected", sync: "2025-02-08 09:12:30", type: "Bi-directional", details: "COA, Stability, RM/Excipient/PM, TRF/Results" },
  { name: "Caliber DMS", ver: "2.2.0", supplier: "Caliber", status: "Connected", sync: "2025-02-08 09:10:00", type: "Read (Version-controlled)", details: "SOPs (current approved only), Master Templates, Formats" },
  { name: "Material Tracking (MTS)", ver: "2.0", supplier: "Micro Labs", status: "Connected", sync: "2025-02-08 09:05:15", type: "Bi-directional", details: "Dispensed materials, labels, returns, reconciliation" },
  { name: "Maestrotek IPQC", ver: "NA", supplier: "Maestrotek", status: "Degraded", sync: "2025-02-08 08:45:00", type: "Read", details: "In-process check data, IPC parameters" },
  { name: "Weighing Balances", ver: "-", supplier: "Multiple", status: "Connected", sync: "2025-02-08 09:14:55", type: "Data Capture", details: `${BALANCES.filter(b=>b.status==="Connected").length}/${BALANCES.length} connected, real-time tare/net/gross` },
  { name: "LDAP / AD", ver: "-", supplier: "Microsoft", status: "Connected", sync: "2025-02-08 09:00:00", type: "Authentication", details: "SSO, user provisioning, group sync" },
  { name: "Track & Trace", ver: "-", supplier: "External", status: "Not Configured", sync: "-", type: "Outbound", details: "Batch serialization reports (Phase 2)" },
];

const USERS = [
  { id: "USR-001", name: "A.V. Seuban Reddy", role: "QA Manager", dept: "QA", status: "Active", login: "2025-02-08 09:00" },
  { id: "USR-002", name: "Munusegan M.", role: "QA Reviewer", dept: "QA", status: "Active", login: "2025-02-08 08:30" },
  { id: "USR-003", name: "Rajeshwani K.", role: "Stores Head", dept: "Stores", status: "Active", login: "2025-02-07 17:00" },
  { id: "USR-004", name: "Operator A", role: "Production Operator", dept: "Production", status: "Active", login: "2025-02-08 07:45" },
  { id: "USR-005", name: "Supervisor B", role: "Production Supervisor", dept: "Production", status: "Active", login: "2025-02-08 08:00" },
  { id: "USR-006", name: "IT Admin", role: "System Administrator", dept: "IT", status: "Active", login: "2025-02-08 06:00" },
  { id: "USR-007", name: "Vinod V.K.", role: "QC Head", dept: "QC", status: "Active", login: "2025-02-07 16:30" },
  { id: "USR-008", name: "Former Employee", role: "Operator", dept: "Production", status: "Deactivated", login: "2024-11-15 09:00" },
];

const LOGBOOKS = [
  { id: "LOG-001", type: "Equipment Usage", equip: "PR571 - HSG", area: "Granulation Room A", entries: 145, last: "2025-02-08 09:10", status: "Active" },
  { id: "LOG-002", type: "Cleaning Log", equip: "PR726 - Coating", area: "Coating Room B", entries: 89, last: "2025-02-07 22:00", status: "Active" },
  { id: "LOG-003", type: "Area Logbook", equip: "-", area: "Compression Suite 1", entries: 312, last: "2025-02-08 08:45", status: "Active" },
  { id: "LOG-004", type: "Calibration Log", equip: "BAL-05", area: "Dispensing", entries: 56, last: "2025-02-08 07:00", status: "Active" },
  { id: "LOG-005", type: "Cleaning Checklist", equip: "PR331 - Blender", area: "Blending Room", entries: 78, last: "2025-02-07 18:30", status: "Completed" },
];

// ── Utility Components ──────────────────────────────────────
const Badge = ({ s, sz = "sm" }) => {
  const m = { Running: GR, Connected: GR, Active: GR, Released: GR, Closed: GR, Clean: GR, Completed: GR, Pass: GR, "Closed - CAPA": GR, Approved: GR, Collected: GR, Passed: GR, Qualified: GR, Idle: YL, "In Progress": BL, "Under Review": YL, "Under Testing": YL, "Under Investigation": YL, Partial: YL, Pending: YL, Due: YL, Open: RD, Degraded: RD, Maintenance: RD, Dirty: RD, Fail: RD, Alert: O, Deactivated: G400, "Not Configured": G400, Disconnected: RD, "Auto-captured": PU, Verified: GR };
  const c = m[s] || G400;
  return <span style={{ background: `${c}18`, color: c, padding: sz === "sm" ? "2px 10px" : "4px 14px", borderRadius: 20, fontSize: sz === "sm" ? 11 : 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />{s}</span>;
};

const Cd = ({ children, style = {}, onClick }) => <div onClick={onClick} style={{ background: "#fff", borderRadius: 12, border: `1px solid ${G200}`, padding: 20, cursor: onClick ? "pointer" : "default", ...style }}>{children}</div>;

const KPI = ({ label, value, sub, color = O, icon }) => <Cd style={{ display: "flex", alignItems: "center", gap: 16 }}><div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div><div><div style={{ fontSize: 24, fontWeight: 700, color: DK, lineHeight: 1.1 }}>{value}</div><div style={{ fontSize: 12, color: G500, marginTop: 2 }}>{label}</div>{sub && <div style={{ fontSize: 11, color, marginTop: 2, fontWeight: 500 }}>{sub}</div>}</div></Cd>;

const Bar = ({ v, h = 6, c = O }) => <div style={{ width: "100%", height: h, background: G200, borderRadius: h, overflow: "hidden" }}><div style={{ width: `${v}%`, height: "100%", background: c, borderRadius: h, transition: "width 0.6s" }} /></div>;

const Sec = ({ children, sub }) => <div style={{ marginBottom: 16 }}><h2 style={{ fontSize: 18, fontWeight: 700, color: DK, margin: 0 }}>{children}</h2>{sub && <p style={{ fontSize: 13, color: G500, margin: "4px 0 0" }}>{sub}</p>}</div>;

const Tbl = ({ cols, data, onRow }) => <div style={{ overflowX: "auto", border: `1px solid ${G200}`, borderRadius: 10 }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}><thead><tr style={{ background: G50 }}>{cols.map((c, i) => <th key={i} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: G700, borderBottom: `1px solid ${G200}`, whiteSpace: "nowrap", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>{c.l}</th>)}</tr></thead><tbody>{data.map((r, ri) => <tr key={ri} onClick={() => onRow?.(r)} style={{ borderBottom: `1px solid ${G100}`, cursor: onRow ? "pointer" : "default" }} onMouseEnter={e => { if (onRow) e.currentTarget.style.background = LB; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>{cols.map((c, ci) => <td key={ci} style={{ padding: "10px 14px", color: G700 }}>{c.r ? c.r(r) : r[c.k]}</td>)}</tr>)}</tbody></table></div>;

const CatBadge = ({ c }) => { const m = { Critical: RD, Major: O, Minor: YL, Info: BL }; const cl = m[c] || G500; return <span style={{ background: `${cl}18`, color: cl, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{c}</span>; };

const BarcodeLabel = ({ batch, container, material, weight, stage }) => (
  <div style={{ border: `2px solid ${DK}`, borderRadius: 8, padding: 12, width: 280, background: "#fff", fontFamily: "monospace" }}>
    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${G300}`, paddingBottom: 6, marginBottom: 6 }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: DK }}>MICRO LABS LTD - ML11</span>
      <span style={{ fontSize: 9, color: G500 }}>GMP Label</span>
    </div>
    <div style={{ display: "flex", gap: 10 }}>
      <div style={{ flex: 1, fontSize: 10 }}>
        <div><span style={{ color: G500 }}>Batch:</span> <b>{batch}</b></div>
        <div><span style={{ color: G500 }}>Material:</span> {material}</div>
        <div><span style={{ color: G500 }}>Container:</span> {container}</div>
        <div><span style={{ color: G500 }}>Net Wt:</span> <b>{weight}</b></div>
        <div><span style={{ color: G500 }}>Stage:</span> {stage}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <svg width="60" height="60" viewBox="0 0 60 60">
          {[0,1,2,3,4,5,6,7,8,9].map(r => [0,1,2,3,4,5,6,7,8,9].map(c => {
            const fill = ((r + c) % 3 === 0 || (r * c) % 7 < 3) ? DK : "#fff";
            return <rect key={`${r}-${c}`} x={c*6} y={r*6} width={6} height={6} fill={fill} />;
          }))}
          <rect x={0} y={0} width={18} height={18} fill={DK} rx={2} />
          <rect x={3} y={3} width={12} height={12} fill="#fff" rx={1} />
          <rect x={5} y={5} width={8} height={8} fill={DK} rx={1} />
          <rect x={42} y={0} width={18} height={18} fill={DK} rx={2} />
          <rect x={45} y={3} width={12} height={12} fill="#fff" rx={1} />
          <rect x={47} y={5} width={8} height={8} fill={DK} rx={1} />
          <rect x={0} y={42} width={18} height={18} fill={DK} rx={2} />
          <rect x={3} y={45} width={12} height={12} fill="#fff" rx={1} />
          <rect x={5} y={47} width={8} height={8} fill={DK} rx={1} />
        </svg>
        <span style={{ fontSize: 7, color: G500 }}>2D Code</span>
      </div>
    </div>
    <div style={{ borderTop: `1px solid ${G300}`, paddingTop: 4, marginTop: 6, display: "flex", justifyContent: "space-between", fontSize: 8, color: G400 }}>
      <span>Date: {new Date().toLocaleDateString("en-IN")}</span>
      <span>e-Sign: Operator_A</span>
    </div>
  </div>
);

// ── Tab Components ──────────────────────────────────────

// 1. DASHBOARD
const DashboardTab = () => {
  const ab = BATCHES.filter(b => b.status === "In Progress").length;
  const re = EQUIP.filter(e => e.status === "Running").length;
  const od = DEVIATIONS.filter(d => !d.status.includes("Closed")).length;
  const bc = BALANCES.filter(b => b.status === "Connected").length;
  return <div>
    <Sec sub="Real-time manufacturing overview for ML11 Veerasandra">Production Dashboard</Sec>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 24 }}>
      <KPI icon="⚡" label="Active Batches" value={ab} sub="2 in final stages" color={BL} />
      <KPI icon="🏭" label="Equipment Running" value={`${re}/${EQUIP.length}`} color={GR} />
      <KPI icon="⚖️" label="Balances Connected" value={`${bc}/${BALANCES.length}`} sub={BALANCES.filter(b=>b.dailyCheck==="Fail").length > 0 ? "1 daily check failed" : "All verified"} color={bc === BALANCES.length ? GR : YL} />
      <KPI icon="📊" label="Avg. Yield" value="98.4%" sub="+0.3% vs last month" color={GR} />
      <KPI icon="⚠️" label="Open Deviations" value={od} sub="1 critical pending" color={od > 0 ? RD : GR} />
      <KPI icon="🔬" label="IPC Checks Today" value={IPC_DATA.length} sub={`${IPC_DATA.filter(i=>i.status==="Alert").length} alerts`} color={IPC_DATA.filter(i=>i.status==="Alert").length > 0 ? O : GR} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 24 }}>
      <Cd>
        <div style={{ fontSize: 14, fontWeight: 600, color: DK, marginBottom: 14 }}>Active Batch Progress</div>
        {BATCHES.filter(b => b.status === "In Progress").map(b => <div key={b.id} style={{ marginBottom: 14 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 13, fontWeight: 500, color: G700 }}>{b.id} — {b.product}</span><span style={{ fontSize: 12, color: O, fontWeight: 600 }}>{b.progress}%</span></div><Bar v={b.progress} /><div style={{ fontSize: 11, color: G400, marginTop: 3 }}>Stage: {b.stage} | Template: {b.template} | Yield: {b.yield}</div></div>)}
      </Cd>
      <Cd>
        <div style={{ fontSize: 14, fontWeight: 600, color: DK, marginBottom: 14 }}>Stage Distribution</div>
        {STAGES.filter(s => s !== "Complete").map(s => { const c = BATCHES.filter(b => b.stage === s).length; return <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}><div style={{ width: 100, fontSize: 12, color: G500, textAlign: "right" }}>{s}</div><div style={{ flex: 1, height: 18, background: G100, borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${Math.max(c * 20, c > 0 ? 8 : 0)}%`, height: "100%", background: c > 0 ? O : "transparent", borderRadius: 4 }} /></div><div style={{ width: 24, fontSize: 13, fontWeight: 600, color: c > 0 ? O : G300 }}>{c}</div></div>; })}
      </Cd>
    </div>
  </div>;
};

// 2. MASTER TEMPLATES (NEW - PRD 5.1, TER-2.2.16-2.2.21)
const TemplatesTab = () => {
  const [sel, setSel] = useState(null);
  const t = TEMPLATES.find(x => x.id === sel);
  return <div>
    <Sec sub="Template/recipe management per PRD 5.1, TER-2.2.16-2.2.21 | Version control, approval workflow, change history">Master Data & Templates</Sec>
    {!sel ? <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        <Cd style={{ textAlign: "center", borderTop: `3px solid ${GR}` }}><div style={{ fontSize: 22, fontWeight: 700, color: GR }}>{TEMPLATES.filter(t=>t.status==="Approved").length}</div><div style={{ fontSize: 11, color: G500 }}>Approved</div></Cd>
        <Cd style={{ textAlign: "center", borderTop: `3px solid ${YL}` }}><div style={{ fontSize: 22, fontWeight: 700, color: YL }}>{TEMPLATES.filter(t=>t.status==="Under Review").length}</div><div style={{ fontSize: 11, color: G500 }}>Under Review</div></Cd>
        <Cd style={{ textAlign: "center", borderTop: `3px solid ${BL}` }}><div style={{ fontSize: 22, fontWeight: 700, color: BL }}>{TEMPLATES.length}</div><div style={{ fontSize: 11, color: G500 }}>Total Templates</div></Cd>
        <Cd style={{ textAlign: "center", borderTop: `3px solid ${PU}` }}><div style={{ fontSize: 22, fontWeight: 700, color: PU }}>{new Set(TEMPLATES.map(t=>t.product)).size}</div><div style={{ fontSize: 11, color: G500 }}>Products Covered</div></Cd>
      </div>
      <Tbl cols={[
        { l: "Template ID", r: r => <span style={{ fontWeight: 600, color: O, cursor: "pointer" }}>{r.id}</span> },
        { l: "Product", k: "product" },
        { l: "Type", k: "type" },
        { l: "Version", r: r => <span style={{ fontFamily: "monospace", fontWeight: 600 }}>v{r.version}</span> },
        { l: "Status", r: r => <Badge s={r.status} /> },
        { l: "Stages", k: "stages" },
        { l: "Change Control", r: r => <span style={{ fontFamily: "monospace", fontSize: 11 }}>{r.changeCtrl}</span> },
        { l: "Effective Date", k: "effectiveDate" },
      ]} data={TEMPLATES} onRow={r => setSel(r.id)} />
      <Cd style={{ marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: DK, marginBottom: 10 }}>Template Lifecycle Workflow (TER-2.2.18-2.2.20)</div>
        <div style={{ display: "flex", alignItems: "center", gap: 0, justifyContent: "center" }}>
          {["Draft", "Review", "Approved", "In Use", "Revision", "Obsoleted"].map((s, i) => <div key={s} style={{ display: "flex", alignItems: "center" }}><div style={{ padding: "8px 16px", borderRadius: 20, background: i < 4 ? `${O}15` : G100, color: i < 4 ? O : G500, fontSize: 12, fontWeight: 600, border: `1px solid ${i < 4 ? O : G300}40` }}>{s}</div>{i < 5 && <div style={{ width: 24, height: 2, background: G300 }} />}</div>)}
        </div>
      </Cd>
    </> : <div>
      <button onClick={() => setSel(null)} style={{ background: "none", border: "none", color: O, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 16, fontSize: 13 }}>← Back to Templates</button>
      <Cd style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div><div style={{ fontSize: 20, fontWeight: 700, color: DK }}>{t.id}</div><div style={{ fontSize: 14, color: G500 }}>{t.product} | {t.type} | v{t.version}</div></div>
          <Badge s={t.status} sz="md" />
        </div>
      </Cd>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
        <Cd><div style={{ fontSize: 12, fontWeight: 600, color: DK, marginBottom: 8 }}>Version History (TER-2.2.20)</div>
          <div style={{ fontSize: 11 }}>{[{ v: t.version, s: t.status, d: t.effectiveDate }, { v: t.prevVersion || "1.0", s: "Obsoleted", d: "Previous" }].map((h, i) => <div key={i} style={{ padding: "6px 0", borderBottom: `1px solid ${G100}`, display: "flex", justifyContent: "space-between" }}><span style={{ fontFamily: "monospace", fontWeight: 600 }}>v{h.v}</span><Badge s={h.s} /><span style={{ color: G400 }}>{h.d}</span></div>)}</div>
        </Cd>
        <Cd><div style={{ fontSize: 12, fontWeight: 600, color: DK, marginBottom: 8 }}>Change Control</div>
          <div style={{ fontSize: 11, color: G700 }}><div>CC#: <b>{t.changeCtrl}</b></div><div style={{ marginTop: 4 }}>Reason: {t.revisionReason}</div><div style={{ marginTop: 4 }}>Approved by: {t.approvedBy}</div><div style={{ marginTop: 4 }}>Stages: {t.stages} steps</div></div>
        </Cd>
        <Cd><div style={{ fontSize: 12, fontWeight: 600, color: DK, marginBottom: 8 }}>Linked Records</div>
          <div style={{ fontSize: 11 }}>{[`Batches using this template: ${BATCHES.filter(b=>b.template===t.id).length}`, "Equipment qualification: Linked", "BOM from SAP: Synced", "SOPs from DMS: Current version"].map((l, i) => <div key={i} style={{ padding: "4px 0", color: G700 }}>✓ {l}</div>)}</div>
        </Cd>
      </div>
    </div>}
  </div>;
};

// 3. BATCH EXECUTION (ENHANCED - PRD 5.2)
const BatchTab = () => {
  const [sel, setSel] = useState(null);
  const b = BATCHES.find(x => x.id === sel);
  const ci = b ? STAGES.indexOf(b.stage) : -1;
  return <div>
    <Sec sub="Electronic batch execution per PRD 5.2 | Guided workflow, maker-checker, e-sign, SOP links">Batch Execution (eBMR / eBPR)</Sec>
    {!sel ? <Tbl cols={[
      { l: "Batch", r: r => <span style={{ fontWeight: 600, color: O, cursor: "pointer" }}>{r.id}</span> },
      { l: "Product", k: "product" },
      { l: "Template", r: r => <span style={{ fontSize: 11, fontFamily: "monospace" }}>{r.template}</span> },
      { l: "Stage", k: "stage" },
      { l: "Progress", r: r => <div style={{ width: 100 }}><Bar v={r.progress} /></div> },
      { l: "Yield", k: "yield" },
      { l: "Status", r: r => <Badge s={r.status} /> },
      { l: "Devs", r: r => <span style={{ color: r.devs > 0 ? RD : GR, fontWeight: 600 }}>{r.devs}</span> },
    ]} data={BATCHES} onRow={r => setSel(r.id)} /> : <div>
      <button onClick={() => setSel(null)} style={{ background: "none", border: "none", color: O, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 16, fontSize: 13 }}>← Back to Batch List</button>
      <Cd style={{ marginBottom: 14 }}><div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 20, fontWeight: 700, color: DK }}>{b.id}</div><div style={{ fontSize: 14, color: G500 }}>{b.product} | Size: {b.size} | Template: {b.template}</div></div><Badge s={b.status} sz="md" /></div></Cd>
      <Cd style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: DK, marginBottom: 14 }}>Stage Progress (BFR-2.1.10)</div>
        <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", padding: "8px 0" }}>
          {STAGES.map((s, i) => { const done = i < ci || b.stage === "Complete"; const cur = i === ci; return <div key={s} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}><div style={{ textAlign: "center" }}><div style={{ width: 34, height: 34, borderRadius: "50%", background: done ? GR : cur ? O : G200, color: (done || cur) ? "#fff" : G400, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, margin: "0 auto", boxShadow: cur ? `0 0 0 4px ${O}20` : "none" }}>{done ? "✓" : i + 1}</div><div style={{ fontSize: 9, color: cur ? O : done ? GR : G400, marginTop: 3, fontWeight: cur ? 700 : 400, maxWidth: 60, lineHeight: 1.2 }}>{s}</div></div>{i < STAGES.length - 1 && <div style={{ width: 24, height: 2, background: done ? GR : G200, margin: "0 1px", marginBottom: 18, flexShrink: 0 }} />}</div>; })}
        </div>
      </Cd>
      <Cd style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: DK, marginBottom: 10 }}>Step-by-Step Execution Log (PRD 5.2: Guided workflow)</div>
        <Tbl cols={[
          { l: "#", r: r => <span style={{ fontWeight: 600, color: DK }}>{r.step}</span> },
          { l: "Step", r: r => <span style={{ fontWeight: 500 }}>{r.name}</span> },
          { l: "SOP Reference", r: r => <span style={{ color: BL, fontSize: 11, textDecoration: "underline", cursor: "pointer" }}>{r.sop}</span> },
          { l: "Status", r: r => <Badge s={r.status} /> },
          { l: "Executed By", r: r => r.signedBy || "-" },
          { l: "Verified By (Checker)", r: r => r.verifiedBy || <span style={{ color: YL, fontWeight: 500 }}>Awaiting</span> },
          { l: "Time", r: r => r.time || "-" },
        ]} data={EXEC_STEPS} />
      </Cd>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <Cd><div style={{ fontSize: 13, fontWeight: 600, color: DK, marginBottom: 8 }}>Yield Reconciliation (TER-2.2.24)</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: parseFloat(b.yield) >= 98 ? GR : O }}>{b.yield || "Pending"}</div>
          <div style={{ fontSize: 11, color: G400 }}>Acceptance: 95.0% - 101.0%</div>
          <div style={{ marginTop: 8, padding: "6px 10px", background: G50, borderRadius: 6, fontSize: 11, color: G500 }}>Theoretical: {b.size} | Formula per {b.template}</div>
        </Cd>
        <Cd><div style={{ fontSize: 13, fontWeight: 600, color: DK, marginBottom: 8 }}>Hold Time Tracking (BFR-2.1.13)</div>
          {[{ l: "CHT (Granulation)", v: "3h 20m", lim: "4h", ok: true }, { l: "DHT (Drying)", v: "18h", lim: "48h", ok: true }, { l: "Material Hold", v: "45h", lim: "72h", ok: true }].map((h, i) => <div key={i} style={{ padding: "5px 8px", background: h.ok ? `${GR}08` : `${RD}08`, borderRadius: 6, border: `1px solid ${h.ok ? GR : RD}30`, marginBottom: 4 }}><div style={{ fontSize: 10, color: G500 }}>{h.l}</div><div style={{ fontSize: 13, fontWeight: 600, color: h.ok ? GR : RD }}>{h.v} <span style={{ fontSize: 10, fontWeight: 400, color: G400 }}>/ {h.lim}</span></div></div>)}
        </Cd>
        <Cd><div style={{ fontSize: 13, fontWeight: 600, color: DK, marginBottom: 8 }}>Shelf Life (TER-2.2.22)</div>
          <div style={{ fontSize: 11, color: G700 }}>{[{ l: "Product Shelf Life", v: "24 months" }, { l: "Mfg Date (auto)", v: b.start }, { l: "Expiry Date (calc)", v: "2027-02-01" }, { l: "Date Format", v: "MM/YYYY per site" }, { l: "First Process Step", v: "Dispensing" }].map((r, i) => <div key={i} style={{ padding: "3px 0", borderBottom: `1px solid ${G100}`, display: "flex", justifyContent: "space-between" }}><span style={{ color: G500 }}>{r.l}:</span> <b>{r.v}</b></div>)}</div>
        </Cd>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
        <Cd>
          <div style={{ fontSize: 13, fontWeight: 600, color: DK, marginBottom: 8 }}>Batch Flags (TER-2.2.33)</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[{ flag: "Validation Batch", active: b.id === "BN-2025-004", c: PU }, { flag: "Stability Sample", active: true, c: BL }, { flag: "Submission Batch", active: false, c: YL }, { flag: "Export Market", active: b.id === "BN-2025-005", c: GR }].map((f, i) => <div key={i} style={{ padding: "6px 12px", borderRadius: 20, background: f.active ? `${f.c}15` : G50, border: `1px solid ${f.active ? f.c : G200}`, color: f.active ? f.c : G400, fontSize: 11, fontWeight: f.active ? 600 : 400 }}>{f.active ? "●" : "○"} {f.flag}</div>)}
          </div>
          <div style={{ marginTop: 8, fontSize: 10, color: G400 }}>Flags govern sampling plan, documentation requirements, and release workflow</div>
        </Cd>
        <Cd style={{ borderLeft: `4px solid ${RD}` }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: DK, marginBottom: 8 }}>Exception Overrides (PRD 9.2)</div>
          <div style={{ fontSize: 11, color: G500, marginBottom: 6 }}>All overrides logged with reason + e-sign + audit trail</div>
          {[{ step: "Step 6: Drying (FBD)", reason: "LOD borderline 2.48% (limit 2.5%), QA assessed acceptable per CPV trend", by: "QA_Reviewer", time: "12:05" }].map((o, i) => <div key={i} style={{ padding: "8px 10px", background: `${YL}08`, borderRadius: 6, border: `1px solid ${YL}30`, fontSize: 11 }}><div><b>Override at:</b> {o.step}</div><div><b>Reason:</b> {o.reason}</div><div style={{ color: G400 }}>Authorized by: {o.by} | {o.time} | Audit: AUD-10246</div></div>)}
        </Cd>
      </div>
    </div>}
  </div>;
};

// 4. MATERIALS (NEW - PRD 5.3, TER-2.2.8-2.2.13)
const MaterialsTab = () => (
  <div>
    <Sec sub="Material dispensing, BOM validation, consumption & reconciliation per PRD 5.3, TER-2.2.8-2.2.13">Materials Management</Sec>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 16 }}>
      {[
        { l: "Materials Dispensed", v: BOM_DATA.filter(b=>b.status!=="Pending").length, c: GR },
        { l: "Pending Dispensing", v: BOM_DATA.filter(b=>b.status==="Pending").length, c: YL },
        { l: "BOM Items (BN-2025-001)", v: BOM_DATA.length, c: BL },
        { l: "Hold Time Alerts", v: 0, c: GR },
        { l: "Material Returns", v: 0, c: G500 },
      ].map((k, i) => <Cd key={i} style={{ textAlign: "center", borderTop: `3px solid ${k.c}` }}><div style={{ fontSize: 20, fontWeight: 700, color: k.c }}>{k.v}</div><div style={{ fontSize: 10, color: G500 }}>{k.l}</div></Cd>)}
    </div>
    <Cd style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: DK, marginBottom: 4 }}>BOM for BN-2025-001: Metformin HCl 500mg (Fetched from SAP — TER-2.2.17)</div>
      <div style={{ fontSize: 11, color: G500, marginBottom: 10 }}>MTS Integration: Auto-fetched material list per TER-2.2.8 | BOM validated against SAP per TER-2.2.11</div>
      <Tbl cols={[
        { l: "Material", r: r => <div><div style={{ fontWeight: 500 }}>{r.material}</div><div style={{ fontSize: 10, color: G400 }}>SAP: {r.sapCode} | Code: {r.code}</div></div> },
        { l: "Required", r: r => <b>{r.required}</b> },
        { l: "Dispensed", r: r => <span style={{ color: r.dispensed !== "-" ? GR : G400 }}>{r.dispensed}</span> },
        { l: "AR No.", r: r => <span style={{ fontFamily: "monospace", fontSize: 11 }}>{r.arNo}</span> },
        { l: "Lot / Batch", r: r => <span style={{ fontSize: 11 }}>{r.lot}</span> },
        { l: "Container", k: "container" },
        { l: "Hold Expiry", r: r => { const exp = r.holdExpiry; if (exp === "-") return "-"; const isNear = new Date(exp) < new Date("2025-02-09"); return <span style={{ color: isNear ? YL : GR, fontWeight: 500, fontSize: 11 }}>{exp}</span>; }},
        { l: "Status", r: r => <Badge s={r.status} /> },
      ]} data={BOM_DATA} />
    </Cd>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <Cd>
        <div style={{ fontSize: 13, fontWeight: 600, color: DK, marginBottom: 8 }}>Material Verification Flow (TER-2.2.9, TER-2.2.66)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {["1. Scan container barcode (2D/RFID)", "2. System validates against BOM from SAP", "3. Cross-batch material prevention check", "4. Verify AR No., Lot, Expiry from MTS", "5. Capture dispensed weight from connected balance", "6. Auto-calculate tare/net/gross (TER-2.2.61)", "7. E-signature by dispenser + verifier", "8. Generate dispensing label with 2D barcode"].map((s, i) => <div key={i} style={{ padding: "6px 10px", background: i < 6 ? `${GR}08` : G50, borderRadius: 6, fontSize: 11, color: G700, display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: i < 6 ? GR : O, fontWeight: 700 }}>{i < 6 ? "✓" : "○"}</span>{s}</div>)}
        </div>
      </Cd>
      <Cd>
        <div style={{ fontSize: 13, fontWeight: 600, color: DK, marginBottom: 8 }}>Material Hold Time Tracking (TER-2.2.13)</div>
        <div style={{ fontSize: 11, marginBottom: 10, color: G500 }}>Auto-calculated from dispensing timestamp; blocks use if exceeded without QA approval</div>
        {BOM_DATA.filter(b => b.holdTime !== "-" && b.dispensed !== "-").map((m, i) => <div key={i} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${GR}30`, background: `${GR}05`, marginBottom: 6 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 11, fontWeight: 500 }}>{m.material}</span><span style={{ fontSize: 11, color: GR }}>{m.holdTime} limit</span></div><div style={{ fontSize: 10, color: G400 }}>Dispensed: {m.dispensedAt} | Expires: {m.holdExpiry}</div></div>)}
      </Cd>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 14 }}>
      <Cd>
        <div style={{ fontSize: 13, fontWeight: 600, color: DK, marginBottom: 8 }}>Consumption & Reconciliation (PRD 5.3)</div>
        {[{ l: "Total Issued", v: "500.27 kg" }, { l: "Consumed (in-process)", v: "487.65 kg" }, { l: "Samples Drawn", v: "0.35 kg" }, { l: "Scrap / Reject", v: "1.82 kg" }, { l: "Returns to Store", v: "10.45 kg" }].map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${G100}`, fontSize: 12 }}><span style={{ color: G500 }}>{r.l}</span><b style={{ color: G700 }}>{r.v}</b></div>)}
        <div style={{ marginTop: 8, padding: "8px 10px", background: `${GR}08`, borderRadius: 6, border: `1px solid ${GR}30` }}><div style={{ fontSize: 11, color: GR, fontWeight: 600 }}>Reconciliation: 99.4% (Tolerance: 95-101%)</div><div style={{ fontSize: 10, color: G400 }}>Auto-calculated; deviation enforced when OOL</div></div>
      </Cd>
      <Cd>
        <div style={{ fontSize: 13, fontWeight: 600, color: DK, marginBottom: 8 }}>Quarantine Issuance (TER-2.2.41)</div>
        <div style={{ fontSize: 11, color: G500, marginBottom: 8 }}>Issuance of blend/tablets/capsules from quarantine through MES with QA approval</div>
        {[{ mat: "Metformin Blend (Lubricated)", qty: "490 kg", rack: "QR-A-03", status: "In Quarantine", batch: "BN-2025-001" }, { mat: "Omeprazole Coated Tabs", qty: "342 kg", rack: "QR-B-01", status: "Released", batch: "BN-2024-198" }].map((q, i) => <div key={i} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${i === 0 ? YL : GR}30`, background: `${i === 0 ? YL : GR}05`, marginBottom: 6 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 11, fontWeight: 500 }}>{q.mat}</span><Badge s={q.status} /></div><div style={{ fontSize: 10, color: G400 }}>Batch: {q.batch} | Rack: {q.rack} | Qty: {q.qty}</div></div>)}
      </Cd>
      <Cd>
        <div style={{ fontSize: 13, fontWeight: 600, color: DK, marginBottom: 8 }}>Transfer Notes (TER-2.2.29-30)</div>
        {[{ type: "SFG Transfer (TER-2.2.29)", doc: "SFG-BN2025001-COMP", from: "Compression Suite", to: "Coating Room", qty: "487 kg", status: "Generated" }, { type: "FG Transfer (TER-2.2.30)", doc: "FG-BN2024198-PACK", from: "Packing Line", to: "FG Store", qty: "342 kg", status: "SAP Confirmed" }].map((t, i) => <div key={i} style={{ padding: "8px 10px", borderRadius: 6, background: G50, border: `1px solid ${G200}`, marginBottom: 6 }}><div style={{ fontSize: 11, fontWeight: 600, color: DK }}>{t.type}</div><div style={{ fontSize: 10, color: G500 }}>Doc: {t.doc} | {t.from} → {t.to} | {t.qty}</div><Badge s={t.status} /></div>)}
        <div style={{ fontSize: 10, color: G400, marginTop: 6 }}>FG traceability: inward/outward from store tracked via SAP integration</div>
      </Cd>
    </div>
  </div>
);

// 5. EQUIPMENT (ENHANCED - calibration workflow, balances)
const EquipmentTab = () => {
  const [view, setView] = useState("equipment");
  return <div>
    <Sec sub="Equipment + instrument + balance management per PRD 5.4, TER-2.2.1-2.2.7, TER-2.2.42-2.2.56">Equipment & Instruments</Sec>
    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      {[{ k: "equipment", l: "Equipment (Annexure-I)" }, { k: "balances", l: "Balances (TER-2.2.1-2.2.7)" }, { k: "calibration", l: "Calibration Workflow" }].map(t => <button key={t.k} onClick={() => setView(t.k)} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${view === t.k ? O : G300}`, background: view === t.k ? `${O}10` : "#fff", color: view === t.k ? O : G500, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>{t.l}</button>)}
    </div>
    {view === "equipment" && <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        {[{ l: "Total", v: EQUIP.length, i: "🔧" }, { l: "Running", v: EQUIP.filter(e=>e.status==="Running").length, i: "✅" }, { l: "Calib Due (7d)", v: 3, i: "📅" }, { l: "Needs Cleaning", v: EQUIP.filter(e=>e.clean==="Dirty").length, i: "🧹" }].map((k, i) => <Cd key={i} style={{ textAlign: "center", padding: 14 }}><div style={{ fontSize: 20 }}>{k.i}</div><div style={{ fontSize: 22, fontWeight: 700, color: DK }}>{k.v}</div><div style={{ fontSize: 11, color: G500 }}>{k.l}</div></Cd>)}
      </div>
      <Tbl cols={[
        { l: "Code", r: r => <span style={{ fontWeight: 600, fontFamily: "monospace" }}>{r.id}</span> },
        { l: "Equipment", k: "name" },
        { l: "Make", k: "make", r: r => <span style={{ fontSize: 12 }}>{r.make}</span> },
        { l: "Area", k: "area" },
        { l: "Status", r: r => <Badge s={r.status} /> },
        { l: "Calib Due", r: r => <span style={{ color: new Date(r.calibDue) < new Date("2025-03-01") ? RD : G700, fontWeight: new Date(r.calibDue) < new Date("2025-03-01") ? 600 : 400 }}>{r.calibDue}</span> },
        { l: "PPM Due", k: "ppmDue" },
        { l: "Qualification", r: r => <Badge s={r.qualStatus} /> },
        { l: "Clean", r: r => <Badge s={r.clean} /> },
        { l: "CHT/DHT", r: r => <span style={{ fontSize: 11 }}>{r.cht}/{r.dht}</span> },
      ]} data={EQUIP} />
    </>}
    {view === "balances" && <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        {[{ l: "Total Balances", v: BALANCES.length, c: BL }, { l: "Connected", v: BALANCES.filter(b=>b.status==="Connected").length, c: GR }, { l: "Daily Check Passed", v: BALANCES.filter(b=>b.dailyCheck==="Pass").length, c: GR }, { l: "Failed / Pending", v: BALANCES.filter(b=>b.dailyCheck!=="Pass").length, c: RD }].map((k, i) => <Cd key={i} style={{ textAlign: "center", borderTop: `3px solid ${k.c}` }}><div style={{ fontSize: 22, fontWeight: 700, color: k.c }}>{k.v}</div><div style={{ fontSize: 10, color: G500 }}>{k.l}</div></Cd>)}
      </div>
      <Tbl cols={[
        { l: "Balance ID", r: r => <span style={{ fontWeight: 600, fontFamily: "monospace" }}>{r.id}</span> },
        { l: "Model", k: "name" },
        { l: "Location", k: "location" },
        { l: "Capacity / LC", r: r => <span style={{ fontSize: 11 }}>{r.capacity} / {r.lc}</span> },
        { l: "Connection", r: r => <Badge s={r.status} /> },
        { l: "Last Calibration", k: "lastCalib" },
        { l: "Next Calibration", r: r => <span style={{ color: new Date(r.nextCalib) < new Date("2025-02-28") ? RD : G700 }}>{r.nextCalib}</span> },
        { l: "Daily Check", r: r => <Badge s={r.dailyCheck} /> },
        { l: "Check Time", k: "checkTime" },
        { l: "Last Reading", r: r => <span style={{ fontFamily: "monospace", fontSize: 11 }}>{r.lastWeight}</span> },
      ]} data={BALANCES} />
      <div style={{ marginTop: 10, padding: 10, background: `${RD}08`, borderRadius: 8, border: `1px solid ${RD}30`, fontSize: 12, color: RD }}>
        ⚠ BAL-04: Daily verification FAILED — Balance BLOCKED from use until recalibrated and QA approved (TER-2.2.5, TER-2.2.6). BAL-05: Disconnected — Cannot capture data (TER-2.2.44).
      </div>
    </>}
    {view === "calibration" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <Cd>
        <div style={{ fontSize: 14, fontWeight: 600, color: DK, marginBottom: 10 }}>Calibration Workflow (TER-2.2.4)</div>
        {["1. System creates calibration recipe per site requirement", "2. Notifies user when calibration is due (TER-2.2.5)", "3. User performs daily check/verification (TER-2.2.3)", "4. Data entered manually or auto-fetched from balance", "5. If FAIL: Block instrument (TER-2.2.6), notify QA", "6. Trigger recalibration with QA justification & approval", "7. On PASS: Update calibration record, set next due date", "8. No limit on number of connected balances (TER-2.2.7)"].map((s, i) => <div key={i} style={{ padding: "8px 10px", background: G50, borderRadius: 6, fontSize: 12, color: G700, marginBottom: 4, borderLeft: `3px solid ${i === 4 || i === 5 ? RD : O}` }}>{s}</div>)}
      </Cd>
      <Cd>
        <div style={{ fontSize: 14, fontWeight: 600, color: DK, marginBottom: 10 }}>Upcoming Calibrations (Next 30 Days)</div>
        {[...EQUIP.filter(e => new Date(e.calibDue) < new Date("2025-03-10")), ...BALANCES.filter(b => new Date(b.nextCalib) < new Date("2025-03-10"))].map((item, i) => <div key={i} style={{ padding: "8px 10px", borderRadius: 6, border: `1px solid ${YL}30`, background: `${YL}05`, marginBottom: 6 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 500, fontSize: 12 }}>{item.id} — {item.name}</span><span style={{ fontSize: 11, color: RD, fontWeight: 600 }}>{item.calibDue || item.nextCalib}</span></div></div>)}
      </Cd>
    </div>}
  </div>;
};

// 6. IPC & CONTROLS (NEW - PRD 5.5, TER-2.2.63-2.2.64)
const IPCTab = () => (
  <div>
    <Sec sub="In-process checks & process controls per PRD 5.5, TER-2.2.57, TER-2.2.63-2.2.64">IPC & Process Controls</Sec>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
      {[{ l: "Total Checks", v: IPC_DATA.length, c: BL }, { l: "Passed", v: IPC_DATA.filter(i=>i.status==="Pass").length, c: GR }, { l: "Alerts (OOL)", v: IPC_DATA.filter(i=>i.status==="Alert").length, c: O }, { l: "Failed", v: IPC_DATA.filter(i=>i.status==="Fail").length, c: RD }].map((k, i) => <Cd key={i} style={{ textAlign: "center", borderTop: `3px solid ${k.c}` }}><div style={{ fontSize: 22, fontWeight: 700, color: k.c }}>{k.v}</div><div style={{ fontSize: 10, color: G500 }}>{k.l}</div></Cd>)}
    </div>
    <Tbl cols={[
      { l: "IPC ID", r: r => <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{r.id}</span> },
      { l: "Batch", k: "batch" },
      { l: "Stage", k: "stage" },
      { l: "Check Parameter", r: r => <span style={{ fontWeight: 500 }}>{r.check}</span> },
      { l: "Acceptance Limit", r: r => <span style={{ fontSize: 11, fontFamily: "monospace" }}>{r.limit}</span> },
      { l: "Result", r: r => <span style={{ fontWeight: 600, color: r.status === "Pass" ? GR : r.status === "Alert" ? O : RD }}>{r.result}</span> },
      { l: "Status", r: r => <Badge s={r.status} /> },
      { l: "Equipment", k: "equipment" },
      { l: "Frequency", k: "frequency" },
      { l: "Time", r: r => <span style={{ fontSize: 11, fontFamily: "monospace" }}>{r.time}</span> },
    ]} data={IPC_DATA} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
      <Cd>
        <div style={{ fontSize: 13, fontWeight: 600, color: DK, marginBottom: 8 }}>Process Control Rules (PRD 5.5)</div>
        {[
          { rule: "If IPC result outside acceptance limit", action: "Auto-trigger QA notification (TER-2.2.64)", icon: "🔴" },
          { rule: "If critical parameter fails", action: '"Do not proceed" block until QA override', icon: "🚫" },
          { rule: "Line clearance check incomplete", action: "Stage blocked; deviation auto-initiated (TER-2.2.57)", icon: "⛔" },
          { rule: "Periodic check overdue", action: "System prompts operator; notification to supervisor", icon: "⏰" },
          { rule: "QA override provided", action: "Logged with reason + e-signature in audit trail", icon: "📝" },
        ].map((r, i) => <div key={i} style={{ padding: "8px 10px", background: G50, borderRadius: 6, marginBottom: 6, fontSize: 11 }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span>{r.icon}</span><b style={{ color: G700 }}>{r.rule}</b></div><div style={{ color: G500, marginTop: 2, marginLeft: 22 }}>→ {r.action}</div></div>)}
      </Cd>
      <Cd style={{ borderLeft: `4px solid ${O}` }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: O, marginBottom: 8 }}>⚠ Active Alert: IPC-007</div>
        <div style={{ fontSize: 12, color: G700, lineHeight: 1.6 }}>
          <b>Batch:</b> BN-2025-002 | <b>Stage:</b> Coating<br/>
          <b>Check:</b> Weight Gain % | <b>Result:</b> 3.6% (Limit: 3.0% ± 0.5%)<br/>
          <b>Action Required:</b> QA review and disposition. Processing blocked at current step until QA approval or deviation initiated.<br/>
          <b>Notification sent to:</b> QA_Reviewer, Production Supervisor
        </div>
      </Cd>
    </div>
  </div>
);

// 7. SAMPLING & LABELS (NEW - PRD 5.6, TER-2.2.65-2.2.74)
const SamplingTab = () => (
  <div>
    <Sec sub="Sampling plan, e-TRF, label generation per PRD 5.6, TER-2.2.65-2.2.74">Sampling & Labels</Sec>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
      {[{ l: "Samples Collected", v: SAMPLING_DATA.filter(s=>s.status==="Collected"||s.status==="Passed"||s.status==="Under Testing").length, c: GR }, { l: "Pending Collection", v: SAMPLING_DATA.filter(s=>s.status==="Pending").length, c: YL }, { l: "Under Testing", v: SAMPLING_DATA.filter(s=>s.status==="Under Testing").length, c: BL }, { l: "TRFs Generated", v: SAMPLING_DATA.filter(s=>s.trf!=="-").length, c: PU }].map((k, i) => <Cd key={i} style={{ textAlign: "center", borderTop: `3px solid ${k.c}` }}><div style={{ fontSize: 22, fontWeight: 700, color: k.c }}>{k.v}</div><div style={{ fontSize: 10, color: G500 }}>{k.l}</div></Cd>)}
    </div>
    <Tbl cols={[
      { l: "Sample ID", r: r => <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{r.id}</span> },
      { l: "Batch", k: "batch" },
      { l: "Stage", k: "stage" },
      { l: "Test Type", r: r => <span style={{ fontWeight: 500 }}>{r.type}</span> },
      { l: "Qty / Points", r: r => <span style={{ fontSize: 11 }}>{r.qty} | {r.samplePoints}</span> },
      { l: "Status", r: r => <Badge s={r.status} /> },
      { l: "e-TRF", r: r => r.trf !== "-" ? <span style={{ color: PU, fontFamily: "monospace", fontSize: 11 }}>{r.trf}</span> : <span style={{ color: G400 }}>-</span> },
      { l: "LIMS Ref", r: r => r.limsRef !== "-" ? <span style={{ color: BL, fontSize: 11 }}>{r.limsRef}</span> : "-" },
    ]} data={SAMPLING_DATA} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
      <Cd>
        <div style={{ fontSize: 14, fontWeight: 600, color: DK, marginBottom: 10 }}>Label Generation Preview (TER-2.2.65-2.2.67)</div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <BarcodeLabel batch="BN-2025-001" container="CTN-001" material="Metformin HCl API" weight="250.12 kg" stage="Dispensing" />
          <BarcodeLabel batch="BN-2025-001" container="IPC-BU-01" material="Blend Sample" weight="50 g" stage="Blending" />
        </div>
      </Cd>
      <Cd>
        <div style={{ fontSize: 14, fontWeight: 600, color: DK, marginBottom: 10 }}>Sampling Plan Config (TER-2.2.68-2.2.71)</div>
        {[
          "TER-2.2.68: Create sampling plan per commercial/validation batch",
          "TER-2.2.69: Flag validation study challenges per protocol",
          "TER-2.2.70: Auto-calculate sampled qty for reconciliation",
          "TER-2.2.71: Recipe per process order / stability protocol / site frequency",
          "TER-2.2.72: Generate sample labels + e-TRF per sampling plan",
          "TER-2.2.73: e-TRF with batch/sample details and 2D barcode",
          "TER-2.2.74: Miscellaneous TRF for validation samples",
          "TER-2.2.28: AQL for tablets/capsules per site procedure",
        ].map((f, i) => <div key={i} style={{ padding: "5px 8px", background: G50, borderRadius: 6, fontSize: 11, color: G600, marginBottom: 4, display: "flex", gap: 6 }}><span style={{ color: GR, fontWeight: 700, flexShrink: 0 }}>✓</span>{f}</div>)}
      </Cd>
    </div>
  </div>
);

// 8. DEVIATIONS
const DeviationTab = () => (
  <div>
    <Sec sub="Deviation/discrepancy management per PRD 5.7, TER-2.2.14-2.2.15, TER-2.2.77-2.2.81">Deviations & Discrepancies</Sec>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
      {[{ l: "Open", v: DEVIATIONS.filter(d=>d.status==="Open").length, c: RD }, { l: "Under Investigation", v: DEVIATIONS.filter(d=>d.status==="Under Investigation").length, c: YL }, { l: "Closed", v: DEVIATIONS.filter(d=>d.status.includes("Closed")).length, c: GR }, { l: "Total YTD", v: DEVIATIONS.length, c: G500 }].map((k, i) => <Cd key={i} style={{ textAlign: "center", borderTop: `3px solid ${k.c}` }}><div style={{ fontSize: 24, fontWeight: 700, color: k.c }}>{k.v}</div><div style={{ fontSize: 10, color: G500 }}>{k.l}</div></Cd>)}
    </div>
    <Tbl cols={[
      { l: "ID", r: r => <span style={{ fontWeight: 600, color: O }}>{r.id}</span> },
      { l: "Batch", k: "batch" },
      { l: "Type", k: "type" },
      { l: "Category", r: r => <CatBadge c={r.cat} /> },
      { l: "Stage", k: "stage" },
      { l: "Description", r: r => <span style={{ fontSize: 12, maxWidth: 220, display: "inline-block" }}>{r.desc}</span> },
      { l: "Status", r: r => <Badge s={r.status} /> },
      { l: "Date", k: "date" },
    ]} data={DEVIATIONS} />
    <Cd style={{ marginTop: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: DK, marginBottom: 10 }}>Escalation Matrix (TER-2.2.26)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {[{ lv: "Info", ap: "Line Supervisor", sla: "24h", c: BL }, { lv: "Minor", ap: "Production Head", sla: "48h", c: YL }, { lv: "Major", ap: "QA Head + Prod Head", sla: "72h", c: O }, { lv: "Critical", ap: "Unit Head + CQA", sla: "Immediate", c: RD }].map((e, i) => <div key={i} style={{ padding: 12, borderRadius: 8, border: `1px solid ${e.c}30`, background: `${e.c}08` }}><div style={{ fontSize: 13, fontWeight: 700, color: e.c }}>{e.lv}</div><div style={{ fontSize: 11, color: G700 }}>Approver: {e.ap}</div><div style={{ fontSize: 11, color: G500 }}>SLA: {e.sla}</div></div>)}
      </div>
    </Cd>
    <Cd style={{ marginTop: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: DK, marginBottom: 10 }}>Notification & Approval Workflow (TER-2.2.14-2.2.15, PRD 5.7)</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: G700, marginBottom: 8 }}>Auto-triggered Notifications</div>
          {[{ ev: "Deviation initiated", to: "QA Reviewer, Production Head", via: "Email + In-app", status: "Sent" }, { ev: "Investigation overdue (SLA breach)", to: "QA Head, Unit Head", via: "Email + SMS", status: "Pending" }, { ev: "CAPA completed", to: "QA Reviewer", via: "In-app", status: "Sent" }, { ev: "Critical deviation raised", to: "Unit Head, CQA", via: "Email + SMS (Immediate)", status: "Sent" }].map((n, i) => <div key={i} style={{ padding: "6px 10px", borderRadius: 6, background: G50, border: `1px solid ${G200}`, marginBottom: 4, fontSize: 11 }}><div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: G700 }}>{n.ev}</b><Badge s={n.status} /></div><div style={{ color: G400 }}>To: {n.to} | Via: {n.via}</div></div>)}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: G700, marginBottom: 8 }}>Review/Approval Flow (linked to batch steps)</div>
          {["1. Deviation initiated by Operator/Supervisor during execution", "2. System links deviation to affected batch step (TER-2.2.25)", "3. Auto-notify configured approvers per escalation matrix", "4. QA investigation with mandatory root cause entry", "5. CAPA assignment and completion tracking", "6. Closure with e-signature + QA approval (PRD 9.1)", "7. Full audit trail of all workflow transitions"].map((s, i) => <div key={i} style={{ padding: "4px 8px", fontSize: 11, color: G600, display: "flex", gap: 6 }}><span style={{ color: GR, fontWeight: 700 }}>✓</span>{s}</div>)}
        </div>
      </div>
    </Cd>
  </div>
);

// 9. E-LOGBOOKS
const LogbookTab = () => (
  <div>
    <Sec sub="Electronic logbooks per PRD 5.8, TER-2.2.96-2.2.104">E-Logbooks & Checklists</Sec>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
      {[{ l: "Active Logbooks", v: LOGBOOKS.filter(l=>l.status==="Active").length, c: GR }, { l: "Entries Today", v: 47, c: BL }, { l: "Pending Checklists", v: 3, c: YL }].map((k, i) => <Cd key={i} style={{ borderLeft: `4px solid ${k.c}` }}><div style={{ fontSize: 22, fontWeight: 700, color: k.c }}>{k.v}</div><div style={{ fontSize: 12, color: G500 }}>{k.l}</div></Cd>)}
    </div>
    <Tbl cols={[
      { l: "Log ID", r: r => <span style={{ fontWeight: 600, fontFamily: "monospace" }}>{r.id}</span> },
      { l: "Type", k: "type" },
      { l: "Equipment", k: "equip" },
      { l: "Area", k: "area" },
      { l: "Entries", r: r => <b>{r.entries}</b> },
      { l: "Last Entry", k: "last" },
      { l: "Status", r: r => <Badge s={r.status} /> },
    ]} data={LOGBOOKS} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
      <Cd>
        <div style={{ fontSize: 13, fontWeight: 600, color: DK, marginBottom: 8 }}>E-Logbook Capabilities (TER-2.2.96-2.2.104)</div>
        {["TER-2.2.96: Customizable templates for area/equipment/cleaning", "TER-2.2.97: Unique identifier per logbook with traceability", "TER-2.2.98: Unlimited templates/checklists/logbooks", "TER-2.2.99: Auto-trigger deviation if checkpoint fails", "TER-2.2.100: Track change parts, stereos, accessories", "TER-2.2.101: Status labels with 2D barcode/RFID", "TER-2.2.102: E-signature with name/ID, date, time; reprint requires approval", "TER-2.2.103: Filter/search by date, equipment, area, batch", "TER-2.2.104: Secure storage per retention policies"].map((f, i) => <div key={i} style={{ padding: "4px 8px", fontSize: 11, color: G600, display: "flex", gap: 6, marginBottom: 2 }}><span style={{ color: GR, fontWeight: 700, flexShrink: 0 }}>✓</span>{f}</div>)}
      </Cd>
      <Cd>
        <div style={{ fontSize: 13, fontWeight: 600, color: DK, marginBottom: 8 }}>Recent Logbook Entries (with e-sign)</div>
        {[{ log: "LOG-001", entry: "Equipment PR571 used for BN-2025-001 granulation", by: "Operator_A", verifier: "Supervisor_B", time: "09:10", esig: true }, { log: "LOG-002", entry: "Cleaning completed for PR726 Coating Machine", by: "Operator_C", verifier: "QA_Reviewer", time: "22:00", esig: true }, { log: "LOG-003", entry: "Area clearance: Compression Suite 1 line cleared", by: "Operator_B", verifier: "Supervisor_B", time: "08:45", esig: true }].map((e, i) => <div key={i} style={{ padding: "8px 10px", borderRadius: 6, background: G50, border: `1px solid ${G200}`, marginBottom: 6, fontSize: 11 }}><div style={{ fontWeight: 500, color: G700 }}>[{e.log}] {e.entry}</div><div style={{ color: G400, marginTop: 2 }}>By: {e.by} | Verified: {e.verifier} | {e.time} | e-Sig: {e.esig ? <span style={{ color: GR }}>✓ Captured</span> : "Pending"}</div></div>)}
        <div style={{ fontSize: 10, color: G400, marginTop: 4 }}>Attachments supported per logbook entry (images, documents per PRD 5.8)</div>
      </Cd>
    </div>
  </div>
);

// 10. INTEGRATION HUB
const IntegrationTab = () => (
  <div>
    <Sec sub="System interfaces per PRD 8.1-8.4, SIR-2.5.1-2.5.10 | DMS version control per PRD 5.9">Integration Hub</Sec>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {INTEGRATIONS.map((s, i) => <Cd key={i} style={{ borderLeft: `4px solid ${s.status === "Connected" ? GR : s.status === "Degraded" ? RD : G300}` }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><div><div style={{ fontSize: 15, fontWeight: 700, color: DK }}>{s.name}</div><div style={{ fontSize: 12, color: G500 }}>{s.supplier} | v{s.ver}</div></div><Badge s={s.status} /></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 11 }}><div><span style={{ color: G400 }}>Type:</span> <span style={{ color: G700, fontWeight: 500 }}>{s.type}</span></div><div><span style={{ color: G400 }}>Sync:</span> <span style={{ color: G700 }}>{s.sync}</span></div></div><div style={{ marginTop: 8, padding: "6px 10px", background: G50, borderRadius: 6, fontSize: 11, color: G500 }}>{s.details}</div></Cd>)}
    </div>
  </div>
);

// 11. REPORTS
const ReportsTab = () => {
  const cd = [{ m: "Sep", y: 97.2, o: 82 }, { m: "Oct", y: 97.8, o: 84 }, { m: "Nov", y: 98.1, o: 85 }, { m: "Dec", y: 97.5, o: 83 }, { m: "Jan", y: 98.4, o: 86 }, { m: "Feb", y: 98.6, o: 87 }];
  return <div>
    <Sec sub="Reporting per PRD 5.10, ROR-2.7.1-2.7.7 | All reports non-editable PDF">Reports & Analytics</Sec>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
      <Cd><div style={{ fontSize: 14, fontWeight: 600, color: DK, marginBottom: 14 }}>Yield Trend</div><div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140, padding: "0 8px" }}>{cd.map((d, i) => <div key={i} style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 10, color: G500 }}>{d.y}%</div><div style={{ height: ((d.y - 95) / 6) * 120, background: `linear-gradient(180deg, ${O}, ${O}80)`, borderRadius: "4px 4px 0 0", minHeight: 10 }} /><div style={{ fontSize: 10, color: G400, marginTop: 4 }}>{d.m}</div></div>)}</div></Cd>
      <Cd><div style={{ fontSize: 14, fontWeight: 600, color: DK, marginBottom: 14 }}>OEE Trend (TER-2.2.110)</div><div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140, padding: "0 8px" }}>{cd.map((d, i) => <div key={i} style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 10, color: G500 }}>{d.o}%</div><div style={{ height: (d.o / 100) * 120, background: `linear-gradient(180deg, ${BL}, ${BL}80)`, borderRadius: "4px 4px 0 0", minHeight: 10 }} /><div style={{ fontSize: 10, color: G400, marginTop: 4 }}>{d.m}</div></div>)}</div></Cd>
    </div>
    <Cd><div style={{ fontSize: 14, fontWeight: 600, color: DK, marginBottom: 12 }}>Available Reports (PDF, non-editable per ROR-2.7.1)</div><div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>{["Executed BMR/BPR Record", "Yield Reconciliation", "OEE Equipment Report", "Deviation Summary", "Audit Trail Report", "Batch Summary", "Cleaning Validation", "SPC Control Chart", "Equipment Breakdown", "Sampling/TRF Report", "Material Reconciliation", "Label Reprint Log"].map((r, i) => <div key={i} style={{ padding: "10px 14px", background: G50, borderRadius: 8, border: `1px solid ${G200}`, fontSize: 12, color: G700, display: "flex", alignItems: "center", gap: 8 }}><span style={{ color: RD, fontSize: 14 }}>📄</span>{r}</div>)}</div></Cd>
  </div>;
};

// 12. COMPLIANCE
const ComplianceTab = () => (
  <div>
    <Sec sub="21 CFR Part 11, GAMP5, ALCOA+ per PRD 7.1-7.4, SEC-2.9.38-2.9.44, REG-2.10.1-2.10.23">Compliance & Audit Trail</Sec>
    <Cd style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: DK, marginBottom: 14 }}>Compliance Status</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {["Electronic Records (REG-2.10.1-5)", "Data Integrity (REG-2.10.6-10)", "E-Signatures (REG-2.10.19-23)", "Audit Trail (SEC-2.9.38-44)", "ALCOA+ Principles", "Backup Integrity (REG-2.10.10)", "Concurrent Mod Prevention (REG-2.10.14)", "Record Deletion Prevention (REG-2.10.9)", "Time-stamped Audit (SEC-2.9.40)"].map((c, i) => <div key={i} style={{ padding: "8px 10px", background: `${GR}08`, borderRadius: 8, border: `1px solid ${GR}30`, display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: GR, fontWeight: 700, fontSize: 14 }}>✓</span><span style={{ fontSize: 12, color: G700 }}>{c}</span></div>)}
      </div>
    </Cd>
    <Cd>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}><div style={{ fontSize: 14, fontWeight: 600, color: DK }}>Audit Trail (Immutable per SEC-2.9.44 | Old/New values per REG-2.10.16)</div><div style={{ fontSize: 11, color: G400 }}>Cannot be modified or deleted</div></div>
      <Tbl cols={[
        { l: "ID", r: r => <span style={{ fontFamily: "monospace", fontSize: 10 }}>{r.id}</span> },
        { l: "Timestamp", r: r => <span style={{ fontFamily: "monospace", fontSize: 10 }}>{r.ts}</span> },
        { l: "User", r: r => <b>{r.user}</b> },
        { l: "Module", k: "module" },
        { l: "Action", k: "action" },
        { l: "Detail (incl. old/new values)", r: r => <span style={{ fontSize: 11 }}>{r.detail}</span> },
        { l: "Source IP", r: r => <span style={{ fontFamily: "monospace", fontSize: 10 }}>{r.ip}</span> },
      ]} data={AUDIT} />
    </Cd>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 14 }}>
      <Cd>
        <div style={{ fontSize: 13, fontWeight: 600, color: DK, marginBottom: 8 }}>Backup & Recovery (PRD 6.2, DAR-2.3)</div>
        {[{ l: "Backup Frequency", v: "Daily full + Hourly incremental" }, { l: "Retention (DAR-2.3.1)", v: "6 years from MFG date" }, { l: "Last Backup", v: "2025-02-08 06:00" }, { l: "Recovery RTO", v: "< 4 hours" }, { l: "DR Site", v: "Configured (Offsite)" }, { l: "Deduplication (DAR-2.3.3)", v: "Enabled" }].map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${G100}`, fontSize: 11 }}><span style={{ color: G500 }}>{r.l}</span><b style={{ color: G700 }}>{r.v}</b></div>)}
      </Cd>
      <Cd>
        <div style={{ fontSize: 13, fontWeight: 600, color: DK, marginBottom: 8 }}>Data Integrity (PRD 7.4, DAR-2.3.4-11)</div>
        {["DAR-2.3.5: No deletion; auto backup to removable media", "DAR-2.3.6: Contemporaneous capture with server timestamp", "DAR-2.3.7: Acquired equipment data immutable", "DAR-2.3.8: Complete electronic records; no modification", "DAR-2.3.9: No hurdles in communication/transfer/storage", "DAR-2.3.11: Power failure recovery without data loss"].map((f, i) => <div key={i} style={{ padding: "3px 8px", fontSize: 11, color: G600, display: "flex", gap: 4 }}><span style={{ color: GR, fontWeight: 700 }}>✓</span>{f}</div>)}
      </Cd>
      <Cd>
        <div style={{ fontSize: 13, fontWeight: 600, color: DK, marginBottom: 8 }}>Performance SLAs (PRD 6.1)</div>
        {[{ l: "Daily dialogs", v: "< 3 sec", ok: true }, { l: "500+ record query", v: "< 30 sec", ok: true }, { l: "Report generation", v: "< 60 sec", ok: true }, { l: "Availability", v: "24/7 (3 shifts)", ok: true }, { l: "Equipment data lag", v: "< 1 sec", ok: true }].map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${G100}`, fontSize: 11 }}><span style={{ color: G500 }}>{r.l}</span><span style={{ color: GR, fontWeight: 600 }}>{r.v} ✓</span></div>)}
      </Cd>
    </div>
  </div>
);

// 13. USER MANAGEMENT
const UsersTab = () => (
  <div>
    <Sec sub="RBAC per PRD 7.1, UMR-2.4.1-2.4.5, SEC-2.9.1-2.9.37">User Management & Security</Sec>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
      <Cd>
        <div style={{ fontSize: 14, fontWeight: 600, color: DK, marginBottom: 10 }}>Security Policies</div>
        {[{ p: "Credentials (SEC-2.9.26)", v: "User ID + Password/Biometric" }, { p: "Password (SEC-2.9.28)", v: "8+ chars, mixed case/num/special" }, { p: "Expiry", v: "90 days" }, { p: "Lockout (SEC-2.9.10)", v: "5 attempts" }, { p: "Timeout (SEC-2.9.29)", v: "15 min" }, { p: "History (SEC-2.9.17)", v: "12 passwords" }, { p: "Login (UMR-2.4.5)", v: "Password / Retina" }].map((p, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${G100}`, fontSize: 12 }}><span style={{ color: G500 }}>{p.p}</span><b style={{ color: G700 }}>{p.v}</b></div>)}
      </Cd>
      <Cd>
        <div style={{ fontSize: 14, fontWeight: 600, color: DK, marginBottom: 10 }}>Privilege Matrix (UMR-2.4.1)</div>
        <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}><thead><tr style={{ background: G50 }}><th style={{ padding: 6, textAlign: "left", borderBottom: `1px solid ${G200}` }}>Role</th>{["Batch Exec", "Review", "Approve", "Master Data", "User Mgmt", "Audit"].map(h => <th key={h} style={{ padding: 6, textAlign: "center", borderBottom: `1px solid ${G200}`, fontSize: 9 }}>{h}</th>)}</tr></thead><tbody>
        {[{ r: "Operator", p: [1,0,0,0,0,0] }, { r: "Supervisor", p: [1,1,0,0,0,1] }, { r: "QA Reviewer", p: [0,1,1,0,0,1] }, { r: "QA Head", p: [0,1,1,1,0,1] }, { r: "Admin", p: [0,0,0,1,1,1] }].map((r, i) => <tr key={i} style={{ borderBottom: `1px solid ${G100}` }}><td style={{ padding: 6, fontWeight: 500 }}>{r.r}</td>{r.p.map((v, j) => <td key={j} style={{ padding: 6, textAlign: "center", color: v ? GR : G300 }}>{v ? "✓" : "—"}</td>)}</tr>)}
        </tbody></table>
      </Cd>
    </div>
    <Tbl cols={[
      { l: "ID", r: r => <span style={{ fontFamily: "monospace" }}>{r.id}</span> },
      { l: "Name", r: r => <b>{r.name}</b> },
      { l: "Role", k: "role" },
      { l: "Department", k: "dept" },
      { l: "Status", r: r => <Badge s={r.status} /> },
      { l: "Last Login", r: r => <span style={{ fontFamily: "monospace", fontSize: 11 }}>{r.login}</span> },
    ]} data={USERS} />
  </div>
);

// ── Navigation ──────────────────────────────────────────
const TABS = [
  { id: "dash", l: "Dashboard", i: "📊", ref: "BFR-2.1.3" },
  { id: "tpl", l: "Master Templates", i: "📐", ref: "PRD 5.1" },
  { id: "batch", l: "Batch Execution", i: "🏭", ref: "PRD 5.2" },
  { id: "mat", l: "Materials", i: "🧪", ref: "PRD 5.3" },
  { id: "equip", l: "Equipment", i: "🔧", ref: "PRD 5.4" },
  { id: "ipc", l: "IPC & Controls", i: "🔬", ref: "PRD 5.5" },
  { id: "sample", l: "Sampling & Labels", i: "🏷️", ref: "PRD 5.6" },
  { id: "dev", l: "Deviations", i: "⚠️", ref: "PRD 5.7" },
  { id: "log", l: "E-Logbooks", i: "📋", ref: "PRD 5.8" },
  { id: "integ", l: "Integration Hub", i: "🔗", ref: "PRD 8" },
  { id: "rpt", l: "Reports", i: "📈", ref: "PRD 5.10" },
  { id: "comp", l: "Compliance", i: "🛡️", ref: "PRD 7" },
  { id: "usr", l: "User Mgmt", i: "👥", ref: "SEC-2.9" },
];
const TC = { dash: DashboardTab, tpl: TemplatesTab, batch: BatchTab, mat: MaterialsTab, equip: EquipmentTab, ipc: IPCTab, sample: SamplingTab, dev: DeviationTab, log: LogbookTab, integ: IntegrationTab, rpt: ReportsTab, comp: ComplianceTab, usr: UsersTab };

export default function MES() {
  const [tab, setTab] = useState("dash");
  const [time, setTime] = useState(new Date());
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const Tab = TC[tab];
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', -apple-system, sans-serif", background: G50, color: G800 }}>
      <div style={{ width: collapsed ? 56 : 210, background: DK, color: "#fff", display: "flex", flexDirection: "column", transition: "width 0.3s", flexShrink: 0, overflow: "hidden" }}>
        <div style={{ padding: collapsed ? "14px 6px" : "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: O, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#fff", flexShrink: 0 }}>M</div>
            {!collapsed && <div><div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>MES</div><div style={{ fontSize: 8, color: "rgba(255,255,255,0.5)" }}>MICRO LABS ML11</div></div>}
          </div>
        </div>
        <div style={{ flex: 1, padding: "6px 4px", overflowY: "auto" }}>
          {TABS.map(t => {
            const a = tab === t.id;
            return <button key={t.id} onClick={() => setTab(t.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: collapsed ? "8px 6px" : "7px 10px", marginBottom: 1, background: a ? `${O}20` : "transparent", border: "none", borderRadius: 6, cursor: "pointer", color: a ? O : "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: a ? 600 : 400, textAlign: "left", borderLeft: a ? `3px solid ${O}` : "3px solid transparent", justifyContent: collapsed ? "center" : "flex-start" }} title={collapsed ? `${t.l} (${t.ref})` : ""}><span style={{ fontSize: 14, flexShrink: 0 }}>{t.i}</span>{!collapsed && <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}><span>{t.l}</span><span style={{ fontSize: 8, opacity: 0.5 }}>{t.ref}</span></div>}</button>;
          })}
        </div>
        <button onClick={() => setCollapsed(!collapsed)} style={{ padding: 10, background: "rgba(255,255,255,0.05)", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 12 }}>{collapsed ? "→" : "← Collapse"}</button>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "8px 20px", background: "#fff", borderBottom: `1px solid ${G200}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 10, color: G400, textTransform: "uppercase", letterSpacing: 1 }}>QAP/MLCM/0095/ANX/0026-000 | URS:ML11:25:0009</span>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 10, color: G400, fontFamily: "monospace" }}>{time.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: GR }} /><span style={{ fontSize: 10, color: GR, fontWeight: 500 }}>Online</span></div>
            <div style={{ padding: "3px 10px", background: G50, borderRadius: 6, fontSize: 10, color: G500 }}>👤 QA_Reviewer | ML11</div>
          </div>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
          <Tab />
          <div style={{ marginTop: 28, padding: "14px 0", borderTop: `1px solid ${G200}`, display: "flex", justifyContent: "space-between", fontSize: 9, color: G400 }}>
            <span>POC v2: MES | Micro Labs Limited, Veerasandra (ML11) | URS:ML11:25:0009 | PRD Aligned</span>
            <span>GAMP5 Cat 5 | 21 CFR Part 11 | ALCOA+ | ANSI/ISA-95 | 13 Modules</span>
          </div>
        </div>
      </div>
    </div>
  );
}
