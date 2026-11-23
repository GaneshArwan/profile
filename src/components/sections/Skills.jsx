import React from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { GlossyText } from '../ui/GlossyText';
import { BackgroundOverlay } from '../ui/BackgroundOverlay';
import { useBackgroundImage } from '../../hooks/useBackgroundImage';
import { SKILL_CATEGORIES, LOCAL_BACKGROUNDS, REMOTE_BACKGROUNDS } from '../../data/constants';
import { useI18n } from '../../lib/i18n';
import { Database, Bot, Cpu, Layout } from 'lucide-react';

const CATEGORY_ICONS = {
  0: Database,
  1: Bot,
  2: Cpu,
  3: Layout,
};

const SKILL_ICONS = {
  "Google BigQuery": "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg",
  "SQL & Query Optimization": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  "Looker & BI Dashboards": "https://img.icons8.com/color/48/000000/google-logo.png",
  "ETL & Data Pipelines": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  "Python (Pandas / NumPy)": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  "Scikit-Learn": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  "LangGraph.js & Multi-Agent State": "https://avatars.githubusercontent.com/u/126733545?s=200&v=4",
  "ChromaDB & Vector Storage": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  "Google Gemini 3 Flash / 1.5": "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg",
  "LangChain (LCEL)": "https://avatars.githubusercontent.com/u/126733545?s=200&v=4",
  "Prompt Architecture & Guardrails": "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg",
  "Redis & Hash Caching": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
  "Google Apps Script": "https://img.icons8.com/color/48/000000/google-logo.png",
  "SAP GUI RPA & Scripting": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
  "Distributed Key-Locking": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
  "Master Data Governance": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  "REST APIs & Webhooks": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  "React 19 & Next.js 15/16": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "TypeScript": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  "Tailwind CSS v4": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  "Zod Schema Validation": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  "Git & CI/CD Pipelines": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
};

const CATEGORY_I18N_KEYS = [
  { title: 'skills.categories.dataWarehousing', desc: 'skills.categories.dataWarehousingDesc' },
  { title: 'skills.categories.aiSystems', desc: 'skills.categories.aiSystemsDesc' },
  { title: 'skills.categories.enterpriseAutomation', desc: 'skills.categories.enterpriseAutomationDesc' },
  { title: 'skills.categories.frontendTooling', desc: 'skills.categories.frontendToolingDesc' },
];

const CATEGORY_THEMES = {
  0: {
    tier: "DOMINANT TIER // INFRASTRUCTURE",
    tierBadge: "text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border-teal-200/60 dark:border-teal-800/60",
    iconBox: "bg-teal-700/10 dark:bg-teal-400/10 text-teal-800 dark:text-teal-300 border-teal-700/20 dark:border-teal-400/20",
    cardHover: "hover:border-teal-700/40 dark:hover:border-teal-400/40",
    itemHover: "hover:border-teal-700/30 dark:hover:border-teal-400/30",
    advancedBadge: "bg-teal-700/10 text-teal-800 dark:text-teal-300 border-teal-700/20 dark:border-teal-400/20",
    proficientBadge: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
  },
  1: {
    tier: "SUPPORTING TIER // INTELLIGENCE",
    tierBadge: "text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/60",
    iconBox: "bg-emerald-700/10 dark:bg-emerald-400/10 text-emerald-800 dark:text-emerald-300 border-emerald-700/20 dark:border-emerald-400/20",
    cardHover: "hover:border-emerald-700/40 dark:hover:border-emerald-400/40",
    itemHover: "hover:border-emerald-700/30 dark:hover:border-emerald-400/30",
    advancedBadge: "bg-emerald-700/10 text-emerald-800 dark:text-emerald-300 border-emerald-700/20 dark:border-emerald-400/20",
    proficientBadge: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
  },
  2: {
    tier: "DOMINANT TIER // AUTOMATION",
    tierBadge: "text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/60",
    iconBox: "bg-emerald-700/10 dark:bg-emerald-400/10 text-emerald-800 dark:text-emerald-300 border-emerald-700/20 dark:border-emerald-400/20",
    cardHover: "hover:border-emerald-700/40 dark:hover:border-emerald-400/40",
    itemHover: "hover:border-emerald-700/30 dark:hover:border-emerald-400/30",
    advancedBadge: "bg-emerald-700/10 text-emerald-800 dark:text-emerald-300 border-emerald-700/20 dark:border-emerald-400/20",
    proficientBadge: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
  },
  3: {
    tier: "SUPPORTING TIER // INTERFACES",
    tierBadge: "text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 border-slate-300/60 dark:border-slate-700/60",
    iconBox: "bg-slate-200/60 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300/60 dark:border-slate-700/60",
    cardHover: "hover:border-teal-700/40 dark:hover:border-teal-400/40",
    itemHover: "hover:border-teal-700/30 dark:hover:border-teal-400/30",
    advancedBadge: "bg-teal-700/10 text-teal-800 dark:text-teal-300 border-teal-700/20 dark:border-teal-400/20",
    proficientBadge: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
  }
};

export const Skills = () => {
  const { t } = useI18n();
  const bgImage = useBackgroundImage(LOCAL_BACKGROUNDS.skills, REMOTE_BACKGROUNDS.skills);

  return (
    <section id="skills" className="py-20 pt-28 relative transition-colors duration-300 scroll-mt-24 bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 dark:opacity-10"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-slate-50/95 dark:bg-slate-950/95" />
        <BackgroundOverlay />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader 
          title={<GlossyText>{t('skills.title') || 'Technical Skills & Competencies'}</GlossyText>} 
          subtitle={t('skills.subtitle') || 'Tools and technologies across data warehousing, AI systems, enterprise automation, and frontend engineering.'} 
        />

        {/* 4-Category Operational Dev-Tool Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {SKILL_CATEGORIES.map((cat, catIdx) => {
            const CategoryIcon = CATEGORY_ICONS[catIdx] || Database;
            const categoryTitle = t(CATEGORY_I18N_KEYS[catIdx]?.title) || cat.category;
            const categoryDesc = t(CATEGORY_I18N_KEYS[catIdx]?.desc) || cat.description;
            const theme = CATEGORY_THEMES[catIdx] || CATEGORY_THEMES[0];
            return (
              <div
                key={catIdx}
                className={`rounded-2xl border border-slate-200/90 dark:border-hairline bg-white/90 dark:bg-surface-forest p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 ${theme.cardHover} flex flex-col justify-between`}
              >
                <div>
                  {/* Operational Tier Label */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${theme.tierBadge}`}>
                      {theme.tier}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {cat.skills.length} TECHNOLOGIES
                    </span>
                  </div>

                  {/* Category Header */}
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className={`p-2.5 rounded-xl border ${theme.iconBox}`}>
                      <CategoryIcon size={22} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        {categoryTitle}
                      </h3>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 font-normal">
                    {categoryDesc}
                  </p>

                  {/* Skills Items in this Category */}
                  <div className="space-y-3">
                    {cat.skills.map((skill, sIdx) => {
                      const iconSrc = SKILL_ICONS[skill.name] || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg';
                      const isAdvanced = skill.level === 'Advanced';
                      return (
                        <div
                          key={sIdx}
                          className={`flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-surface-obsidian border border-slate-200/70 dark:border-slate-800/70 ${theme.itemHover} transition-colors group`}
                        >
                          <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 p-1.5 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs">
                            <img
                              src={iconSrc}
                              alt={skill.name}
                              className="w-full h-full object-contain"
                              loading="lazy"
                              onError={(e) => {
                                // Fallback: replace with generic devicon without throwing or breaking layout
                                if (e.currentTarget.src !== 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg') {
                                  e.currentTarget.src = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg';
                                }
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                {skill.name}
                              </h4>
                              {skill.level && (
                                <span
                                  className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border shrink-0 ${
                                    isAdvanced ? theme.advancedBadge : theme.proficientBadge
                                  }`}
                                >
                                  [{skill.level}]
                                </span>
                              )}
                            </div>
                            {skill.context && (
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                {skill.context}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
