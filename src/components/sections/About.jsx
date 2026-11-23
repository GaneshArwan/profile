import React from 'react';
import { 
  GraduationCap, 
  Award, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu 
} from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { GlossyText } from '../ui/GlossyText';
import { BackgroundOverlay } from '../ui/BackgroundOverlay';
import { useBackgroundImage } from '../../hooks/useBackgroundImage';
import { PERSONAL_INFO, LOCAL_BACKGROUNDS, REMOTE_BACKGROUNDS } from '../../data/constants';
import { useI18n } from '../../lib/i18n';

export const About = () => {
  const { t, isIndonesian } = useI18n();
  const bgImage = useBackgroundImage(LOCAL_BACKGROUNDS.about, REMOTE_BACKGROUNDS.about);
  const education = PERSONAL_INFO.education?.[0];

  const doctrinePillars = [
    {
      id: 'staging',
      code: '[01 STAGING]',
      title: isIndonesian ? "Staging Terkelola & Validasi Awal" : "Auditable Staging & Ingestion",
      desc: isIndonesian
        ? "Google Sheets & Apps Script sebagai penampung pra-validasi (regex, NPWP, relasi cabang) mencegah anomali master data masuk ke ERP."
        : "Google Sheets & Apps Script pre-validation staging layers enforce regex, tax IDs, and site hierarchies before ERP ingestion.",
      icon: ShieldCheck,
      badgeColor: "text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border-teal-200/60 dark:border-teal-800/60"
    },
    {
      id: 'rpa',
      code: '[02 RPA EXEC]',
      title: isIndonesian ? "Eksekusi Otomasi RPA SAP" : "SAP GUI Scripting & RPA",
      desc: isIndonesian
        ? "Skrip deterministik SAP GUI VBScript mengotomasi pemeliharaan massal, memangkas ~70% beban repetitif dan menurunkan galat input manusia."
        : "Deterministic SAP GUI VBScript automation cuts ~70% repetitive transactional entry across Site, Vendor, and Customer domains.",
      icon: Cpu,
      badgeColor: "text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/60"
    },
    {
      id: 'ai',
      code: '[03 APPLIED AI]',
      title: isIndonesian ? "Augmentasi Workflow Berbasis AI" : "Applied AI Workflow Augmentation",
      desc: isIndonesian
        ? "Stateful agent LangGraph dan model Gemini mendukung pencocokan entitas kompleks serta rekomendasi semi-otonom human-in-the-loop."
        : "Stateful LangGraph graphs and Gemini models augment complex entity deduplication and human-in-the-loop decision workflows.",
      icon: CheckCircle2,
      badgeColor: "text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/60"
    }
  ];

  return (
    <section id="about" className="py-20 relative transition-colors duration-300 scroll-mt-20 bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgImage})` }} />
        <div className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/90" />
        <BackgroundOverlay />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-10">
        <SectionHeader 
          title={<GlossyText>{t('about.title') || 'About Me'}</GlossyText>} 
          subtitle={t('about.subtitle') || 'Data Governance, Workflow Automation & Applied AI Engineering'}
        />

        {/* 3-Cell Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Cell 1 (7 cols on lg): Narrative Biography & Philosophy (william_profile.ts) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl bg-white/90 dark:bg-surface-forest p-7 md:p-9 border border-slate-200/90 dark:border-hairline shadow-md backdrop-blur-xs">
            <div>
              {/* Engineering Overview Header */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200/80 dark:border-emerald-950/60">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                    {isIndonesian ? "Profil & Rekayasa Sistem" : "Engineering Profile & Background"}
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-emerald-700/20 dark:border-emerald-400/20 bg-emerald-700/10 dark:bg-emerald-400/10 text-emerald-800 dark:text-emerald-300 font-bold">
                  OVERVIEW
                </span>
              </div>

              {/* Narrative Content */}
              <div className="text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed space-y-4 font-normal text-left md:text-justify">
                <p>
                  {t('about.bioParagraph1') || PERSONAL_INFO.about.split('\n\n')[0]}
                </p>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
                  {t('about.bioParagraph2') || PERSONAL_INFO.about.split('\n\n')[1]}
                </p>
              </div>

              {/* Target Role Alignment & Day-1 Value Matrix */}
              <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-emerald-950/60">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                    {isIndonesian ? "Kesiapan Peran Hari Pertama" : "Day-1 Target Role Alignment"}
                  </span>
                  <span className="font-mono text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    {isIndonesian ? "3 JALUR UTAMA" : "3 ROLE TRACKS"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50/90 dark:bg-surface-obsidian border border-slate-200/80 dark:border-slate-800/80">
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 dark:text-emerald-400 block mb-1">
                      [ROLE 01]
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                      Data & BI Analyst
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      {isIndonesian
                        ? "Pipeline SQL & Python, KPI/SLA dashboard, dan model churn prediktif."
                        : "SQL & Python pipelines, executive KPI/SLA tracking, and predictive churn modeling."}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50/90 dark:bg-surface-obsidian border border-slate-200/80 dark:border-slate-800/80">
                    <span className="text-[10px] font-mono font-bold uppercase text-teal-800 dark:text-teal-300 block mb-1">
                      [ROLE 02]
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                      {isIndonesian ? "Otomasi & Spesialis MDM" : "Automation & MDM Specialist"}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      {isIndonesian
                        ? "Skrip SAP GUI & RPA web dengan standar tata kelola lintas domain (>99% akurasi)."
                        : "SAP GUI VBScript & web RPA with multi-domain governance (>99% data accuracy)."}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50/90 dark:bg-surface-obsidian border border-slate-200/80 dark:border-slate-800/80">
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 dark:text-emerald-400 block mb-1">
                      [ROLE 03]
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                      Applied AI Engineer
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      {isIndonesian
                        ? "Arsitektur RAG hybrid, agen stateful LangGraph, dan orkestrasi SQL mandiri."
                        : "Hybrid RAG pipelines, stateful LangGraph agents, and self-healing SQL workflows."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Principle Sub-Panel */}
            <div className="mt-8 pt-4 border-t border-slate-200/80 dark:border-emerald-950/60">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-obsidian border border-slate-200/80 dark:border-slate-800/80 font-mono text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 dark:bg-emerald-400" aria-hidden="true" />
                  <span>// System Architecture Doctrine:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  "Reliable enterprise analytics requires clean data at the source. Standardize intake with auditable staging, eliminate friction through deterministic RPA, and augment knowledge workflows with verifiable applied AI."
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Cell 2 (Academic Foundation) + Cell 3 (Data Governance Doctrine) (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Cell 2: Academic Foundation (Untar S1 Informatics GPA 3.89) */}
            {education && (
              <div className="rounded-3xl bg-white/90 dark:bg-surface-forest p-6 sm:p-7 border border-slate-200/90 dark:border-hairline shadow-md backdrop-blur-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 pb-5 border-b border-slate-200/80 dark:border-emerald-950/60">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 shrink-0">
                        <GraduationCap size={22} aria-hidden="true" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                          {t('about.educationHeading') || 'Academic Foundation'}
                        </span>
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                          {t('about.institution') || education.institution}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-medium">
                          {t('about.degree') || education.degree}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold">
                      <Award size={13} aria-hidden="true" />
                      <span>{t('about.gpaLabel') || 'GPA'}: {t('about.gpaValue') || education.gpa}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-surface-obsidian border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold">
                      <Calendar size={13} aria-hidden="true" />
                      <span>{t('about.period') || education.period}</span>
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex items-center gap-1.5 mb-2.5 text-xs font-mono font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                      <BookOpen size={13} aria-hidden="true" />
                      <span>{t('about.courseworkHeading') || 'Core Competencies & Coursework'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {education.relevantCourses?.map((course, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-surface-obsidian px-2.5 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-800"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                    {education.honors && (
                      <p className="mt-3.5 text-xs font-mono font-semibold text-amber-800 dark:text-amber-400">
                        ★ {t('about.honors') || education.honors}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Cell 3: Data Governance & Automation Doctrine */}
            <div className="rounded-3xl bg-white/90 dark:bg-surface-forest p-6 sm:p-7 border border-slate-200/90 dark:border-hairline shadow-md backdrop-blur-xs flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/80 dark:border-emerald-950/60">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                      {isIndonesian ? "Doktrin Tata Kelola & Otomasi" : "Data Governance & Automation Doctrine"}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-teal-700/20 dark:border-teal-400/20 bg-teal-700/10 dark:bg-teal-400/10 text-teal-800 dark:text-teal-300 font-bold">
                    3 PILLARS
                  </span>
                </div>

                <div className="space-y-3">
                  {doctrinePillars.map((pillar) => {
                    const PillarIcon = pillar.icon;
                    return (
                      <div
                        key={pillar.id}
                        className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-surface-obsidian hover:border-emerald-700/40 dark:hover:border-emerald-400/40 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <PillarIcon size={14} className="text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {pillar.title}
                            </h4>
                          </div>
                          <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border shrink-0 ${pillar.badgeColor}`}>
                            {pillar.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                          {pillar.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
