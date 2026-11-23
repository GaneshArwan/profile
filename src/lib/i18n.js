/**
 * src/lib/i18n.js
 * Zero-dependency, lightweight internationalization system for William's Portfolio.
 * Provides English ('en') and Indonesian ('id') localization with reactive React Context.
 */
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

export const SUPPORTED_LOCALES = ['en', 'id'];
export const DEFAULT_LOCALE = 'en';

export const translations = {
  en: {
    nav: {
      home: "Top",
      about: "About",
      experience: "Experience",
      projects: "Projects",
      skills: "Skills",
      certifications: "Awards",
      contact: "Contact",
      theme: "Theme",
      language: "Language",
      status: "Available for Data, Automation & AI Roles",
      backToTop: "Back to Top"
    },
    hero: {
      greeting: "Hello, I'm",
      name: "William",
      role: "Data & Automation Analyst",
      badge: "Data Governance & Workflow Automation",
      tagline: "Turning high-volume enterprise operations into governed, automated pipelines: delivering >99% master data accuracy, 30% faster SLA turnaround, and 3x request capacity without added headcount.",
      ctaContact: "Get In Touch",
      ctaProjects: "View Projects",
      chips: {
        education: "Untar Informatics • GPA 3.89",
        experience: "Kawan Lama Group • MDM Officer",
        location: "Jakarta, Indonesia",
        bestIntern: "Awarded Best Intern"
      },
      telemetry: {
        accuracyLabel: "Master Data Accuracy",
        accuracyValue: ">99.0%",
        accuracyDetail: "Across 5 governed enterprise domains",
        slaLabel: "SLA Turnaround",
        slaValue: "+30%",
        slaDetail: "Intake standardization & pre-validation scripts",
        automationLabel: "Tasks Automated",
        automationValue: "~70%",
        automationDetail: "Standardized Google Apps Script & SAP RPA",
        capacityLabel: "Request Capacity",
        capacityValue: "3x",
        capacityDetail: "Scaled daily volume with same headcount"
      }
    },
    about: {
      title: "About Me",
      subtitle: "Combining Informatics Engineering rigor (GPA 3.89) with enterprise-scale Master Data Management, SAP RPA, and production AI workflows",
      bioParagraph1: "I am a Data & Automation Analyst with 2 years of corporate experience in enterprise master data management, workflow automation, and operational analytics at Kawan Lama Group. A 2024 Informatics Engineering graduate from Tarumanagara University (GPA 3.89, graduated with High Distinction), I combine disciplined data governance (Google Workspace scripting, Looker, SQL, SAP GUI automation) with hands-on applied AI engineering (LangGraph.js, ChromaDB, Gemini API) to build reliable, auditable systems.",
      bioParagraph2: "Across 5 core enterprise domains (Site, Vendor, Customer, Article, Finance), I improved master data SLA turnaround by 30%, automated ~70% of repetitive intake and validation tasks via Google Apps Script and SAP GUI scripting, and maintained >99% data accuracy while tripling daily request handling capacity with the existing operational team.",
      educationHeading: "Academic Foundation",
      institution: "Tarumanagara University (Untar)",
      degree: "Bachelor of Informatics Engineering (S.Kom)",
      gpaLabel: "Cumulative GPA",
      gpaValue: "3.89 / 4.00",
      honors: "Graduated with High Distinction (Top Percentile)",
      period: "2021 – 2024",
      courseworkHeading: "Core Competencies & Coursework"
    },
    experience: {
      title: "Professional Experience",
      subtitle: "Proven enterprise impact across 5 Master Data domains at Kawan Lama Group, backed by academic leadership at Tarumanagara University",
      fulltimeBadge: "Full-time",
      internBadge: "Internship",
      bestInternBadge: "Awarded Best Intern (Certificate of Excellence)",
      viewCertificate: "View Credential",
      domainExplorerTitle: "Governed Enterprise Domains",
      domainExplorerSubtitle: "Master data governance across 5 core enterprise domains at Kawan Lama Group",
      keyAchievements: "Quantified Operational Impact",
      domains: {
        site: {
          name: "Site",
          label: "Store & Branch Topology",
          description: "Location hierarchy, store metadata governance, and opening/renovation lifecycle tracking.",
          metrics: "100% store hierarchy integrity"
        },
        vendor: {
          name: "Vendor",
          label: "Supplier & Partner Master",
          description: "Onboarding compliance, tax verification, banking details, and payment terms synchronization.",
          metrics: "Zero duplicate vendor entries"
        },
        customer: {
          name: "Customer",
          label: "B2B & Retail Client Graph",
          description: "Entity deduplication, credit limit parameters, national identity and branch relationship mapping.",
          metrics: ">99% customer record completeness"
        },
        article: {
          name: "Article",
          label: "SKU Catalog & Merchandise",
          description: "Product classification hierarchy, barcode validation, tariff codes, and unit conversion formulas.",
          metrics: "Automated classification for 10k+ SKUs"
        },
        finance: {
          name: "Finance",
          label: "Cost Centers & General Ledger",
          description: "GL account validation, cost-center routing, and financial statement aggregation hierarchies.",
          metrics: "Audit-ready reconciliation"
        }
      }
    },
    projects: {
      title: "Featured Engineering Projects",
      subtitle: "Production-grade AI systems, automated validation engines, and analytics pipelines built for measurable operational impact",
      filterAll: "All Projects",
      filterAI: "AI & Autonomous Systems",
      filterData: "Data & Analytics",
      filterAutomation: "Enterprise Automation",
      previewTab: "UI Preview",
      howItWorksTab: "How It Works",
      expandPreview: "Expand Preview",
      closePreview: "Close Preview",
      recordingLabel: "LIVE CAPTURE",
      architectureFlow: "Execution Pipeline",
      highlightsTitle: "Architectural Highlights",
      viewRepo: "Source Code",
      viewLive: "Live Demo",
      stars: "stars",
      forks: "forks",
      liveVerified: "Live Production",
      productionReady: "Production Grade",
      verifiedBadge: "Architecture",
      technicalIndicator: "Technical Indicator",
      verifiedArchitecture: "System Architecture"
    },
    skills: {
      title: "Technical Skills & Competencies",
      subtitle: "Production-tested tools and technologies across SQL & BI analytics, zero-error workflow automation, and grounded LLM systems",
      categories: {
        dataWarehousing: "Data Warehousing & Analytics Infrastructure",
        dataWarehousingDesc: "Master data governance, SQL data profiling, Looker BI dashboards, spreadsheet modeling, and auditable data reconciliation.",
        aiSystems: "AI & Autonomous LLM Systems",
        aiSystemsDesc: "LangGraph.js stateful multi-agent workflows, ChromaDB vector retrieval, Redis caching, Gemini API integration, and AST security audit gates.",
        enterpriseAutomation: "Enterprise Automation & Integration",
        enterpriseAutomationDesc: "Google Apps Script automation, SAP GUI RPA scripting, structured Google Workspace intake pipelines, and automated SLA tracking.",
        frontendTooling: "Frontend Engineering & Tooling",
        frontendToolingDesc: "React 19, TypeScript, Next.js App Router, Tailwind CSS 4, Zod schema validation, and Git CI/CD workflows."
      }
    },
    certifications: {
      title: "Awards & Certifications",
      subtitle: "80+ verified industry credentials across AI Engineering, Cloud Data Infrastructure, and Corporate Operational Excellence",
      verify: "Verify Credential",
      issuer: "Issuer",
      browseAll: "Browse All {count}",
      viewOnLinkedIn: "View All on LinkedIn",
      directoryTitle: "All Certifications & Credentials",
      directorySubtitle: "Complete verified catalog of {count} industry credentials",
      searchPlaceholder: "Search by title, issuer, credential ID, or date...",
      clearSearch: "Clear search query",
      filterAll: "All",
      filterOther: "Other",
      filterGoogle: "Google",
      filterAnthropic: "Anthropic",
      filterIBM: "IBM",
      filterDeepLearning: "DeepLearning.AI",
      filterDicoding: "Dicoding Indonesia",
      resultsCount: "Showing {showing} of {total} credentials",
      noResultsTitle: "No Credentials Found",
      noResultsSubtitle: "No credentials match your filter criteria.",
      resetFilters: "Reset Filters",
      prevPage: "Previous page",
      nextPage: "Next page",
      pageIndicator: "Page {current} of {total}",
      closeDirectory: "Close certifications directory",
      credentialId: "Credential ID",
      opensInNewTab: "(opens in new tab)"
    },
    contact: {
      title: "Get In Touch",
      subtitle: "Hiring for Data, Automation, or Applied AI roles? Send your role or project scope below for a direct response within 24 hours.",
      nameLabel: "Your Name",
      namePlaceholder: "e.g. Alexander Hamilton",
      emailLabel: "Work Email",
      emailPlaceholder: "alexander@organization.com",
      messageLabel: "Project Scope or Role Specification",
      messagePlaceholder: "Describe your project timeline, requirements, or role specification...",
      recaptchaNotice: "Protected by Google reCAPTCHA. Privacy Policy applies.",
      submitButton: "Send Message",
      submittingButton: "Sending...",
      successTitle: "Message Sent Successfully",
      successMessage: "Thank you for reaching out. I typically respond within 24 business hours.",
      errorTitle: "Message Delivery Failed",
      errorMessage: "Unable to deliver message at this time. Please reach out directly to wiliamzwili135@gmail.com.",
      validation: {
        nameMin: "Name must be at least 2 characters",
        nameRequired: "Name is required",
        emailInvalid: "Please enter a valid email address",
        emailRequired: "Email is required",
        messageMin: "Message must be at least 10 characters",
        messageRequired: "Message is required",
        recaptchaRequired: "Please complete the reCAPTCHA verification"
      }
    },
    footer: {
      rights: "All rights reserved.",
      builtWith: "React 19 • Vite • Tailwind CSS v4",
      backToTop: "Back to top"
    }
  },
  id: {
    nav: {
      home: "Beranda",
      about: "Tentang",
      experience: "Pengalaman",
      projects: "Proyek",
      skills: "Keahlian",
      certifications: "Penghargaan",
      contact: "Kontak",
      theme: "Tema",
      language: "Bahasa",
      status: "Terbuka untuk Peran Data, Otomasi & AI",
      backToTop: "Kembali ke Atas"
    },
    hero: {
      greeting: "Halo, saya",
      name: "William",
      role: "Data & Automation Analyst",
      badge: "Tata Kelola Data & Otomasi Alur Kerja",
      tagline: "Mengubah operasional enterprise bervolume tinggi menjadi pipeline otomatis yang terkendali: menjaga presisi data >99%, percepatan SLA 30%, dan kapasitas 3x lipat tanpa tambahan staf.",
      ctaContact: "Hubungi Saya",
      ctaProjects: "Lihat Proyek",
      chips: {
        education: "Teknik Informatika Untar • IPK 3.89",
        experience: "Kawan Lama Group • MDM Officer",
        location: "Jakarta, Indonesia",
        bestIntern: "Penerima Best Intern"
      },
      telemetry: {
        accuracyLabel: "Akurasi Master Data",
        accuracyValue: ">99.0%",
        accuracyDetail: "Di 5 domain utama enterprise yang terkelola",
        slaLabel: "Efisiensi SLA",
        slaValue: "+30%",
        slaDetail: "Standarisasi formulir intake & skrip pra-validasi",
        automationLabel: "Tugas Terotomasi",
        automationValue: "~70%",
        automationDetail: "Otomasi Google Apps Script & RPA SAP GUI",
        capacityLabel: "Kapasitas Penanganan",
        capacityValue: "3x",
        capacityDetail: "Volume harian meningkat tanpa penambahan staf"
      }
    },
    about: {
      title: "Tentang Saya",
      subtitle: "Memadukan ketelitian Teknik Informatika (IPK 3.89) dengan Master Data Management berskala korporat, RPA SAP, dan alur kerja AI produksi",
      bioParagraph1: "Saya adalah Data & Automation Analyst dengan 2 tahun pengalaman korporat dalam tata kelola master data enterprise, otomasi alur kerja, dan analitik operasional di Kawan Lama Group. Lulusan S1 Teknik Informatika Universitas Tarumanagara tahun 2024 (IPK 3.89, lulus dengan Pujian Tertinggi), saya memadukan disiplin tata kelola data (skrip Google Workspace, Looker, SQL, otomasi SAP GUI) dengan rekayasa sistem AI terapan (LangGraph.js, ChromaDB, Gemini API) untuk membangun sistem yang andal dan siap diaudit.",
      bioParagraph2: "Di 5 domain utama enterprise (Site, Vendor, Customer, Article, Finance), saya mempercepat turnaround SLA master data sebesar 30%, mengotomasi ~70% tugas intake dan validasi repetitif melalui Google Apps Script dan skrip SAP GUI, serta menjaga akurasi data di atas 99% sekaligus meningkatkan kapasitas penanganan harian hingga 3x lipat bersama tim operasional yang ada.",
      educationHeading: "Fondasi Akademik",
      institution: "Universitas Tarumanagara (Untar)",
      degree: "Sarjana Komputer (S.Kom) - Teknik Informatika",
      gpaLabel: "IPK Kumulatif",
      gpaValue: "3.89 / 4.00",
      honors: "Lulus dengan Pujian Tertinggi (Persentil Teratas)",
      period: "2021 – 2024",
      courseworkHeading: "Kompetensi Utama & Mata Kuliah"
    },
    experience: {
      title: "Pengalaman Profesional",
      subtitle: "Dampak nyata di 5 domain Master Data Kawan Lama Group, didukung rekam jejak kepemimpinan akademik di Universitas Tarumanagara",
      fulltimeBadge: "Purnawaktu",
      internBadge: "Magang",
      bestInternBadge: "Penghargaan Best Intern (Certificate of Excellence)",
      viewCertificate: "Lihat Kredensial",
      domainExplorerTitle: "Domain Enterprise Terkelola",
      domainExplorerSubtitle: "Tata kelola master data di 5 domain utama enterprise di Kawan Lama Group",
      keyAchievements: "Dampak Operasional Terukur",
      domains: {
        site: {
          name: "Site",
          label: "Topologi Toko & Cabang",
          description: "Hierarki lokasi, tata kelola metadata toko, dan pelacakan siklus pembukaan/renovasi.",
          metrics: "100% integritas hierarki toko"
        },
        vendor: {
          name: "Vendor",
          label: "Master Vendor & Mitra",
          description: "Kepatuhan orientasi pemasok, verifikasi pajak, rekening bank, dan sinkronisasi syarat bayar.",
          metrics: "Nol duplikasi entri vendor"
        },
        customer: {
          name: "Customer",
          label: "Graf Klien B2B & Ritel",
          description: "Deduplikasi entitas, parameter limit kredit, serta pemetaan identitas dan relasi cabang.",
          metrics: ">99% kelengkapan data pelanggan"
        },
        article: {
          name: "Article",
          label: "Katalog SKU & Barang",
          description: "Hierarki klasifikasi produk, validasi barcode, kode tarif bea cukai, dan konversi satuan.",
          metrics: "Otomasi klasifikasi untuk 10k+ SKU"
        },
        finance: {
          name: "Finance",
          label: "Pusat Biaya & Buku Besar",
          description: "Validasi akun GL, perutean pusat biaya, dan hierarki konsolidasi laporan keuangan.",
          metrics: "Rekonsiliasi siap audit"
        }
      }
    },
    projects: {
      title: "Proyek Rekayasa Unggulan",
      subtitle: "Sistem AI kelas produksi, mesin validasi otomatis, dan pipeline analitik yang dirancang untuk dampak operasional terukur",
      filterAll: "Semua Proyek",
      filterAI: "AI & Sistem Otonom",
      filterData: "Data & Analisis",
      filterAutomation: "Otomasi Enterprise",
      previewTab: "Pratinjau UI",
      howItWorksTab: "Cara Kerja",
      expandPreview: "Perbesar Pratinjau",
      closePreview: "Tutup Pratinjau",
      recordingLabel: "REKAMAN ASLI",
      architectureFlow: "Alur Eksekusi",
      highlightsTitle: "Sorotan Arsitektur",
      viewRepo: "Kode Sumber",
      viewLive: "Demo Langsung",
      stars: "bintang",
      forks: "fork",
      liveVerified: "Produksi Live",
      productionReady: "Standar Produksi",
      verifiedBadge: "Arsitektur",
      technicalIndicator: "Indikator Teknis",
      verifiedArchitecture: "Arsitektur Sistem"
    },
    skills: {
      title: "Keahlian Teknis & Kompetensi",
      subtitle: "Stack teruji produksi di bidang analitik SQL & BI, otomasi alur kerja bebas kesalahan, dan sistem LLM terverifikasi",
      categories: {
        dataWarehousing: "Data Warehousing & Analisis",
        dataWarehousingDesc: "Tata kelola master data, pemodelan data SQL, dashboard Looker BI, pemodelan spreadsheet, dan rekonsiliasi data siap audit.",
        aiSystems: "AI & Sistem LLM Otonom",
        aiSystemsDesc: "Alur kerja multi-agen berbasis status LangGraph.js, retrieval vektor ChromaDB, caching Redis, integrasi Gemini API, dan gerbang audit keamanan AST.",
        enterpriseAutomation: "Otomasi & Integrasi Enterprise",
        enterpriseAutomationDesc: "Otomasi Google Apps Script, skrip RPA SAP GUI, pipeline intake Google Workspace terstruktur, dan pelacakan SLA otomatis.",
        frontendTooling: "Rekayasa Frontend & Tooling",
        frontendToolingDesc: "React 19, TypeScript, Next.js App Router, Tailwind CSS 4, validasi skema Zod, serta otomasi CI/CD & alur kerja Git."
      }
    },
    certifications: {
      title: "Penghargaan & Sertifikasi",
      subtitle: "80+ kredensial industri terverifikasi di bidang Rekayasa AI, Infrastruktur Data Cloud, dan Keunggulan Operasional Korporat",
      verify: "Verifikasi Kredensial",
      issuer: "Penerbit",
      browseAll: "Lihat Semua {count}",
      viewOnLinkedIn: "Lihat Semua di LinkedIn",
      directoryTitle: "Semua Sertifikasi & Kredensial",
      directorySubtitle: "Katalog lengkap {count} kredensial industri terverifikasi",
      searchPlaceholder: "Cari berdasarkan judul, penerbit, ID kredensial, atau tanggal...",
      clearSearch: "Hapus pencarian",
      filterAll: "Semua",
      filterOther: "Lainnya",
      filterGoogle: "Google",
      filterAnthropic: "Anthropic",
      filterIBM: "IBM",
      filterDeepLearning: "DeepLearning.AI",
      filterDicoding: "Dicoding Indonesia",
      resultsCount: "Menampilkan {showing} dari {total} kredensial",
      noResultsTitle: "Kredensial Tidak Ditemukan",
      noResultsSubtitle: "Tidak ada kredensial yang cocok dengan kriteria pencarian.",
      resetFilters: "Atur Ulang Filter",
      prevPage: "Halaman sebelumnya",
      nextPage: "Halaman berikutnya",
      pageIndicator: "Halaman {current} dari {total}",
      closeDirectory: "Tutup direktori sertifikasi",
      credentialId: "ID Kredensial",
      opensInNewTab: "(buka di tab baru)"
    },
    contact: {
      title: "Hubungi Saya",
      subtitle: "Merekrut untuk posisi Data, Otomasi, atau AI Terapan? Kirimkan detail peran atau proyek Anda di bawah ini untuk respons langsung dalam 24 jam.",
      nameLabel: "Nama Lengkap",
      namePlaceholder: "contoh: Alexander Hamilton",
      emailLabel: "Email Kerja",
      emailPlaceholder: "alexander@perusahaan.com",
      messageLabel: "Cakupan Proyek atau Spesifikasi Peran",
      messagePlaceholder: "Jelaskan linimasa proyek, kebutuhan, atau spesifikasi peran...",
      recaptchaNotice: "Dilindungi oleh Google reCAPTCHA. Kebijakan Privasi berlaku.",
      submitButton: "Kirim Pesan",
      submittingButton: "Mengirim...",
      successTitle: "Pesan Berhasil Terkirim",
      successMessage: "Terima kasih telah menghubungi. Saya biasanya membalas dalam waktu 24 jam kerja.",
      errorTitle: "Pengiriman Pesan Gagal",
      errorMessage: "Tidak dapat mengirim pesan saat ini. Silakan hubungi langsung ke wiliamzwili135@gmail.com.",
      validation: {
        nameMin: "Nama minimal 2 karakter",
        nameRequired: "Nama wajib diisi",
        emailInvalid: "Silakan masukkan alamat email yang valid",
        emailRequired: "Email wajib diisi",
        messageMin: "Pesan minimal 10 karakter",
        messageRequired: "Pesan wajib diisi",
        recaptchaRequired: "Silakan selesaikan verifikasi reCAPTCHA"
      }
    },
    footer: {
      rights: "Hak cipta dilindungi.",
      builtWith: "React 19 • Vite • Tailwind CSS v4",
      backToTop: "Kembali ke atas"
    }
  }
};

/**
 * Safely resolves a nested dot-path within an object without prototype leakage.
 * @param {object} obj
 * @param {string[]} pathKeys
 * @returns {any}
 */
function resolvePath(obj, pathKeys) {
  return pathKeys.reduce((acc, key) => {
    if (acc && typeof acc === 'object' && Object.hasOwn(acc, key)) {
      return acc[key];
    }
    return undefined;
  }, obj);
}

/**
 * Resolves translation by nested dot-path with optional parameter substitution and fallback.
 * @param {string} keyPath - e.g. "hero.greeting"
 * @param {string} [locale='en'] - 'en' or 'id'
 * @param {Record<string, string|number>} [params={}] - e.g. { count: 5 }
 * @returns {any}
 */
export function getTranslation(keyPath, locale = DEFAULT_LOCALE, params = {}) {
  if (!keyPath || typeof keyPath !== 'string') {
    return '';
  }

  const currentLocale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const keys = keyPath.split('.');
  
  let value = resolvePath(translations[currentLocale], keys);
  
  // Fallback to default locale if not found in current locale
  if (value === undefined && currentLocale !== DEFAULT_LOCALE) {
    value = resolvePath(translations[DEFAULT_LOCALE], keys);
  }
  
  if (value === undefined) {
    return keyPath;
  }
  
  const safeParams = params && typeof params === 'object' ? params : null;
  if (typeof value === 'string' && safeParams) {
    const entries = Object.entries(safeParams);
    if (entries.length > 0) {
      return entries.reduce(
        (str, [k, v]) => str.replaceAll(`{${k}}`, () => String(v)),
        value
      );
    }
  }
  
  return value;
}

export const I18nContext = createContext({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  toggleLocale: () => {},
  t: (keyPath) => (typeof keyPath === 'string' ? keyPath : ''),
  dictionary: translations[DEFAULT_LOCALE],
  isIndonesian: false,
});

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('portfolio_locale');
        if (saved && SUPPORTED_LOCALES.includes(saved)) return saved;
        if (navigator.language && navigator.language.toLowerCase().startsWith('id')) return 'id';
      } catch {
        // Safe fallback in restricted environments
      }
    }
    return DEFAULT_LOCALE;
  });

  const setLocale = useCallback((newLocale) => {
    setLocaleState((prev) => {
      const resolvedLocale = typeof newLocale === 'function' ? newLocale(prev) : newLocale;
      if (SUPPORTED_LOCALES.includes(resolvedLocale)) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('portfolio_locale', resolvedLocale);
          } catch {
            // Safe fallback in restricted environments
          }
        }
        return resolvedLocale;
      }
      return prev;
    });
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === 'en' ? 'id' : 'en'));
  }, [setLocale]);

  const t = useCallback((keyPath, params) => {
    return getTranslation(keyPath, locale, params);
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    toggleLocale,
    t,
    dictionary: translations[locale] || translations[DEFAULT_LOCALE],
    isIndonesian: locale === 'id'
  }), [locale, setLocale, toggleLocale, t]);

  return React.createElement(I18nContext.Provider, { value }, children);
}

export function useI18n() {
  return useContext(I18nContext);
}
