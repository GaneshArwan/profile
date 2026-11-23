import React, { useState } from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { GlossyText } from '../ui/GlossyText';
import { BackgroundOverlay } from '../ui/BackgroundOverlay';
import { 
  Award, 
  Database, 
  CheckCircle2, 
  ShieldCheck, 
  BarChart3, 
  ExternalLink,
  Building,
  Users,
  ShoppingBag,
  CircleDollarSign,
  ArrowRight,
  Code2,
  FileCode2,
  Check
} from 'lucide-react';
import { useBackgroundImage } from '../../hooks/useBackgroundImage';
import { EXPERIENCE, LOCAL_BACKGROUNDS, REMOTE_BACKGROUNDS } from '../../data/constants';
import { useI18n } from '../../lib/i18n';

const DOMAIN_DATA = {
  site: {
    icon: Building,
    name: "Site",
    code: "01. SITE",
    labelEn: "Store & Branch Topology",
    labelId: "Topologi Toko & Cabang",
    metricEn: "100% store hierarchy integrity",
    metricId: "100% integritas hierarki toko",
    summaryEn: "Location hierarchy, store metadata governance, and opening/renovation lifecycle tracking.",
    summaryId: "Hierarki lokasi, tata kelola metadata toko, dan pelacakan siklus pembukaan/renovasi.",
    accent: {
      tag: "text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 border-teal-200 dark:border-teal-800",
      indicator: "text-teal-700 dark:text-teal-400"
    },
    pipeline: [
      { 
        step: "1. Intake", 
        nodeLabel: "[01 INTAKE]",
        detailEn: "Digital store opening request & regional attribute forms", 
        detailId: "Formulir pembukaan toko & atribut regional",
        inputContract: "Store Planning Spec & Geo Coordinates (CSV / Google Forms)",
        outputContract: "Standardized Store Topology Row (JSON / Sheets)",
        rules: "Mandatory regional tiering, postal zoning & opening milestone dates."
      },
      { 
        step: "2. Validation", 
        nodeLabel: "[02 VALIDATION]",
        detailEn: "Automated postal code & regional hierarchy pre-validation scripts", 
        detailId: "Skrip pra-validasi kode pos & hierarki regional otomatis",
        inputContract: "Raw Store Topology Payload",
        outputContract: "Pre-validated Store Hierarchy Record",
        rules: "Automated regex postal verification & corporate branch hierarchy tree checks."
      },
      { 
        step: "3. Staging & Entry", 
        nodeLabel: "[03 STAGING & RPA]",
        detailEn: "Google Sheets master data staging & SAP GUI automated store creation", 
        detailId: "Staging master data di Google Sheets & pembuatan toko otomatis via SAP GUI",
        inputContract: "Pre-cleared Master Staging Row",
        outputContract: "SAP Live Store Branch Creation",
        rules: "Google Sheets staging triggers automated SAP GUI VBScript to provision new store."
      },
      { 
        step: "4. BI & Governance", 
        nodeLabel: "[04 GOVERNANCE]",
        detailEn: "Looker branch distribution and opening status dashboards", 
        detailId: "Dashboard Looker distribusi cabang & status pembukaan",
        inputContract: "SAP Production Tables & Staging Logs",
        outputContract: "Executive Looker Dashboard & Audit History",
        rules: "Monitors national branch distribution and store opening turnaround SLAs."
      }
    ],
    tech: ["Google Apps Script", "Google Sheets", "Looker", "SAP GUI Scripting", "SQL"]
  },
  vendor: {
    icon: Users,
    name: "Vendor",
    code: "02. VENDOR",
    labelEn: "Supplier & Partner Master",
    labelId: "Master Vendor & Mitra",
    metricEn: "Zero duplicate vendor entries",
    metricId: "Nol duplikasi entri vendor",
    summaryEn: "Onboarding compliance, tax verification (NPWP), banking details, and payment terms synchronization.",
    summaryId: "Kepatuhan orientasi pemasok, verifikasi pajak (NPWP), rekening bank, dan sinkronisasi syarat bayar.",
    accent: {
      tag: "text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 border-teal-200 dark:border-teal-800",
      indicator: "text-teal-700 dark:text-teal-400"
    },
    pipeline: [
      { 
        step: "1. Intake", 
        nodeLabel: "[01 INTAKE]",
        detailEn: "Structured vendor registration forms & compliance document collection", 
        detailId: "Formulir registrasi vendor terstruktur & pengumpulan dokumen kepatuhan",
        inputContract: "Supplier Onboarding Portal & Document Submissions",
        outputContract: "Structured Vendor Profile & Tax Payload",
        rules: "Ingests legal entity name, corporate address, bank account details & tax docs."
      },
      { 
        step: "2. Validation", 
        nodeLabel: "[02 VALIDATION]",
        detailEn: "Automated NPWP tax format verification & duplicate bank account checks", 
        detailId: "Validasi format NPWP otomatis & pengecekan duplikasi rekening bank",
        inputContract: "Vendor Tax & Financial Attributes",
        outputContract: "Verified NPWP & Deduplicated Bank Record",
        rules: "Automated 16-digit NPWP format algorithms & duplicate bank account cross-checks."
      },
      { 
        step: "3. Staging & Entry", 
        nodeLabel: "[03 STAGING & RPA]",
        detailEn: "Automated Google Sheets validation pipelines & SAP vendor synchronization", 
        detailId: "Pipeline validasi Google Sheets otomatis & sinkronisasi vendor ke SAP",
        inputContract: "Audited Vendor Master Row",
        outputContract: "SAP Live Vendor Master Synchronization",
        rules: "Automated Google Sheets validation pipelines & SAP vendor synchronization scripts."
      },
      { 
        step: "4. BI & Governance", 
        nodeLabel: "[04 GOVERNANCE]",
        detailEn: "Looker vendor onboarding SLA & turnaround performance tracker", 
        detailId: "Pelacak performa dan SLA turnaround orientasi vendor di Looker",
        inputContract: "Committed SAP Vendor Master Tables",
        outputContract: "Looker Vendor Onboarding SLA Dashboard",
        rules: "Turnaround velocity tracker monitoring vendor approval bottlenecks and SLAs."
      }
    ],
    tech: ["Google Apps Script", "Google Forms", "Google Sheets", "Looker", "SQL"]
  },
  customer: {
    icon: Users,
    name: "Customer",
    code: "03. CUSTOMER",
    labelEn: "B2B & Retail Client Graph",
    labelId: "Graf Klien B2B & Ritel",
    metricEn: ">99% customer record completeness",
    metricId: ">99% kelengkapan data pelanggan",
    summaryEn: "Entity deduplication, credit limit parameters, national identity and branch relationship mapping.",
    summaryId: "Deduplikasi entitas, parameter limit kredit, serta pemetaan identitas dan relasi cabang.",
    accent: {
      tag: "text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800",
      indicator: "text-emerald-700 dark:text-emerald-400"
    },
    pipeline: [
      { 
        step: "1. Intake", 
        nodeLabel: "[01 INTAKE]",
        detailEn: "B2B client onboarding & structured credit evaluation intake", 
        detailId: "Intake orientasi klien B2B & evaluasi limit kredit terstruktur",
        inputContract: "B2B Credit Application & Enterprise Client Form",
        outputContract: "Normalized Client Entity Record",
        rules: "Gathers B2B corporate profile, credit terms, and branch relationship parameters."
      },
      { 
        step: "2. Validation", 
        nodeLabel: "[02 VALIDATION]",
        detailEn: "Fuzzy-matching entity deduplication & corporate registration verification", 
        detailId: "Deduplikasi entitas dengan pencocokan fuzzy & verifikasi registrasi korporasi",
        inputContract: "Client Identity & Registration Data",
        outputContract: "Deduplicated Client Master Node",
        rules: "Fuzzy-matching entity deduplication & corporate registration verification."
      },
      { 
        step: "3. Staging & Entry", 
        nodeLabel: "[03 STAGING & RPA]",
        detailEn: "Centralized client master sheet & automated SAP client record entry", 
        detailId: "Master sheet data klien terpusat & entri data pelanggan otomatis ke SAP",
        inputContract: "Centralized Client Master Sheet",
        outputContract: "Automated SAP Client Record Entry",
        rules: "Staging pipeline with automated SAP GUI scripting for batch customer master entry."
      },
      { 
        step: "4. BI & Governance", 
        nodeLabel: "[04 GOVERNANCE]",
        detailEn: "Looker client credit limit and profile completeness dashboards", 
        detailId: "Dashboard Looker kelengkapan profil & monitoring limit kredit klien",
        inputContract: "Live SAP Client Ledger & Credit Limit Tables",
        outputContract: "Looker Credit Limit & Completeness Dashboard",
        rules: "Monitors client profile completeness (>99%) and real-time credit limit exposure."
      }
    ],
    tech: ["Google Apps Script", "Google Sheets", "SQL", "Looker", "SAP GUI Scripting"]
  },
  article: {
    icon: ShoppingBag,
    name: "Article",
    code: "04. ARTICLE",
    labelEn: "SKU Catalog & Merchandise",
    labelId: "Katalog SKU & Barang",
    metricEn: "Automated classification for 10k+ SKUs",
    metricId: "Otomasi klasifikasi untuk 10k+ SKU",
    summaryEn: "Product classification hierarchy, barcode validation, tariff codes, and unit conversion formulas.",
    summaryId: "Hierarki klasifikasi produk, validasi barcode, kode tarif bea cukai, dan konversi satuan.",
    accent: {
      tag: "text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800",
      indicator: "text-emerald-700 dark:text-emerald-400"
    },
    pipeline: [
      { 
        step: "1. Intake", 
        nodeLabel: "[01 INTAKE]",
        detailEn: "Merchandise intake sheets & batch SKU registration forms", 
        detailId: "Lembar intake barang & formulir registrasi batch SKU",
        inputContract: "Merchandise Intake Sheet & Batch SKU Form",
        outputContract: "Normalized Product Taxonomy Object",
        rules: "Collects merchandise attributes, category hierarchy, unit of measure, and tariff codes."
      },
      { 
        step: "2. Validation", 
        nodeLabel: "[02 VALIDATION]",
        detailEn: "Automated barcode checksum algorithms & taxonomy hierarchy rules", 
        detailId: "Validasi algoritma checksum barcode & aturan hierarki taksonomi produk",
        inputContract: "Raw SKU & Barcode Specifications",
        outputContract: "Validated Barcode & Taxonomy Checksum",
        rules: "Automated barcode checksum algorithms & taxonomy hierarchy rules across 10k+ SKUs."
      },
      { 
        step: "3. Staging & Entry", 
        nodeLabel: "[03 STAGING & RPA]",
        detailEn: "Batch spreadsheet preprocessing & SAP automated merchandise loading", 
        detailId: "Pra-pemrosesan batch spreadsheet & pemuatan data barang otomatis ke SAP",
        inputContract: "Batch Spreadsheet Preprocessing Sheet",
        outputContract: "SAP Automated Merchandise Loading",
        rules: "Batch preprocessing scripts triggering automated SAP merchandise master loading."
      },
      { 
        step: "4. BI & Governance", 
        nodeLabel: "[04 GOVERNANCE]",
        detailEn: "Looker catalog completeness and SKU ingestion latency monitor", 
        detailId: "Monitor Looker untuk kelengkapan katalog & latensi pemrosesan SKU",
        inputContract: "Live Catalog Database & Warehouse Sync",
        outputContract: "Looker Catalog Ingestion Latency Monitor",
        rules: "Audits catalog completeness and SKU ingestion latency across retail campaigns."
      }
    ],
    tech: ["Google Apps Script", "Google Sheets", "SQL", "Looker", "SAP GUI Scripting"]
  },
  finance: {
    icon: CircleDollarSign,
    name: "Finance",
    code: "05. FINANCE",
    labelEn: "Cost Centers & General Ledger",
    labelId: "Pusat Biaya & Buku Besar",
    metricEn: "Audit-ready reconciliation",
    metricId: "Rekonsiliasi siap audit",
    summaryEn: "GL account validation, cost-center routing, and financial statement aggregation hierarchies.",
    summaryId: "Validasi akun GL, perutean pusat biaya, dan hierarki konsolidasi laporan keuangan.",
    accent: {
      tag: "text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800",
      indicator: "text-amber-800 dark:text-amber-400"
    },
    pipeline: [
      { 
        step: "1. Intake", 
        nodeLabel: "[01 INTAKE]",
        detailEn: "Departmental cost center & GL mapping change request forms", 
        detailId: "Formulir pengajuan perubahan pusat biaya & pemetaan akun GL",
        inputContract: "Departmental Cost Center & GL Change Form",
        outputContract: "Financial Hierarchy Update Payload",
        rules: "Ingests departmental cost-center allocations, profit centers, and GL account changes."
      },
      { 
        step: "2. Validation", 
        nodeLabel: "[02 VALIDATION]",
        detailEn: "Automated chart-of-accounts routing & balance reconciliation scripts", 
        detailId: "Skrip validasi rute bagan akun & rekonsiliasi saldo otomatis",
        inputContract: "Accounting Codes & Debit/Credit Routes",
        outputContract: "Reconciled Chart-of-Accounts Routing",
        rules: "Automated chart-of-accounts routing & balance reconciliation scripts for zero variance."
      },
      { 
        step: "3. Staging & Entry", 
        nodeLabel: "[03 STAGING & RPA]",
        detailEn: "Structured financial mapping sheets & SAP general ledger synchronization", 
        detailId: "Sheet pemetaan keuangan terstruktur & sinkronisasi buku besar ke SAP",
        inputContract: "Structured Financial Mapping Sheet",
        outputContract: "SAP General Ledger Synchronization",
        rules: "Staging spreadsheet workflow syncing mapped cost centers into SAP general ledger."
      },
      { 
        step: "4. BI & Governance", 
        nodeLabel: "[04 GOVERNANCE]",
        detailEn: "Looker financial governance and variance monitoring dashboards", 
        detailId: "Dashboard Looker untuk tata kelola & pemantauan variansi keuangan",
        inputContract: "Consolidated Financial Master Ledger",
        outputContract: "Looker Financial Governance Dashboard",
        rules: "Provides real-time variance monitoring, audit trail logging, and statement aggregation."
      }
    ],
    tech: ["Google Apps Script", "Google Sheets", "SQL", "Looker", "SAP GUI Scripting"]
  }
};

const STEP_COLORS = [
  'text-teal-800 dark:text-teal-300',
  'text-emerald-800 dark:text-emerald-300',
  'text-teal-700 dark:text-teal-400',
  'text-emerald-700 dark:text-emerald-400'
];

const TECH_CHIP_COLORS = {
  'Google Apps Script': 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60',
  'Google Sheets': 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60',
  'Google Forms': 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60',
  'Looker': 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60',
  'SQL': 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60',
  'SAP GUI Scripting': 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60'
};

export const Experience = () => {
  const { t, isIndonesian } = useI18n();
  const [activeDomainKey, setActiveDomainKey] = useState('site');
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const bgImage = useBackgroundImage(LOCAL_BACKGROUNDS.experience, REMOTE_BACKGROUNDS.experience);
  const activeDomain = DOMAIN_DATA[activeDomainKey] || DOMAIN_DATA.site;
  const activePipelineItem = activeDomain.pipeline[activeStepIndex] || activeDomain.pipeline[0];

  return (
    <section id="experience" className="py-24 relative transition-colors duration-300 scroll-mt-20 bg-slate-50 dark:bg-slate-950">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-slate-50/95 dark:bg-slate-950/95" />
        <BackgroundOverlay />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader 
          title={<GlossyText>{t('experience.title') || "Experience"}</GlossyText>}
          subtitle={t('experience.subtitle') || "Enterprise Master Data Governance, Workflow Automation, and Operational Analytics"}
        />

        {/* ================================================================= */}
        {/* Flagship Interactive Feature: 5-Domain MDM ETL Architecture       */}
        {/* ================================================================= */}
        <div className="mb-20 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/90 dark:border-emerald-950/60 p-6 md:p-8 shadow-sm backdrop-blur-md">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-semibold mb-2 border border-emerald-200 dark:border-emerald-800">
                <Database size={13} aria-hidden="true" />
                <span>KAWAN LAMA GROUP MDM ARCHITECTURE</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                {t('experience.domainExplorerTitle') || "Governed Enterprise Domains"}
              </h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                {t('experience.domainExplorerSubtitle') || "Master data governance across 5 core enterprise domains at Kawan Lama Group"}
              </p>
            </div>

            {/* SLA Accuracy Callout */}
            <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/50 p-3.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
              <ShieldCheck size={24} className="text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Enterprise MDM SLA</p>
                <p className="text-lg font-bold font-mono text-emerald-800 dark:text-emerald-300 leading-tight">
                  &gt;99% Accuracy • +30% SLA Speed
                </p>
              </div>
            </div>
          </div>

          {/* Dev-tool Segmented Control with Monospaced Numbering (Accessible Tablist) */}
          <div 
            role="tablist" 
            aria-label="Enterprise Master Data Domains"
            className="flex flex-wrap gap-2 mb-6 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 w-fit"
          >
            {Object.entries(DOMAIN_DATA).map(([key, domain]) => {
              const Icon = domain.icon;
              const isActive = activeDomainKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  id={`domain-tab-${key}`}
                  aria-selected={isActive}
                  aria-controls={`domain-panel-${key}`}
                  onClick={() => {
                    setActiveDomainKey(key);
                    setActiveStepIndex(0);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
                    isActive 
                      ? 'bg-emerald-700 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold shadow-sm' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/70 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span className="font-mono text-xs opacity-75 mr-0.5">{domain.code.slice(0, 3)}</span>
                  <span>{domain.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Domain Panel */}
          <div
            role="tabpanel"
            id={`domain-panel-${activeDomainKey}`}
            aria-labelledby={`domain-tab-${activeDomainKey}`}
            className="bg-slate-50/90 dark:bg-slate-950/90 rounded-xl p-5 md:p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-6"
          >
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${activeDomain.accent?.indicator || 'text-emerald-700 dark:text-emerald-400'}`}>
                  {isIndonesian ? activeDomain.labelId : activeDomain.labelEn}
                </span>
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 mt-0.5">
                  {isIndonesian ? activeDomain.summaryId : activeDomain.summaryEn}
                </p>
              </div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold shrink-0 ${activeDomain.accent?.tag || 'bg-emerald-100/80 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'}`}>
                <CheckCircle2 size={14} aria-hidden="true" />
                <span>{isIndonesian ? activeDomain.metricId : activeDomain.metricEn}</span>
              </div>
            </div>

            {/* Interactive 4-Node ETL Pipeline Architecture Flow */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <BarChart3 size={14} className="text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                  <span>{isIndonesian ? "Alur Data & Pipeline ETL" : "ETL Pipeline & Data Architecture"}</span>
                </p>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden sm:inline-block">
                  Click any node to inspect I/O contracts
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {activeDomain.pipeline.map((item, idx) => {
                  const isStepActive = activeStepIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveStepIndex(idx)}
                      aria-expanded={isStepActive}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:focus-visible:outline-emerald-400 ${
                        isStepActive
                          ? 'bg-white dark:bg-slate-900 border-emerald-600 dark:border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-emerald-600/50 dark:hover:border-emerald-400/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className={`text-[11px] font-mono font-bold ${STEP_COLORS[idx] || 'text-emerald-700 dark:text-emerald-400'}`}>
                            {item.step}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                            isStepActive
                              ? 'bg-emerald-600 text-white dark:bg-emerald-400 dark:text-slate-950'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          }`}>
                            {item.nodeLabel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-snug">
                          {isIndonesian ? item.detailId : item.detailEn}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between text-[10px] font-mono">
                        <span className={isStepActive ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-400 dark:text-slate-500'}>
                          {isStepActive ? '● INSPECTING' : '○ CONTRACT'}
                        </span>
                        <ArrowRight size={11} className={isStepActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'} aria-hidden="true" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Step Affordance: Underlying Input / Output Contract Inspector */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
              <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-100/90 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                  <span className="font-bold text-slate-900 dark:text-slate-100">CONTRACT SPECIFICATION</span>
                  <span className="text-slate-400">//</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{activePipelineItem.nodeLabel}</span>
                  <span className="text-slate-500">({activePipelineItem.step})</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">
                  DOMAIN: {activeDomain.name}
                </span>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                    <Code2 size={13} className="text-teal-700 dark:text-teal-400" aria-hidden="true" />
                    <span>Input Contract</span>
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                    {activePipelineItem.inputContract}
                  </p>
                </div>

                <div className="space-y-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                    <FileCode2 size={13} className="text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                    <span>Output Contract</span>
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                    {activePipelineItem.outputContract}
                  </p>
                </div>

                <div className="space-y-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                    <Check size={13} className="text-amber-800 dark:text-amber-400" aria-hidden="true" />
                    <span>Governance Rules</span>
                  </div>
                  <p className="font-medium text-slate-700 dark:text-slate-300 leading-snug">
                    {activePipelineItem.rules}
                  </p>
                </div>
              </div>
            </div>

            {/* Domain Tech Stack */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-800/80">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 mr-2">
                Tech Infrastructure:
              </span>
              {activeDomain.tech.map((tItem, i) => (
                <span 
                  key={i} 
                  className={`px-2.5 py-0.5 rounded text-xs font-medium ${TECH_CHIP_COLORS[tItem] || 'bg-slate-200/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`}
                >
                  {tItem}
                </span>
              ))}
            </div>

          </div>

        </div>

        {/* ================================================================= */}
        {/* Modern Dev-Tool Changelog / Work-Log Timeline                     */}
        {/* ================================================================= */}
        <div className="max-w-5xl mx-auto">
          <div className="space-y-12 relative before:absolute before:inset-0 before:left-4 md:before:left-6 before:w-px before:bg-gradient-to-b before:from-emerald-700/50 before:via-slate-300 dark:before:via-emerald-950/60 before:to-transparent">
            {EXPERIENCE.map((exp) => (
              <div key={exp.id} className="relative pl-10 md:pl-16 group">
                
                {/* Modern Work-Log Timeline Node Indicator */}
                <div 
                  className="absolute left-4 md:left-6 top-8 size-3.5 -translate-x-1/2 rounded-full border-2 border-slate-50 dark:border-slate-950 bg-emerald-700 dark:bg-emerald-400 ring-4 ring-emerald-500/10 group-hover:scale-125 transition-transform" 
                  aria-hidden="true" 
                />

                {/* Dev-Tool Changelog Card */}
                <div className="relative bg-white/90 dark:bg-slate-900/90 p-6 md:p-8 rounded-2xl border border-slate-200/90 dark:border-emerald-950/60 shadow-sm backdrop-blur-md transition-all hover:border-emerald-700/40 dark:hover:border-emerald-500/40">
                  
                  {/* Card Header Meta Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200/70 dark:border-slate-800/70">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-base font-bold text-slate-900 dark:text-slate-100">{exp.company}</span>
                        <span className="text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
                          {exp.type}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        {exp.role}
                      </h3>
                    </div>

                    <div className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                      {exp.date}
                    </div>
                  </div>
                  
                  {/* Narrative description & bullet points */}
                  <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
                    {exp.description}
                  </div>

                  {/* Best Intern Distinction Card */}
                  {(exp.award || exp.highlight) && (
                    <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800">
                      <a 
                        href={exp.award?.credentialUrl || exp.link || "https://www.linkedin.com/in/william-oo00/overlay/1743496220514/single-media-viewer/?profileId=ACoAAD2slAoBjkl94d--TrheKOVwxTXqS41kD8E"}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View William's Best Intern Certificate on LinkedIn"
                        className="flex items-start gap-3 bg-amber-500/10 dark:bg-amber-400/10 p-4 rounded-xl border border-amber-500/30 dark:border-amber-400/30 hover:bg-amber-500/20 dark:hover:bg-amber-400/20 transition-all w-full text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                      >
                        <Award size={20} className="text-amber-800 dark:text-amber-400 mt-0.5 shrink-0" aria-hidden="true" />
                        <div className="flex-1 min-w-0">
                          <p className="text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-bold group-hover:underline flex items-center gap-1.5">
                            <span>{exp.award?.title || exp.highlight || "Awarded Best Intern (Certificate of Excellence)"}</span>
                            <ExternalLink size={13} className="inline-block shrink-0" aria-hidden="true" />
                          </p>
                          <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                            {t('experience.viewCertificate') || "View Credential on LinkedIn"}
                          </p>
                        </div>
                      </a>
                    </div>
                  )}

                  {/* Tech stack badges */}
                  {Array.isArray(exp.tech) && exp.tech.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 mr-1">
                        Domain Tooling:
                      </span>
                      {exp.tech.map((tool, idx) => (
                        <span 
                          key={idx} 
                          className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}

                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};