import React, { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { 
  Home,
  Mail, 
  Menu, 
  X, 
  Award,
  GraduationCap,
  Sun,
  Moon,
  Activity,
  ArrowRight,
  Cpu,
  X as CloseIcon,
  Send
} from 'lucide-react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css'; // Pastikan import CSS jika perlu
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
// --- Custom Icons ---

const GithubIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const LinkedinIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

// --- Data Constants ---

const PERSONAL_INFO = {
  name: "William",
  role: "Data Analyst | AI/ML Engineer | Data Scientist",
  about: `I'm building my career in Data Analysis, Data Science, and AI/ML Engineering, supported by hands-on experience in data automation, workflow optimization, and master data governance at Kawan Lama Group. Through my internship and current role, I’ve strengthened my abilities in improving data quality, automating processes, and turning operational data into clearer insights. I stay focused on the skills that represent my professional direction—data, automation, and problem-solving—and I aim to continue growing into roles in data analysis, data science, and AI/ML engineering.`,
  location: "Jakarta, Indonesia",
  email: "wiliamzwili135@gmail.com", 
  linkedin: "https://www.linkedin.com/in/william-oo00",
  github: "https://github.com/GaneshArwan",
};

const REMOTE_BACKGROUNDS = {
  hero: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop", 
  about: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop", 
  skills: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", 
  experience: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop", 
  projects: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop", 
  certifications: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop", 
  contact: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=2071&auto=format&fit=crop" 
};

// 2. ADD THIS NEW CONSTANT for local paths
const LOCAL_BACKGROUNDS = {
  hero: "/assets/hero.jpg",
  about: "/assets/about.jpg",
  skills: "/assets/skills.jpg",
  experience: "/assets/experience.jpg",
  projects: "/assets/projects.jpg",
  certifications: "/assets/certifications.jpg",
  contact: "/assets/contact.jpg"
};

const HERO_VIDEOS = {
  light: "/assets/hero-light.mp4",
  dark: "/assets/hero-dark.mp4"
};

const getIconUrl = (name) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-original.svg`;

const SKILLS = [
  { name: "Python", image: getIconUrl("python"), category: "Language" },
  { name: "SQL", image: getIconUrl("mysql"), category: "Language" },
  { name: "Google Apps Script", image: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_Apps_Script.svg", category: "Automation" },
  { name: "Power BI", image: "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg", category: "Analytics" },
  { name: "Pandas", image: getIconUrl("pandas"), category: "Analytics" },
  { name: "Machine Learning", image: getIconUrl("tensorflow"), category: "AI" },
  { name: "Looker Studio", image: "https://www.gstatic.com/analytics-lego/svg/ic_looker_studio.svg", category: "Tools" },
  { name: "Google Sheets", image: "https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg", category: "Tools" },
  { name: "Git", image: getIconUrl("git"), category: "Version Control" },
  { name: "Jupyter", image: getIconUrl("jupyter"), category: "Tools" },
  { name: "Scikit-Learn", image: getIconUrl("scikitlearn"), category: "AI" },
];

const EXPERIENCE = [
  {
    id: 1,
    role: "Master Data Management Data Analyst Officer",
    company: "Kawan Lama Group",
    type: "Contract",
    date: "Jan 2025 - Present",
    description: (
      // UPDATE: New Description with Bold Titles
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
    highlight: "Awarded Certificate of Excellence Intern",
    link: "https://www.linkedin.com/in/william-oo00/overlay/1743496220514/single-media-viewer/?profileId=ACoAAD2slAoBjkl94d--TrheKOVwxTXqS41kD8E"
  }
];

const CERTIFICATIONS = [
  {
    id: 1,
    title: "Belajar Analisis Data dengan Python",
    issuer: "Dicoding Indonesia",
    image: "https://media.licdn.com/dms/image/v2/C560BAQHOIi63tC8k8w/company-logo_100_100/company-logo_100_100/0/1660182933847/dicoding_logo?e=1767830400&v=beta&t=w0cAb4xz5sFk-PsdIa2MQCYjqrp_9feO2fG8_c3jC6c",
    link: "https://www.dicoding.com/certificates/GRX52E7ERX0M"
  },
  {
    id: 2,
    title: "Belajar Dasar Visualisasi Data",
    issuer: "Dicoding Indonesia",
    image: "https://media.licdn.com/dms/image/v2/C560BAQHOIi63tC8k8w/company-logo_100_100/company-logo_100_100/0/1660182933847/dicoding_logo?e=1767830400&v=beta&t=w0cAb4xz5sFk-PsdIa2MQCYjqrp_9feO2fG8_c3jC6c",
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
    image: "https://media.licdn.com/dms/image/v2/C560BAQHOIi63tC8k8w/company-logo_100_100/company-logo_100_100/0/1660182933847/dicoding_logo?e=1767830400&v=beta&t=w0cAb4xz5sFk-PsdIa2MQCYjqrp_9feO2fG8_c3jC6c",
    link: "https://dicoding.com/certificates/98XWVRM4LPM3"
  },
  {
    id: 5,
    title: "Machine Learning Pemula",
    issuer: "Dicoding Indonesia",
    image: "https://media.licdn.com/dms/image/v2/C560BAQHOIi63tC8k8w/company-logo_100_100/company-logo_100_100/0/1660182933847/dicoding_logo?e=1767830400&v=beta&t=w0cAb4xz5sFk-PsdIa2MQCYjqrp_9feO2fG8_c3jC6c",
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
    image: "https://media.licdn.com/dms/image/v2/C560BAQHOIi63tC8k8w/company-logo_100_100/company-logo_100_100/0/1660182933847/dicoding_logo?e=1767830400&v=beta&t=w0cAb4xz5sFk-PsdIa2MQCYjqrp_9feO2fG8_c3jC6c",
    link: "https://dicoding.com/certificates/81P23MG9YXOY"
  },
  {
    id: 8,
    title: "Google Analytics Certification",
    issuer: "Google Digital Academy",
    image: "https://media.licdn.com/dms/image/v2/C4E0BAQH3BCCd-0PGng/company-logo_100_100/company-logo_100_100/0/1630624368505?e=1767830400&v=beta&t=ndQOZD1t2LBlwWBePjVpk7xRDoxigbM5sKUuZJyRce4",
    link: "https://skillshop.exceedlms.com/student/award/a31oSo7NkTXipXtJfDb5eR3E"
  }
];

const PROJECTS = [
  {
    id: 1,
    title: "ProcessPilot Automation",
    description: "Enterprise-grade orchestration system designed to automate high-volume business requests. Features a custom 'Distributed Key-Lock' mechanism for concurrency control, 'Scaled Round Robin' algorithms for intelligent workload distribution, and dynamic SAP GUI script generation to reduce manual effort by ~70%.",
    tech: ["Google Apps Script", "SAP GUI Scripting", "JavaScript", "REST API", "Distributed Systems"],
    link: "https://github.com/GaneshArwan/enterprise-process-automation",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Corporate KPI & SLA Dashboard",
    description: "Interactive analytics platform built with Streamlit to track operational efficiency. Integrates a robust SLA engine that calculates business-day processing times, automated ETL pipelines for Google Sheets data, and dynamic Plotly visualizations for identifying bottleneck trends.",
    tech: ["Python", "Streamlit", "Plotly", "Pandas", "Google API"],
    link: "https://github.com/GaneshArwan/kpi-dashboard",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Indonesia GHG Cluster Map",
    description: "Unsupervised machine learning application categorizing Indonesian provinces by Greenhouse Gas emissions. Utilizes K-Means clustering with Silhouette analysis to determine optimal grouping and presents insights via an interactive geospatial map.",
    tech: ["Python", "Scikit-Learn", "Streamlit", "K-Means", "Geospatial Analysis"],
    link: "https://github.com/GaneshArwan/indonesia-province-ghg-cluster-map",
    image: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Student Dropout Classification",
    description: "A comprehensive predictive modeling pipeline to identify at-risk students. Implements advanced ensemble classifiers (XGBoost, AdaBoost, Random Forest) coupled with ADASYN oversampling and rigorous GridSearchCV hyperparameter tuning for maximum recall.",
    tech: ["Python", "XGBoost", "Scikit-Learn", "Imbalanced-Learn", "Pandas"],
    link: "https://github.com/GaneshArwan/dropoout_classification",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop"
  }
];

// --- Helper Components ---

const useBackgroundImage = (localPath, fallbackUrl) => {
  const [bgImage, setBgImage] = useState(fallbackUrl);

  useEffect(() => {
    if (!localPath) return;
    const img = new Image();
    img.src = localPath;
    img.onload = () => setBgImage(localPath);
    // If it fails (404), it naturally stays as fallbackUrl
  }, [localPath, fallbackUrl]);

  return bgImage;
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-12 w-full text-left relative z-20 animate-in slide-in-from-bottom-8 duration-700 fade-in">
    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6 drop-shadow-md tracking-tight">
      {title}
    </h2>
    <div className="w-24 h-1.5 bg-emerald-500 rounded-full mb-6 opacity-80"></div>
    {subtitle && (
      <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 font-medium drop-shadow-sm max-w-2xl">
        {subtitle}
      </p>
    )}
  </div>
);

const BackgroundOverlay = () => (
  <>
    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-50 dark:from-slate-950 to-transparent z-[1] pointer-events-none" />
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent z-[1] pointer-events-none" />
  </>
);

const StickyScrollSection = ({ id, title, subtitle, items, renderCard, bgImage, blurPx }) => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !containerRef.current) return;

      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const windowScroll = window.scrollY;
      const windowHeight = window.innerHeight;

      const startScroll = sectionTop;
      const endScroll = sectionTop + sectionHeight - windowHeight;
      
      if (windowScroll >= startScroll && windowScroll <= endScroll + windowHeight) {
        const scrollDistance = windowScroll - startScroll;
        const maxScrollDistance = sectionHeight - windowHeight;
        
        const contentWidth = containerRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const maxTranslate = contentWidth - viewportWidth + 500;

        let progress = scrollDistance / maxScrollDistance;
        progress = Math.max(0, Math.min(progress, 1));

        setTranslateX(progress * maxTranslate);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  return (
    <section id={id} ref={sectionRef} className="relative h-[400vh] transition-colors duration-300 scroll-mt-24">
      <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div
            className="absolute inset-0 bg-slate-50/85 dark:bg-slate-950/85 transition-[backdrop-filter] duration-300"
            style={{
              backdropFilter: `blur(${blurPx}px)`,
              WebkitBackdropFilter: `blur(${blurPx}px)`
            }}
          ></div>
          <BackgroundOverlay />
      </div>

      <div className="sticky top-0 h-screen overflow-hidden flex flex-col pt-32 md:pt-40 px-6 max-w-7xl mx-auto z-10">
        <div className="w-full shrink-0">
          <SectionHeader title={title} subtitle={subtitle} />
        </div>
        
        <div className="flex-1 flex items-center">
          <div 
            ref={containerRef}
            className="flex gap-8 w-max will-change-transform pb-20" 
            style={{ transform: `translateX(-${translateX}px)` }}
          >
            {items.map((item, index) => renderCard(item, index))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Typewriter = ({ text, delay = 100, startDelay = 0 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setHasStarted(true), startDelay);
    return () => clearTimeout(timeout);
  }, [startDelay]);

  useEffect(() => {
    if (hasStarted && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(text.slice(0, currentIndex + 1)); // Improved logic
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, hasStarted, text]);

  return <span>{currentText}</span>;
};

const RotatingText = ({ words, interval = 3000 }) => {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false); // Fade out
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setIsVisible(true); // Fade in
      }, 500); // Wait for fade out
    }, interval);
    return () => clearInterval(timer);
  }, [interval, words.length]);

  return (
    <span className={`inline-block transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {words[index]}
    </span>
  );
};

// NEW COMPONENT: Project Card with Image Fallback
const ProjectCard = ({ project, blurPx }) => {
  // Try local image first (e.g. /assets/projects/1.jpg), fallback to remote
  const localPath = `/assets/projects/${project.id}.jpg`;
  const bgImage = useBackgroundImage(localPath, project.image);

  return (
    <a 
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-2xl h-[500px] md:h-[600px]"
    >
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex flex-col justify-end p-8 transition-opacity duration-300 group-hover:opacity-0">
        <h3 className="text-3xl md:text-5xl font-bold text-white mb-2 shadow-black drop-shadow-md">{project.title}</h3>
        <div className="w-20 h-2 bg-emerald-500 rounded-full"></div>
      </div>

      <div
        className="absolute inset-0 bg-slate-900/95 transition-[backdrop-filter] duration-300
                  opacity-0 group-hover:opacity-100
                  flex flex-col justify-center items-center p-8 md:p-16 text-center"
        style={{
          backdropFilter: `blur(${blurPx}px)`,
          WebkitBackdropFilter: `blur(${blurPx}px)`
        }}
      >
        <h3 className="text-3xl md:text-5xl font-bold text-emerald-400 mb-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {project.title}
        </h3>

        <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-3xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-3 justify-center mb-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-100">
          {project.tech.map((t, i) => (
            <span key={i} className="text-sm md:text-base font-medium bg-emerald-500/10 text-emerald-300 px-5 py-2 rounded-full border border-emerald-500/20">
              {t}
            </span>
          ))}
        </div>

        <div className="inline-flex items-center gap-2 text-white bg-emerald-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-500 transition-colors shadow-lg">
          View Details <ArrowRight size={22} />
        </div>
      </div>
    </a>
  );
};

// Modal for Certificates
const CertificateModal = ({ isOpen, onClose, imageSrc, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-4xl w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors z-10"
        >
          <CloseIcon size={24} />
        </button>
        <div className="p-2 bg-slate-100 dark:bg-black/20">
          <img src={imageSrc} alt={title} className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
        </div>
        <div className="p-6 bg-white dark:bg-slate-900">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h3>
        </div>
      </div>
    </div>
  );
};

// Futuristic HUD Loading Screen
const FuturisticLoader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("SYSTEM_INIT");
  const [lines, setLines] = useState([]);

  useEffect(() => {
    // Generate random HUD lines
    const interval = setInterval(() => {
      setLines(prev => [`> 0x${Math.floor(Math.random()*10000).toString(16).toUpperCase()}`, ...prev.slice(0, 4)]);
    }, 100);

    const progress = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(progress);
          clearInterval(interval);
          setStatus("COMPLETE");
          setTimeout(onComplete, 800);
          return 100;
        }
        if (prev === 30) setStatus("LOADING_MODULES");
        if (prev === 60) setStatus("VERIFYING_CORE");
        if (prev === 90) setStatus("FINALIZING");
        return prev + 1;
      });
    }, 20);
    return () => { clearInterval(progress); clearInterval(interval); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center text-emerald-500 font-mono overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* HUD Container - Scaled Up */}
      <div className="relative flex flex-col items-center justify-center w-full h-full max-w-3xl scale-125">
        
        {/* Spinning Rings */}
        <div className="absolute w-[500px] h-[500px] rounded-full border border-emerald-500/20 border-t-emerald-500/80 animate-[spin_4s_linear_infinite]"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full border border-emerald-500/10 border-b-emerald-500/50 animate-[spin_6s_linear_infinite_reverse]"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full border border-dashed border-emerald-500/10 animate-[spin_10s_linear_infinite]"></div>

        {/* Center Content */}
        <div className="flex flex-col items-center z-10 p-12 bg-slate-950/80 backdrop-blur-sm rounded-full border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
          <Cpu size={80} className="text-emerald-400 animate-pulse mb-6" />
          <div className="text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-emerald-700">
            {count}%
          </div>
          <div className="text-sm tracking-[0.3em] text-emerald-400/70 mt-2">{status}</div>
        </div>

        {/* Decor: Scanning Line */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-[100px] w-full animate-[ping_3s_linear_infinite]"></div>

        {/* Decor: Data Stream */}
        <div className="absolute bottom-20 right-20 text-xs text-emerald-500/60 flex flex-col items-end font-mono">
          {lines.map((line, i) => (
            <div key={i} className="opacity-70">{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Custom Interactive Cursor
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target;
      const isClickable = target.closest('a') || target.closest('button') || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <>
      <div 
        className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-emerald-500 transition-all duration-150 ease-out hidden md:flex items-center justify-center mix-blend-difference
          ${isHovering ? 'w-12 h-12 bg-emerald-500/20' : 'w-8 h-8'}
        `}
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`
        }}
      />
      <div 
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-emerald-500 rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`
        }}
      />
    </>
  );
};

// --- Main Components ---

const Navbar = ({ isDarkMode, toggleTheme, activeSection, scrollTo }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleLinkClick = (id) => {
    scrollTo(id);
    setIsOpen(false);
  };

  const navLinks = [
    { name: "About", id: "about" },
    { name: "Projects", id: "projects" },
    { name: "Skills", id: "skills" },
    { name: "Experience", id: "experience" },
    { name: "Awards", id: "certifications" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <nav className="fixed left-1/2 -translate-x-1/2 top-12 lg:top-20 z-[999] w-[90%] max-w-[360px] md:w-auto md:min-w-[300px] rounded-full bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl transition-all duration-300 px-6">
      <div className="flex justify-between items-center gap-4 py-3">
        {/* Home Button */}
        <button 
          onClick={() => handleLinkClick('top')} 
          className="text-emerald-500 hover:scale-110 transition-transform shrink-0"
          aria-label="Back to Top"
        >
          <Home size={24} />
        </button>
        
        {/* Active Section Display - Fixed Glitch with key prop */}
        <div className="flex-1 text-center overflow-hidden">
            {activeSection && (
                <span 
                  key={activeSection} // 🔴 CRITICAL FIX: Forces animation restart on change
                  className="inline-block text-lg font-bold text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-top-2 duration-300 whitespace-nowrap"
                >
                    {activeSection}
                </span>
            )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <button onClick={toggleTheme} className="hidden lg:[@media(min-height:830px)]:flex p-2 rounded-full bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-slate-700 transition-colors shadow-sm ring-1 ring-white/20">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="lg:[@media(min-height:830px)]:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 hover:text-emerald-500">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:[@media(min-height:830px)]:hidden bg-white/95 dark:bg-slate-900/95 absolute top-full left-0 w-full mt-4 rounded-2xl border border-white/20 backdrop-blur-xl overflow-hidden shadow-xl transition-all duration-300 ease-in-out origin-top ${isOpen ? "opacity-100 translate-y-0 scale-100 visible" : "opacity-0 -translate-y-4 scale-95 invisible"}`}>
        <div className="px-6 py-6 flex flex-col space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-500">Theme</span>
              <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
          </div>
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => handleLinkClick(link.id)} 
              className="text-left text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:pl-2 transition-all"
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

const SideRibbonNavigation = ({ scrollTo }) => {
  const sections = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'certifications', label: 'Awards' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="fixed right-0 top-32 h-[calc(100vh-16rem)] w-16 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl border-l border-y border-white/20 dark:border-slate-800 z-40 hidden lg:[@media(min-height:830px)]:flex flex-col items-center py-6 shadow-2xl rounded-tl-3xl rounded-bl-3xl overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <div className="flex flex-col justify-center gap-6 w-full items-center min-h-full">
      {sections.map((section) => (
        <button 
          key={section.id} 
          onClick={() => scrollTo(section.id)} 
          className="group relative flex items-center justify-center w-full shrink-0"
        >
          <span className="vertical-text text-xs font-bold uppercase tracking-[0.25em] text-slate-400 group-hover:text-emerald-500 transition-colors duration-300 whitespace-nowrap cursor-pointer hover:scale-110" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
            {section.label}
          </span>
          <div className="absolute right-0 w-1 h-0 bg-emerald-500 group-hover:h-full transition-all duration-300 rounded-l-full"></div>
        </button>
      ))}
      </div>
    </div>
  );
};

// --- Styles for Animations ---
const styles = `
  html { scroll-behavior: smooth; } /* ADDED: Smooth scrolling for all links */
  @keyframes gloss-shine {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes scroll-left {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @keyframes scroll-right {
    from { transform: translateX(-50%); }
    to { transform: translateX(0); }
  }
  .glossy-matcha {
    background: linear-gradient(90deg, #34d399, #10b981, #d1fae5, #059669);
    background-size: 300% 300%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gloss-shine 4s ease-in-out infinite;
  }
  .animate-scroll-left { animation: scroll-left 40s linear infinite; }
  .animate-scroll-right { animation: scroll-right 40s linear infinite; }

  html.has-scroll-smooth { overflow: hidden; }
  html.has-scroll-dragging { user-select: none; }
  [data-scroll-container] { perspective: 1px; }
`;

// NEW: Glossy Text Component
const GlossyText = ({ children, className = "" }) => (
  <span className={`glossy-matcha font-bold ${className}`}>
    {children}
  </span>
);

// NEW: Hacker Text Scramble Component
const TextScramble = ({ phrases, wait = 2000 }) => {
  const [text, setText] = useState(phrases[0]);
  const elementRef = useRef(null);
  const chars = "!<>-_\\/[]{}░▒▓—=+*^?#________";
  const queue = useRef([]);
  const frameRequest = useRef(null);
  const frame = useRef(0);
  const resolve = useRef(null);

  useEffect(() => {
    let counter = 0;
    
    const next = () => {
      const newText = phrases[counter % phrases.length];
      scramble(newText).then(() => {
        setTimeout(() => {
          counter++;
          next();
        }, wait);
      });
    };

    next();
    return () => cancelAnimationFrame(frameRequest.current);
  }, [phrases]);

  const scramble = (newText) => {
    const length = Math.max(text.length, newText.length);
    const promise = new Promise((res) => (resolve.current = res));
    queue.current = [];
    
    for (let i = 0; i < length; i++) {
      const from = text[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.current.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(frameRequest.current);
    frame.current = 0;
    update();
    return promise;
  };

  const update = () => {
    let output = "";
    let complete = 0;
    
    for (let i = 0, n = queue.current.length; i < n; i++) {
      let { from, to, start, end, char } = queue.current[i];
      if (frame.current >= end) {
        complete++;
        output += to;
      } else if (frame.current >= start) {
        if (!char || Math.random() < 0.28) {
          char = chars[Math.floor(Math.random() * chars.length)];
          queue.current[i].char = char;
        }
        output += `<span class="text-emerald-500/50">${char}</span>`;
      } else {
        output += from;
      }
    }
    
    if (elementRef.current) elementRef.current.innerHTML = output;
    
    if (complete === queue.current.length) {
      resolve.current();
    } else {
      frameRequest.current = requestAnimationFrame(update);
      frame.current++;
    }
  };

  return <span className="font-mono" ref={elementRef}>{text}</span>;
};

// NEW: Infinite Marquee Section (Replaces StickyScrollSection for dual rows)
const MarqueeSection = ({ title, subtitle, items, renderCard, bgImage, blurPx }) => {
  // Split items into two rows for the visual effect
  const mid = Math.ceil(items.length / 2);
  const row1 = [...items, ...items, ...items]; // Triple for smooth loop
  const row2 = [...items.reverse(), ...items, ...items]; 

  return (
    <section className="py-20 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div
            className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/90 transition-[backdrop-filter] duration-300"
            style={{
              backdropFilter: `blur(${blurPx}px)`,
              WebkitBackdropFilter: `blur(${blurPx}px)`
            }}
          ></div>
          <BackgroundOverlay />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-12">
        <SectionHeader title={<GlossyText>{title}</GlossyText>} subtitle={subtitle} />
      </div>

      {/* Row 1: Moves Right */}
      <div className="relative z-10 flex gap-8 mb-8 overflow-hidden w-full">
        <div className="flex gap-8 animate-scroll-right min-w-max hover:[animation-play-state:paused]">
          {row1.map((item, index) => renderCard(item, `r1-${index}`))}
        </div>
      </div>

      {/* Row 2: Moves Left */}
      <div className="relative z-10 flex gap-8 overflow-hidden w-full">
        <div className="flex gap-8 animate-scroll-left min-w-max hover:[animation-play-state:paused]">
          {row2.map((item, index) => renderCard(item, `r2-${index}`))}
        </div>
      </div>
    </section>
  );
};

const Hero = ({ blurPx, isDarkMode, scrollTo }) => {

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-300 bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            key={isDarkMode ? 'dark' : 'light'}
            className="absolute inset-0 w-full h-full object-cover"
          >
            {/* Make sure these paths are correct in public/assets/ */}
            <source src={isDarkMode ? HERO_VIDEOS.dark : HERO_VIDEOS.light} type="video/mp4" />
          </video>

          <div
            className="absolute inset-0 bg-slate-50/50 dark:bg-slate-950/50 transition-[backdrop-filter] duration-300"
            style={{
              backdropFilter: `blur(${blurPx}px)`,
              WebkitBackdropFilter: `blur(${blurPx}px)`
            }}
          ></div>
          <BackgroundOverlay />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center relative z-10 pt-20 md:pt-0">
        <div className="space-y-8">
          <p className="text-emerald-500 font-mono text-lg md:text-xl flex items-center gap-2 h-8">
            <span className="w-10 h-px bg-emerald-500"></span> 
            <Typewriter text="Hello, I'm" delay={50} />
          </p>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 dark:text-slate-100 leading-tight min-h-[1.2em]">
            <GlossyText>
               {/* 🔴 THIS IS THE ANIMATION PART */}
              <Typewriter text={PERSONAL_INFO.name} delay={150} startDelay={1000} />
            </GlossyText>
          </h1>
          
          <h2 className="text-2xl md:text-4xl text-slate-600 dark:text-slate-400 font-light min-h-[3rem] flex items-center gap-2">
            <GlossyText className="font-semibold">
              <TextScramble phrases={['Data Enthusiast', 'AI/ML Enthusiast', 'Automation Enthusiast']} />
            </GlossyText>
          </h2>

          <div className="flex flex-wrap gap-3 pt-4">
            <button 
              onClick={() => scrollTo('contact')} 
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 text-lg rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-1"
            >
              <Mail size={20} /> Contact Me
            </button>
            <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="border border-slate-300 dark:border-slate-600 hover:border-emerald-500 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 py-3 px-6 text-lg rounded-full transition-all flex items-center gap-2 hover:-translate-y-1">
              <LinkedinIcon size={20} /> LinkedIn
            </a>
            <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="border border-slate-300 dark:border-slate-600 hover:border-emerald-500 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 py-3 px-6 text-lg rounded-full transition-all flex items-center gap-2 hover:-translate-y-1">
              <GithubIcon size={20} /> GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const About = ({ blurPx }) => {
  const bgImage = useBackgroundImage(LOCAL_BACKGROUNDS.about, REMOTE_BACKGROUNDS.about);

  return (
    <section id="about" className="py-20 pt-40 relative transition-colors duration-300 scroll-mt-28 bg-slate-50 dark:bg-slate-950">
       {/* ... background code remains same ... */}
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: `url(${bgImage})` }} />
          <div className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/90 transition-[backdrop-filter] duration-300" style={{ backdropFilter: `blur(${blurPx}px)`, WebkitBackdropFilter: `blur(${blurPx}px)` }}></div>
          <BackgroundOverlay />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* CHANGED: Glossy Title */}
        <SectionHeader title={<GlossyText>About Me</GlossyText>} />
        
        <div className="bg-white/80 dark:bg-slate-900/80 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500/30 transition-all backdrop-blur-md">
          {/* CHANGED: Added text-justify */}
          <div className="text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-loose whitespace-pre-line text-justify">
            {PERSONAL_INFO.about}
          </div>
        </div>
      </div>
    </section>
  );
};

const Projects = ({ blurPx }) => {
    const bgImage = useBackgroundImage(LOCAL_BACKGROUNDS.projects, REMOTE_BACKGROUNDS.projects);
  return (
    <section id="projects" className="py-20 pt-32 relative transition-colors duration-300 scroll-mt-32 bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div
            className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/90 transition-[backdrop-filter] duration-300"
            style={{
              backdropFilter: `blur(${blurPx}px)`,
              WebkitBackdropFilter: `blur(${blurPx}px)`
            }}
          ></div>
          <BackgroundOverlay />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader title={<GlossyText>Projects</GlossyText>} subtitle="A selection of my work in Data Analysis and Automation." />
        <div className="space-y-16 mb-12">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} blurPx={blurPx} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Experience = ({ blurPx }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');

  const openCertificate = (image, title) => {
    setSelectedImage(image);
    setSelectedTitle(title);
    setModalOpen(true);
  };
  const bgImage = useBackgroundImage(LOCAL_BACKGROUNDS.experience, REMOTE_BACKGROUNDS.experience);
  return (
    <section id="experience" className="py-20 relative transition-colors duration-300 scroll-mt-20 bg-slate-50 dark:bg-slate-900">
      <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div
            className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/90 transition-[backdrop-filter] duration-300"
            style={{
              backdropFilter: `blur(${blurPx}px)`,
              WebkitBackdropFilter: `blur(${blurPx}px)`
            }}
          ></div>
          <BackgroundOverlay />
        </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <SectionHeader title={<GlossyText>Experience</GlossyText>} />
        <div className="space-y-12">
          {EXPERIENCE.map((exp) => (
            <div key={exp.id} className="relative pl-8 md:pl-0">
              <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700 -translate-x-1/2"></div>
              <div className={`md:flex items-center justify-between ${exp.id % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className={`hidden md:block w-[45%] ${exp.id % 2 === 0 ? 'text-left' : 'text-right'}`}>
                  <span className="text-emerald-500 font-mono text-sm">{exp.date}</span>
                </div>
                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-emerald-500 rounded-full border-4 border-slate-50 dark:border-slate-900 -translate-x-[5px] md:-translate-x-1/2 mt-1.5 md:mt-0"></div>
                <div className="w-full md:w-[45%]">
                  <div className="md:hidden text-emerald-500 font-mono text-sm mb-1">{exp.date}</div>
                  <div className="bg-white/80 dark:bg-slate-900/80 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow group backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{exp.role}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{exp.company}</span>
                      <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">{exp.type}</span>
                    </div>
                    {exp.description}
                    {exp.highlight && (
                      <a 
                        href={exp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 bg-teal-500/10 p-3 rounded-lg border border-teal-500/20 hover:bg-teal-500/20 transition-colors w-full text-left group cursor-pointer mt-3"
                      >
                        <Award size={16} className="text-teal-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-teal-600 dark:text-teal-200 text-xs font-semibold group-hover:underline">{exp.highlight}</p>
                          <p className="text-slate-500 text-[10px]">Click to view certificate</p>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CertificateModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        imageSrc={selectedImage} 
        title={selectedTitle} 
      />
    </section>
  );
};


const Contact = ({ blurPx, isDarkMode }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA verification.");
      return;
    }

    const response = await fetch("https://formspree.io/f/xbdrzqwr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        "g-recaptcha-response": recaptchaToken
      }),
    });
    
    if (response.ok) {
      setFormData({ name: '', email: '', message: '' });
      setRecaptchaToken(null);
      alert("Message sent successfully!");
    } else {
      alert("Failed to send message. Please try again.");
    }
  };

  const bgImage = useBackgroundImage(LOCAL_BACKGROUNDS.contact, REMOTE_BACKGROUNDS.contact);

  return (
    <section id="contact" className="py-20 relative transition-colors duration-300 bg-slate-50 dark:bg-slate-900">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div
          className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/90 transition-[backdrop-filter] duration-300"
          style={{
            backdropFilter: `blur(${blurPx}px)`,
            WebkitBackdropFilter: `blur(${blurPx}px)`
          }}
        ></div>
        <BackgroundOverlay />
      </div>

      <div className="max-w-4xl mx-auto px-2 sm:px-6 relative z-10">
        <SectionHeader title={<GlossyText>Get In Touch</GlossyText>} />
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg leading-relaxed">
              I am currently open to opportunities in Data Analysis, Data Science, and Machine Learning. 
              Whether you have a question, a project collaboration idea, or just want to say hi, I'll try my best to get back to you!
            </p>
            
            <div className="space-y-6">
              <a href={`mailto:${PERSONAL_INFO.email}`} className="flex items-center gap-4 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors group">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-emerald-500 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-emerald-500 transition-all group-hover:scale-110">
                  <Mail size={20} />
                </div>
                <span>{PERSONAL_INFO.email}</span>
              </a>
              <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors group">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-emerald-500 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-emerald-500 transition-all group-hover:scale-110">
                  <LinkedinIcon size={20} />
                </div>
                <span>LinkedIn Profile</span>
              </a>
              <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors group">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-emerald-500 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-emerald-500 transition-all group-hover:scale-110">
                  <GithubIcon size={20} />
                </div>
                <span>GitHub Profile</span>
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-white/80 dark:bg-slate-800/80 p-2 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-sm">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-slate-500 dark:text-slate-400 mb-1">Name</label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Ex: William"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-slate-500 dark:text-slate-400 mb-1">Email</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Ex: william@gmail.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-lg font-medium text-slate-500 dark:text-slate-400 mb-1">Message</label>
              <textarea 
                name="message" 
                id="message" 
                rows="4" 
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                placeholder="Hello, Welcome to my portfolio!"
              ></textarea>
            </div>
            <div className="my-4 w-full flex justify-start">
              <div className="transform scale-[0.77] origin-top-left sm:scale-100 sm:origin-top-left">
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={setRecaptchaToken}
                  theme={isDarkMode ? "dark" : "light"}
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-emerald-500/20"
            >
              <Send size={18} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};


const Footer = () => (
  <footer className="bg-slate-50 dark:bg-slate-900 py-8 border-t border-slate-200 dark:border-slate-900 transition-colors duration-300 lg:pr-24 relative z-10">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
      <p>&copy; {new Date().getFullYear()} {PERSONAL_INFO.name} All rights reserved.</p>
      <div className="flex gap-4 mt-4 md:mt-0">
        <a href={PERSONAL_INFO.linkedin} className="hover:text-emerald-500"><LinkedinIcon size={18} /></a>
        <a href={PERSONAL_INFO.github} className="hover:text-emerald-500"><GithubIcon size={18} /></a>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } catch (e) {}
    return true; 
  });

  const [isLoading, setIsLoading] = useState(true);
  const [blurPx, setBlurPx] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const scrollRef = useRef(null);

  const skillsBg = useBackgroundImage(LOCAL_BACKGROUNDS.skills, REMOTE_BACKGROUNDS.skills);
  const certificationsBg = useBackgroundImage(LOCAL_BACKGROUNDS.certifications, REMOTE_BACKGROUNDS.certifications);
  useEffect(() => {
    if (isLoading) return;

    // 🔴 FIX: Prevent browser from fighting Locomotive on reload
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const scrollEl = document.querySelector('[data-scroll-container]');
    if (!scrollEl) return;

    const scroll = new LocomotiveScroll({
      el: scrollEl,
      smooth: true,
      smartphone: { smooth: true },
      tablet: { smooth: true },
      multiplier: 1.0, // Standard scroll speed
    });
    scrollRef.current = scroll;

    // 🔴 FIX: Auto-update scroll height when content size changes (Fixes "bugged" layout)
    const resizeObserver = new ResizeObserver(() => {
      scroll.update();
    });
    resizeObserver.observe(scrollEl);

    // Listen to scroll events for Blur & Active Section
    scroll.on('scroll', (args) => {
      const currentY = args.scroll.y;
      
      // Blur Logic
      if (currentY < 120) setBlurPx(0);
      else if (currentY < 360) setBlurPx(1);
      else setBlurPx(1);

      // ScrollSpy Logic
      const sections = ['about', 'projects', 'skills', 'experience', 'certifications', 'contact'];
      let current = "";
      
      // Only check if we have scrolled past hero
      if (currentY > 200) {
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            // Get element position relative to scroll
            const offsetTop = el.getBoundingClientRect().top + currentY;
            // Buffer zone of 40% viewport height
            if (currentY >= offsetTop - window.innerHeight * 0.4) {
              let label = id.charAt(0).toUpperCase() + id.slice(1);
              if(label === 'Certifications') label = 'Awards';
              current = label;
            }
          }
        }
      }
      setActiveSection(current);
    });

    return () => {
      resizeObserver.disconnect();
      if (scroll) scroll.destroy();
    };
  }, [isLoading]);

  // Unified Scroll Helper
  const scrollTo = (id) => {
    if(!scrollRef.current) return;
    
    if (id === 'top') {
        scrollRef.current.scrollTo('top');
    } else {
        const target = document.getElementById(id);
        if (target) {
            scrollRef.current.scrollTo(target);
        }
    }
  };

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    try {
      const root = window.document.documentElement;
      if (next) { root.classList.add('dark'); localStorage.setItem('theme', 'dark'); } 
      else { root.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
    } catch (e) {}
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDarkMode]);

  if (isLoading) return <FuturisticLoader onComplete={() => setIsLoading(false)} />;

  return (
    <div className={`min-h-screen font-sans selection:bg-emerald-500/30 ${isDarkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors duration-300`}>
      <style>{styles}</style>
      <CustomCursor />
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} activeSection={activeSection} scrollTo={scrollTo} />
      <SideRibbonNavigation scrollTo={scrollTo} />
      <CertificateModal isOpen={modalOpen} onClose={() => setModalOpen(false)} imageSrc={selectedImage} title={selectedTitle} />

      <main data-scroll-container>
        <div data-scroll-section>
            <Hero blurPx={blurPx} isDarkMode={isDarkMode} scrollTo={scrollTo} />
        </div>
        
        <div data-scroll-section><About blurPx={blurPx} /></div>
        <div data-scroll-section><Projects blurPx={blurPx} /></div>
        
        <div data-scroll-section id="skills">
            <MarqueeSection 
              title="Skills" subtitle="Tools and technologies I use to drive insights." 
              items={SKILLS} bgImage={skillsBg} blurPx={blurPx} 
              renderCard={(skill, key) => (
                <div key={key} className="bg-white/30 dark:bg-slate-900/30 p-8 rounded-2xl border border-white/20 dark:border-slate-800 hover:border-emerald-500/50 transition-all w-72 shrink-0 flex flex-col items-center text-center justify-center gap-4 group shadow-lg hover:shadow-xl backdrop-blur-xl">
                  <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 p-2 transition-transform group-hover:scale-110"><img src={skill.image} alt={skill.name} className="w-full h-full object-contain" /></div>
                  <div><h3 className="text-xl font-bold text-slate-900 dark:text-slate-200">{skill.name}</h3><p className="text-sm text-slate-500 mt-1">{skill.category}</p></div>
                </div>
              )} 
            />
        </div>

        <div data-scroll-section><Experience blurPx={blurPx} /></div>
        
        <div data-scroll-section id="certifications">
            <MarqueeSection 
              title="Certifications & Awards" subtitle="Recognitions of my expertise and dedication." 
              items={CERTIFICATIONS} bgImage={certificationsBg} blurPx={blurPx} 
              renderCard={(cert, key) => (
                <a key={key} href={cert.link || "#"} target="_blank" rel="noopener noreferrer" className="bg-white/30 dark:bg-slate-900/30 p-8 rounded-2xl border border-white/20 dark:border-slate-800 flex flex-col justify-between hover:border-emerald-500/50 transition-all w-96 shrink-0 h-64 cursor-pointer group shadow-lg hover:shadow-xl backdrop-blur-xl block">
                  <div>
                    <div className="mb-6 h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700"><img src={cert.image} alt={cert.issuer} className="w-full h-full object-cover" /></div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight group-hover:text-emerald-500 transition-colors">{cert.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400">{cert.issuer}</p>
                  </div>
                </a>
              )} 
            />
        </div>

        <div data-scroll-section><Contact blurPx={blurPx} isDarkMode={isDarkMode} /></div>
        <div data-scroll-section><Footer /></div>
      </main>
    </div>
  );
}