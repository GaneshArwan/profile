import React from 'react';

export const PERSONAL_INFO = {
  name: "William",
  role: "Data Analyst | AI/ML Engineer | Data Scientist",
  about: `I'm building my career in Data Analysis, Data Science, and AI/ML Engineering, supported by hands-on experience in data automation, workflow optimization, and master data governance at Kawan Lama Group. Through my internship and current role, I’ve strengthened my abilities in improving data quality, automating processes, and turning operational data into clearer insights. I stay focused on the skills that represent my professional direction—data, automation, and problem-solving—and I aim to continue growing into roles in data analysis, data science, and AI/ML engineering.`,
  location: "Jakarta, Indonesia",
  email: "wiliamzwili135@gmail.com", 
  linkedin: "https://www.linkedin.com/in/william-oo00",
  github: "https://github.com/GaneshArwan",
};

export const REMOTE_BACKGROUNDS = {
  hero: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop", 
  about: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop", 
  skills: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", 
  experience: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop", 
  projects: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop", 
  certifications: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop", 
  contact: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=2071&auto=format&fit=crop" 
};

export const LOCAL_BACKGROUNDS = {
  hero: "/assets/hero.jpg",
  about: "/assets/about.jpg",
  skills: "/assets/skills.jpg",
  experience: "/assets/experience.jpg",
  projects: "/assets/projects.jpg",
  certifications: "/assets/certifications.jpg",
  contact: "/assets/contact.jpg"
};

export const HERO_VIDEOS = {
  light: "/assets/hero-light.mp4",
  dark: "/assets/hero-dark.mp4"
};

const getIconUrl = (name) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-original.svg`;

export const SKILLS = [
  { name: "Python", image: getIconUrl("python"), category: "Language" },
  { name: "TypeScript", image: getIconUrl("typescript"), category: "Language" },
  { name: "SQL", image: getIconUrl("mysql"), category: "Language" },
  { name: "Machine Learning", image: getIconUrl("tensorflow"), category: "AI" },
  { name: "Generative AI", image: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg", category: "AI" },
  { name: "LangChain", image: "https://avatars.githubusercontent.com/u/126733545?s=200&v=4", category: "AI" },
  { name: "Next.js", image: getIconUrl("nextjs"), category: "Framework" },
  { name: "Pandas", image: getIconUrl("pandas"), category: "Analytics" },
  { name: "Power BI", image: "https://img.icons8.com/color/48/000000/power-bi.png", category: "Analytics" },
  { name: "Google Apps Script", image: "https://img.icons8.com/color/48/000000/google-logo.png", category: "Automation" },
  { name: "Git", image: getIconUrl("git"), category: "Version Control" },
  { name: "Scikit-Learn", image: getIconUrl("scikitlearn"), category: "AI" },
];

export const EXPERIENCE = [
  {
    id: 1,
    role: "Master Data Management Data Analyst Officer",
    company: "Kawan Lama Group",
    type: "Full-time",
    date: "Jan 2025 - Mar 2026",
    description: (
      <div className="space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
        <ul className="list-disc pl-5 space-y-3">
            <li>
                <strong className="text-emerald-600 dark:text-emerald-400">Improved master data SLA by 30%:</strong> through workflow standardization and pre-validation mechanisms, reducing back-and-forth and rework.
            </li>
            <li>
                <strong className="text-emerald-600 dark:text-emerald-400">Increased master data completeness and accuracy to &gt;99%:</strong> across key domains (Site, Vendor, Customer, Article, Finance).
            </li>
            <li>
                <strong className="text-emerald-600 dark:text-emerald-400">Digital Integration:</strong> Migrated 10+ manual master data processes into a centralized digital workflow, establishing the foundation for end-to-end request tracking that replaced untraceable email-based submissions with a transparent, auditable system.
            </li>
            <li>
                <strong className="text-emerald-600 dark:text-emerald-400">Reduced operational bottlenecks by ~35% and automated ~70% of repetitive tasks:</strong> rule-based master data activities through workflow-driven automation and standardized logic, increasing daily request handling capacity by ~3x with the same headcount.
            </li>
            <li>
                <strong className="text-emerald-600 dark:text-emerald-400">Enabled faster and more reliable business decisions:</strong> by ensuring consistent, well-governed master data, supported by a centralized request tracking system, Looker dashboards to monitor MDM performance and data trends, and data profiling outputs for Business Units, providing visibility into their own master data domains (Article, Site, Vendor, and Customer).
            </li>
        </ul>
      </div>
    ),
    certificate: null
  },
  {
    id: 2,
    role: "Master Data Management Data Analyst Officer",
    company: "Kawan Lama Group",
    type: "Internship",
    date: "Jan 2024 - Jan 2025",
    description: (
      <div className="space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
        <p>I contributed to automation, data management, and operational efficiency projects, enhancing my skills in scripting and data governance.</p>
        <div>
          <strong className="block text-emerald-600 dark:text-emerald-400 mb-1 text-base">Workflow Optimization</strong>
          <ul className="list-disc pl-5 space-y-1">
            <li>Transformed email-based workflows to a structured system using Google Forms and Sheets.</li>
            <li>Developed custom forms for efficient task collection and management.</li>
            <li>Implemented Google Apps Script for automated form creation, approvals, and notifications.</li>
          </ul>
        </div>
        <div>
          <strong className="block text-emerald-600 dark:text-emerald-400 mb-1 text-base">Data Management & Governance</strong>
          <ul className="list-disc pl-5 space-y-1">
            <li>Utilized Google Sheets and Looker for data visualization.</li>
            <li>Assisted in automating data mapping processes.</li>
          </ul>
        </div>
        <div>
          <strong className="block text-emerald-600 dark:text-emerald-400 mb-1 text-base">Operational Support</strong>
          <ul className="list-disc pl-5 space-y-1">
            <li>Monitored promotional and merchandise processes.</li>
            <li>Assisted in inventory tracking and management.</li>
          </ul>
        </div>
      </div>
    ),
    highlight: "Awarded Best Intern",
    link: "https://www.linkedin.com/in/william-oo00/overlay/1743496220514/single-media-viewer/?profileId=ACoAAD2slAoBjkl94d--TrheKOVwxTXqS41kD8E"
  }
];

export const CERTIFICATIONS = [
  {
    id: 1,
    title: "Belajar Analisis Data dengan Python",
    issuer: "Dicoding Indonesia",
    image: "https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/commons/new-ui-logo.png",
    link: "https://www.dicoding.com/certificates/GRX52E7ERX0M"
  },
  {
    id: 2,
    title: "Belajar Dasar Visualisasi Data",
    issuer: "Dicoding Indonesia",
    image: "https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/commons/new-ui-logo.png",
    link: "https://www.dicoding.com/certificates/QLZ941NY7P5D"
  },
  {
    id: 3,
    title: "Certificate of Excellence",
    issuer: "Kawan Lama Group",
    image: "https://www.kawanlamagroup.com/favicon.png",
    link: "https://www.linkedin.com/in/william-oo00/overlay/1743496220514/single-media-viewer/?profileId=ACoAAD2slAoBjkl94d--TrheKOVwxTXqS41kD8E"
  },
  {
    id: 4,
    title: "Memulai Pemrograman dengan Python",
    issuer: "Dicoding Indonesia",
    image: "https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/commons/new-ui-logo.png",
    link: "https://dicoding.com/certificates/98XWVRM4LPM3"
  },
  {
    id: 5,
    title: "Machine Learning Pemula",
    issuer: "Dicoding Indonesia",
    image: "https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/commons/new-ui-logo.png",
    link: "https://dicoding.com/certificates/98XWV4O7LPM3"
  },
  {
    id: 6,
    title: "Microsoft Excel",
    issuer: "MySkill",
    image: "https://myskill.id/favicon/favicon-32x32.png",
    link: "https://storage.googleapis.com/myskill-v2-certificates/learning-path-kpIIH7ZvWgW3muNNmC1V/1L3U2pxG95SYDqJeWU826bAsGLn2-iJSQ2XkoAtkIt8JfWW9v.pdf"
  },
  {
    id: 7,
    title: "SQL for Data Science",
    issuer: "Dicoding Indonesia",
    image: "https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/commons/new-ui-logo.png",
    link: "https://dicoding.com/certificates/81P23MG9YXOY"
  },
  {
    id: 8,
    title: "Google Analytics Certification",
    issuer: "Google Digital Academy",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg",
    link: "https://skillshop.exceedlms.com/student/award/a31oSo7NkTXipXtJfDb5eR3E"
  }
];

export const PROJECTS = [
  {
    id: 1,
    title: "AI Content Pipeline",
    description: "A content management platform built with Next.js and LangChain. It supports multiple LLMs (Gemini, OpenAI, Anthropic, Local) and uses a Client-Side BYOK architecture for secure API key handling.",
    tech: ["TypeScript", "Next.js", "LangChain", "LLMs", "React"],
    link: "https://github.com/GaneshArwan/AIContentPipeline",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Voice AI Assistant",
    description: "A real-time voice application integrating Speech-to-Text and Generative AI to enable direct conversational interactions through the browser.",
    tech: ["TypeScript", "WebRTC", "AI Audio Models", "Node.js"],
    link: "https://github.com/GaneshArwan/VoiceAIAssistant",
    image: "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "AI Code Review Agent",
    description: "An automated code review tool that connects to the GitHub API. It uses LangGraph.js and LLMs to analyze pull requests, identify potential bugs, and check for standard practices.",
    tech: ["TypeScript", "LangGraph.js", "GitHub API", "LLMs"],
    link: "https://github.com/GaneshArwan/AICodeReviewAgent",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "AI Resume & CV Analyzer",
    description: "A Resume and CV analysis tool supporting Gemini, OpenAI, and Anthropic. It processes resume text against job descriptions to identify missing keywords and format gaps, using a local BYOK setup.",
    tech: ["TypeScript", "Next.js", "Generative AI", "NLP"],
    link: "https://github.com/GaneshArwan/AIResumeCVAnalyzer",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "ProcessPilot Automation",
    description: "An internal automation tool developed to handle business requests at scale. It implements a Distributed Key-Lock for concurrency and Scaled Round Robin for workload distribution, integrated with SAP GUI scripts to reduce manual processing.",
    tech: ["Google Apps Script", "SAP GUI Scripting", "JavaScript", "REST API", "Distributed Systems"],
    link: "https://github.com/GaneshArwan/enterprise-process-automation",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Corporate KPI & SLA Dashboard",
    description: "A Python and Streamlit dashboard for tracking operational Service Level Agreements (SLA). It includes data pipelines from Google Sheets and renders visual reports using Plotly to monitor processing times.",
    tech: ["Python", "Streamlit", "Plotly", "Pandas", "Google API"],
    link: "https://github.com/GaneshArwan/kpi-dashboard",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
  }
];
