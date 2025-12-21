import React, { useState, useEffect, useRef } from 'react';
import { 
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
  about: `I’m building my career in Data Analysis, Data Science, and AI/ML Engineering, supported by hands-on experience in data automation, workflow optimization, and master data governance at Kawan Lama Group. Through my internship and current role, I’ve strengthened my abilities in improving data quality, automating processes, and turning operational data into clearer insights. I stay focused on the skills that represent my professional direction—data, automation, and problem-solving—and I aim to continue growing into roles in data analysis, data science, and AI/ML engineering.`,
  location: "Jakarta, Indonesia",
  email: "wiliamzwili135@gmail.com", 
  linkedin: "https://www.linkedin.com/in/william-oo00",
  github: "https://github.com/GaneshArwan",
};

const BACKGROUNDS = {
  hero: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop", 
  about: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop", 
  skills: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", 
  experience: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop", 
  projects: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop", 
  certifications: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop", 
  contact: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=2071&auto=format&fit=crop" 
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
                <strong className="text-teal-600 dark:text-teal-400">Improved master data SLA by 30%:</strong> through workflow standardization and pre-validation mechanisms, reducing back-and-forth and rework.
            </li>
            <li>
                <strong className="text-teal-600 dark:text-teal-400">Increased master data completeness and accuracy to &gt;99%:</strong> across key domains (Site, Vendor, Customer, Article, Finance).
            </li>
            <li>
                <strong className="text-teal-600 dark:text-teal-400">Digital Integration:</strong> Migrated 10+ manual master data processes into a centralized digital workflow, establishing the foundation for end-to-end request tracking that replaced untraceable email-based submissions with a transparent, auditable system.
            </li>
            <li>
                <strong className="text-teal-600 dark:text-teal-400">Reduced operational bottlenecks by ~35% and automated ~70% of repetitive tasks:</strong> rule-based master data activities through workflow-driven automation and standardized logic, increasing daily request handling capacity by ~3x with the same headcount.
            </li>
            <li>
                <strong className="text-teal-600 dark:text-teal-400">Enabled faster and more reliable business decisions:</strong> by ensuring consistent, well-governed master data, supported by a centralized request tracking system, Looker dashboards to monitor MDM performance and data trends, and data profiling outputs for Business Units, providing visibility into their own master data domains (Article, Site, Vendor, and Customer).
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
          <strong className="block text-teal-600 dark:text-teal-400 mb-1 text-base">Workflow Optimization</strong>
          <ul className="list-disc pl-5 space-y-1">
            <li>Transformed email-based workflows to a structured system using Google Forms and Sheets.</li>
            <li>Developed custom forms for efficient task collection and management.</li>
            <li>Implemented Google Apps Script for automated form creation, approvals, and notifications.</li>
          </ul>
        </div>
        <div>
          <strong className="block text-teal-600 dark:text-teal-400 mb-1 text-base">Data Management & Governance</strong>
          <ul className="list-disc pl-5 space-y-1">
            <li>Utilized Google Sheets and Looker for data visualization.</li>
            <li>Assisted in automating data mapping processes.</li>
          </ul>
        </div>
        <div>
          <strong className="block text-teal-600 dark:text-teal-400 mb-1 text-base">Operational Support</strong>
          <ul className="list-disc pl-5 space-y-1">
            <li>Monitored promotional and merchandise processes.</li>
            <li>Assisted in inventory tracking and management.</li>
          </ul>
        </div>
      </div>
    ),
    highlight: "Awarded Certificate of Excellence Intern",
    certificateImage: "https://media.licdn.com/dms/image/v2/D562DAQEjY09fOpIPnw/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1743495474953?e=1765983600&v=beta&t=Ser7pAKeBx63KxVfpElDcdLQuAsBg-ktpCR1Yt2Rb9U"
  }
];

const CERTIFICATIONS = [

  {

    id: 1,

    title: "Belajar Analisis Data dengan Python",

    issuer: "Dicoding Indonesia",

    date: "Issued Oct 2023",

    credentialId: "GRX52E7ERX0M",

    image: "https://media.licdn.com/dms/image/v2/C560BAQHOIi63tC8k8w/company-logo_100_100/company-logo_100_100/0/1660182933847/dicoding_logo?e=1767830400&v=beta&t=w0cAb4xz5sFk-PsdIa2MQCYjqrp_9feO2fG8_c3jC6c",

    link: "https://www.dicoding.com/certificates/GRX52E7ERX0M"

  },

  {

    id: 2,

    title: "Belajar Dasar Visualisasi Data",

    issuer: "Dicoding Indonesia",

    date: "Issued Dec 2023",

    credentialId: "QLZ941NY7P5D",

    image: "https://media.licdn.com/dms/image/v2/C560BAQHOIi63tC8k8w/company-logo_100_100/company-logo_100_100/0/1660182933847/dicoding_logo?e=1767830400&v=beta&t=w0cAb4xz5sFk-PsdIa2MQCYjqrp_9feO2fG8_c3jC6c",

    link: "https://www.dicoding.com/certificates/QLZ941NY7P5D"

  },

  {

    id: 3,

    title: "Certificate of Excellence",

    issuer: "Kawan Lama Group",

    date: "Internship Award",

    credentialId: "MDM Automation",

    image: "https://www.kawanlamagroup.com/favicon.png", // UPDATED IMAGE

    link: "https://www.linkedin.com/in/william-oo00/details/certifications/"

  },

  {

    id: 4,

    title: "Memulai Pemrograman dengan Python",

    issuer: "Dicoding Indonesia",

    date: "Issued Sep 2023",

    credentialId: "Programming Logic",

    image: "https://media.licdn.com/dms/image/v2/C560BAQHOIi63tC8k8w/company-logo_100_100/company-logo_100_100/0/1660182933847/dicoding_logo?e=1767830400&v=beta&t=w0cAb4xz5sFk-PsdIa2MQCYjqrp_9feO2fG8_c3jC6c",

    link: "https://dicoding.com/certificates/98XWVRM4LPM3"

  },

  {

    id: 5,

    title: "Machine Learning Pemula",

    issuer: "Dicoding Indonesia",

    date: "Issued 2023",

    credentialId: "ML Foundations",

    image: "https://media.licdn.com/dms/image/v2/C560BAQHOIi63tC8k8w/company-logo_100_100/company-logo_100_100/0/1660182933847/dicoding_logo?e=1767830400&v=beta&t=w0cAb4xz5sFk-PsdIa2MQCYjqrp_9feO2fG8_c3jC6c",

    link: "https://dicoding.com/certificates/98XWV4O7LPM3"

  },

  {

    id: 6,

    title: "Microsoft Excel",

    issuer: "MySkill",

    date: "Issued Aug 2023",

    credentialId: "", // EMPTY STRING AS REQUESTED

    image: "https://myskill.id/favicon/favicon-32x32.png", // UPDATED IMAGE

    link: "https://storage.googleapis.com/myskill-v2-certificates/learning-path-kpIIH7ZvWgW3muNNmC1V/1L3U2pxG95SYDqJeWU826bAsGLn2-iJSQ2XkoAtkIt8JfWW9v.pdf"

  },

  {

    id: 7,

    title: "SQL for Data Science",

    issuer: "Dicoding Indonesia",

    date: "Issued 2023",

    credentialId: "Database Management",

    image: "https://media.licdn.com/dms/image/v2/C560BAQHOIi63tC8k8w/company-logo_100_100/company-logo_100_100/0/1660182933847/dicoding_logo?e=1767830400&v=beta&t=w0cAb4xz5sFk-PsdIa2MQCYjqrp_9feO2fG8_c3jC6c",

    link: "https://dicoding.com/certificates/81P23MG9YXOY"

  },

  {

    id: 8,

    title: "Google Analytics Certification",

    issuer: "Google Digital Academy",

    date: "Issued Oct 2023",

    credentialId: "177278382",

    image: "https://media.licdn.com/dms/image/v2/C4E0BAQH3BCCd-0PGng/company-logo_100_100/company-logo_100_100/0/1630624368505?e=1767830400&v=beta&t=ndQOZD1t2LBlwWBePjVpk7xRDoxigbM5sKUuZJyRce4",

    link: "https://skillshop.exceedlms.com/student/award/a31oSo7NkTXipXtJfDb5eR3E"

  }

];

const PROJECTS = [
  {
    id: 1,
    title: "Rock Paper Scissors Classification",
    description: "An image classification model built with TensorFlow/Keras to identify hand gestures for Rock, Paper, Scissors. Developed as a final project for Dicoding's Machine Learning course.",
    tech: ["Python", "TensorFlow", "Keras", "Jupyter Notebook"],
    link: "https://github.com/GaneshArwan/rockpaperscissors_classification",
    image: "https://images.unsplash.com/photo-1623934199716-dc28818a6ec7?q=80&w=1000&auto=format&fit=crop" 
  },
  {
    id: 2,
    title: "Bike Sharing Analysis",
    description: "Exploratory Data Analysis (EDA) and visualization on a bike-sharing dataset to uncover usage patterns based on weather, season, and time. Final project for 'Belajar Analisis Data dengan Python'.",
    tech: ["Python", "Pandas", "Matplotlib", "Seaborn"],
    link: "https://github.com/GaneshArwan/bike_sharing", 
    image: "https://images.unsplash.com/photo-1485965120184-e224f7230c4f?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Indonesia GHG Cluster Map",
    description: "A data science project clustering Indonesian provinces based on Greenhouse Gas (GHG) emissions data. Provides visual insights into regional environmental impact.",
    tech: ["Python", "Clustering", "Geospatial Data", "Data Analysis"],
    link: "https://github.com/GaneshArwan/indonesia-province-ghg-cluster-map",
    image: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Student Dropout Classification",
    description: "A predictive model designed to identify students at risk of dropping out. Utilizes various academic and demographic features to classify status, aiming to support early intervention strategies.",
    tech: ["Python", "Scikit-Learn", "Pandas", "Classification"],
    link: "https://github.com/GaneshArwan/dropoout_classification",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Wine Quality Classification",
    description: "Machine Learning project to assess and classify wine quality based on physicochemical properties. Implements data preprocessing and classification algorithms to determine quality ratings.",
    tech: ["Python", "Data Analysis", "Scikit-Learn", "Visualization"],
    link: "https://github.com/GaneshArwan/wine_quality_classification",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop"
  }
];

// --- Helper Components ---

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-12 w-full text-left relative z-20 animate-in slide-in-from-bottom-8 duration-700 fade-in">
    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6 drop-shadow-md tracking-tight">
      {title}
    </h2>
    <div className="w-24 h-1.5 bg-teal-500 rounded-full mb-6 opacity-80"></div>
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
  const [status, setStatus] = useState("INITIALIZING SYSTEM");

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("ACCESS GRANTED");
          setTimeout(onComplete, 1200);
          return 100;
        }
        if (prev === 20) setStatus("VERIFYING CREDENTIALS");
        if (prev === 50) setStatus("LOADING ASSETS");
        if (prev === 80) setStatus("ESTABLISHING CONNECTION");
        return prev + 1;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center text-teal-500 font-mono overflow-hidden">
      {/* HUD Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-50"></div>
      
      {/* Radial Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.8)_100%)]"></div>

      {/* Main HUD Container */}
      <div className="relative flex flex-col items-center justify-center w-full h-full max-w-lg">
        
        {/* Outer Ring */}
        <div className="absolute w-80 h-80 rounded-full border border-teal-500/10 animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute w-72 h-72 rounded-full border border-dashed border-teal-500/20 animate-[spin_15s_linear_infinite_reverse]"></div>
        
        {/* Center Progress */}
        <div className="flex flex-col items-center z-10 p-12">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-teal-500 blur-xl opacity-20 rounded-full"></div>
            <Cpu size={64} className="relative text-teal-400 animate-pulse" />
          </div>
          
          <div className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-teal-300 to-teal-700">
            {count}%
          </div>
          
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="h-1 w-48 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="h-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)] transition-all duration-75 ease-out" 
                style={{ width: `${count}%` }}
              />
            </div>
            <span className="text-xs tracking-[0.2em] text-teal-400/70 uppercase animate-pulse">{status}</span>
          </div>
        </div>

        {/* Decorative HUD Elements */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent"></div>
        <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-teal-500/20 to-transparent"></div>
        
        <div className="absolute bottom-10 left-10 text-[10px] text-teal-500/40 font-mono hidden md:block">
          <div>SYS_ID: 0x4F82</div>
          <div>SECURE_CONN: TRUE</div>
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
        className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-teal-500 transition-all duration-150 ease-out hidden md:flex items-center justify-center mix-blend-difference
          ${isHovering ? 'w-12 h-12 bg-teal-500/20' : 'w-8 h-8'}
        `}
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`
        }}
      />
      <div 
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-teal-500 rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`
        }}
      />
    </>
  );
};

// --- Main Components ---

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'projects', 'skills', 'experience', 'certifications', 'contact'];
      if (window.scrollY < 300) {
        setActiveSection("");
        return;
      }
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if ((rect.top >= 0 && rect.top <= window.innerHeight / 2) || (rect.top < 0 && rect.bottom > window.innerHeight / 2)) {
             const title = id.charAt(0).toUpperCase() + id.slice(1);
             setActiveSection(title === 'Certifications' ? 'Awards' : title);
             break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="
        fixed
        left-1/2 -translate-x-1/2
        top-32
        z-50
        w-[90%] md:w-auto md:min-w-[200px]
        rounded-full
        bg-white/80 dark:bg-slate-900/80
        backdrop-blur-md
        border border-slate-200/50 dark:border-slate-700/50
        shadow-lg
        transition-all duration-300
        px-6
      "
    >
      <div className="flex justify-between items-center gap-4 py-3">
        <a href="#" className={`text-2xl font-bold text-teal-500 tracking-tighter hover:scale-105 transition-transform ${activeSection ? 'hidden md:block' : 'block'}`}>W.</a>
        
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
            {activeSection && (
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-top-2 whitespace-nowrap">
                    {activeSection}
                </span>
            )}
        </div>

        <div className="hidden lg:flex items-center ml-auto">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="lg:hidden flex items-center gap-4 ml-auto">
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 hover:text-teal-500">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-slate-900/95 absolute top-full left-0 w-full mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl animate-in slide-in-from-top-2 overflow-hidden shadow-xl">
          <div className="px-6 py-6 flex flex-col space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
               <span className="text-sm font-bold text-slate-500">Theme</span>
               <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
               >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
               </button>
            </div>
            {["About", "Projects", "Skills", "Experience", "Awards", "Contact"].map((link) => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`} 
                className="text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-teal-500 hover:pl-2 transition-all"
                onClick={() => setIsOpen(false)}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const SideRibbonNavigation = () => {
  const sections = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'certifications', label: 'Awards' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="fixed right-0 top-32 h-[calc(100vh-16rem)] w-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-l border-y border-slate-200 dark:border-slate-800 z-40 hidden lg:flex flex-col justify-center items-center py-10 shadow-lg rounded-tl-3xl rounded-bl-3xl">
      <div className="flex flex-col gap-10 h-full justify-center"> 
      {sections.map((section) => (
        <a 
          key={section.id} 
          href={`#${section.id}`}
          className="group relative flex items-center justify-center w-full"
        >
          <span className="vertical-text text-xs font-bold uppercase tracking-[0.25em] text-slate-400 group-hover:text-teal-500 transition-colors duration-300 whitespace-nowrap cursor-pointer hover:scale-110" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
            {section.label}
          </span>
          <div className="absolute right-0 w-1 h-0 bg-teal-500 group-hover:h-full transition-all duration-300 rounded-l-full"></div>
        </a>
      ))}
      </div>
    </div>
  );
};

const Hero = ({ blurPx }) => {
  const scrollToContact = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-300 bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: `url(${BACKGROUNDS.hero})` }}
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

      <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center relative z-10 pt-20 md:pt-0">
        <div className="space-y-8">
          <p className="text-teal-500 font-mono text-lg md:text-xl flex items-center gap-2">
            <span className="w-10 h-px bg-teal-500"></span> Hello, I'm
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
            {PERSONAL_INFO.name}
          </h1>
          <h2 className="text-2xl md:text-4xl text-slate-600 dark:text-slate-400 font-light">
            <span className="text-teal-500 font-semibold">Data</span> Enthusiast and <span className="text-teal-500 font-semibold">AI/ML</span> Enthusiast
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
            <Activity size={24} className="text-teal-500" />
            Data Analyst In Kawan Lama
          </p>
          
          <div className="flex flex-wrap gap-3 pt-4">
            <a href="#contact" onClick={scrollToContact} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 text-lg rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-teal-500/20 hover:-translate-y-1">
              <Mail size={20} /> Contact Me
            </a>
            <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="border border-slate-300 dark:border-slate-600 hover:border-teal-500 text-slate-600 dark:text-slate-300 hover:text-teal-500 dark:hover:text-teal-400 py-3 px-6 text-lg rounded-full transition-all flex items-center gap-2 hover:-translate-y-1">
              <LinkedinIcon size={20} /> LinkedIn
            </a>
            <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="border border-slate-300 dark:border-slate-600 hover:border-teal-500 text-slate-600 dark:text-slate-300 hover:text-teal-500 dark:hover:text-teal-400 py-3 px-6 text-lg rounded-full transition-all flex items-center gap-2 hover:-translate-y-1">
              <GithubIcon size={20} /> GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const About = ({ blurPx }) => {
  return (
    <section id="about" className="py-20 pt-40 relative transition-colors duration-300 scroll-mt-28 bg-slate-50 dark:bg-slate-950">
       <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: `url(${BACKGROUNDS.about})` }}
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
        <SectionHeader title="About Me" />
        <div className="bg-white/80 dark:bg-slate-900/80 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-teal-500/30 transition-all backdrop-blur-md">
          <div className="text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-loose whitespace-pre-line">
            {PERSONAL_INFO.about}
          </div>
        </div>
      </div>
    </section>
  );
};

const Projects = ({ blurPx }) => {
  return (
    <section id="projects" className="py-20 pt-32 relative transition-colors duration-300 scroll-mt-32 bg-slate-50 dark:bg-slate-950">
       <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: `url(${BACKGROUNDS.projects})` }}
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
        <SectionHeader title="Featured Projects" subtitle="A selection of my work in Data Analysis and Automation." />
        <div className="space-y-16 mb-12">
          {PROJECTS.map((project) => (
            <a 
              key={project.id} 
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-2xl h-[500px] md:h-[600px]"
            >
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex flex-col justify-end p-8 transition-opacity duration-300 group-hover:opacity-0">
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-2 shadow-black drop-shadow-md">{project.title}</h3>
                <div className="w-20 h-2 bg-teal-500 rounded-full"></div>
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
                <h3 className="text-3xl md:text-5xl font-bold text-teal-400 mb-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {project.title}
                </h3>

                <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-3xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-3 justify-center mb-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-100">
                  {project.tech.map((t, i) => (
                    <span key={i} className="text-sm md:text-base font-medium bg-teal-500/10 text-teal-300 px-5 py-2 rounded-full border border-teal-500/20">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="inline-flex items-center gap-2 text-white bg-teal-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-500 transition-colors shadow-lg">
                  View Details <ArrowRight size={22} />
                </div>
              </div>
            </a>
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

  return (
    <section id="experience" className="py-20 relative transition-colors duration-300 scroll-mt-20 bg-slate-50 dark:bg-slate-900">
       <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: `url(${BACKGROUNDS.experience})` }}
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
        <SectionHeader title="Experience" />
        <div className="space-y-12">
          {EXPERIENCE.map((exp) => (
            <div key={exp.id} className="relative pl-8 md:pl-0">
              <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700 -translate-x-1/2"></div>
              <div className={`md:flex items-center justify-between ${exp.id % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className={`hidden md:block w-[45%] ${exp.id % 2 === 0 ? 'text-left' : 'text-right'}`}>
                  <span className="text-teal-500 font-mono text-sm">{exp.date}</span>
                </div>
                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-teal-500 rounded-full border-4 border-slate-50 dark:border-slate-900 -translate-x-[5px] md:-translate-x-1/2 mt-1.5 md:mt-0"></div>
                <div className="w-full md:w-[45%]">
                  <div className="md:hidden text-teal-500 font-mono text-sm mb-1">{exp.date}</div>
                  <div className="bg-white/80 dark:bg-slate-900/80 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow group backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{exp.role}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{exp.company}</span>
                      <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">{exp.type}</span>
                    </div>
                    {exp.description}
                    {exp.highlight && (
                      <button 
                        onClick={() => openCertificate(exp.certificateImage, exp.highlight)}
                        className="flex items-start gap-2 bg-teal-500/10 p-3 rounded-lg border border-teal-500/20 hover:bg-teal-500/20 transition-colors w-full text-left group cursor-pointer mt-3"
                      >
                        <Award size={16} className="text-teal-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-teal-600 dark:text-teal-200 text-xs font-semibold group-hover:underline">{exp.highlight}</p>
                          <p className="text-slate-500 text-[10px]">Click to view certificate</p>
                        </div>
                      </button>
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

const Contact = ({ blurPx }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = `Portfolio Contact from ${formData.name}`;
    const body = `${formData.message}%0D%0A%0D%0AFrom: ${formData.name} (${formData.email})`;
    window.location.href = `mailto:${PERSONAL_INFO.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-20 relative transition-colors duration-300 bg-slate-50 dark:bg-slate-900">
       <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: `url(${BACKGROUNDS.contact})` }}
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

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <SectionHeader title="Get In Touch" />
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg leading-relaxed">
              I am currently open to opportunities in Data Analysis, Data Science, and Machine Learning. 
              Whether you have a question, a project collaboration idea, or just want to say hi, I'll try my best to get back to you!
            </p>
            
            <div className="space-y-6">
              <a href={`mailto:${PERSONAL_INFO.email}`} className="flex items-center gap-4 text-slate-600 dark:text-slate-300 hover:text-teal-500 transition-colors group">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-teal-500 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-teal-500 transition-all group-hover:scale-110">
                  <Mail size={20} />
                </div>
                <span>{PERSONAL_INFO.email}</span>
              </a>
              <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-slate-600 dark:text-slate-300 hover:text-teal-500 transition-colors group">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-teal-500 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-teal-500 transition-all group-hover:scale-110">
                  <LinkedinIcon size={20} />
                </div>
                <span>LinkedIn Profile</span>
              </a>
              <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-slate-600 dark:text-slate-300 hover:text-teal-500 transition-colors group">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-teal-500 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-teal-500 transition-all group-hover:scale-110">
                  <GithubIcon size={20} />
                </div>
                <span>GitHub Profile</span>
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-white/80 dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-sm">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-slate-500 dark:text-slate-400 mb-1">Name</label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
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
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
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
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                placeholder="Write your message here... I'm available for hiring!"
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-teal-500/20"
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
        <a href={PERSONAL_INFO.linkedin} className="hover:text-teal-500"><LinkedinIcon size={18} /></a>
        <a href={PERSONAL_INFO.github} className="hover:text-teal-500"><GithubIcon size={18} /></a>
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
        if (savedTheme) {
          return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } catch (e) {
      console.warn('LocalStorage access denied or error:', e);
    }
    return true; 
  });

  const [isLoading, setIsLoading] = useState(true);
  const [blurPx, setBlurPx] = useState(0);

  const openCertificate = (image, title) => {
    setSelectedImage(image);
    setSelectedTitle(title);
    setModalOpen(true);
  };

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    try {
      const root = window.document.documentElement;
      if (next) {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (e) {}
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      try { localStorage.setItem('theme', 'dark'); } catch(e) {}
    } else {
      root.classList.remove('dark');
      try { localStorage.setItem('theme', 'light'); } catch(e) {}
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y < 120) {
        setBlurPx(0);
      } else if (y < 360) {
        setBlurPx(1);
      } else {
        setBlurPx(1);
      }
    };
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); 
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return <FuturisticLoader onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className={`min-h-screen font-sans selection:bg-teal-500/30 ${isDarkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors duration-300`}>
      <CustomCursor />
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <SideRibbonNavigation />
      
      <div>
        <Hero blurPx={blurPx} />
        <About blurPx={blurPx} />
        <Projects blurPx={blurPx} />
        
        {/* FIX: Title "Skills", Card style reverted to vertical w-72 */}
        <StickyScrollSection 
          id="skills"
          title="Skills"
          subtitle="Tools and technologies I use to drive insights."
          items={SKILLS}
          bgImage={BACKGROUNDS.skills}
          blurPx={blurPx}
          renderCard={(skill, index) => (
            <div key={index} className="bg-white/90 dark:bg-slate-900/90 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition-all w-72 shrink-0 flex flex-col items-center text-center justify-center gap-4 group shadow-sm hover:shadow-md backdrop-blur-sm">
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 p-2 transition-transform group-hover:scale-110">
                <img src={skill.image} alt={skill.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200">{skill.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{skill.category}</p>
              </div>
            </div>
          )}
        />

        <Experience blurPx={blurPx} />

        <StickyScrollSection 
          id="certifications"
          title="Certifications & Awards"
          subtitle="Recognitions of my expertise and dedication."
          items={CERTIFICATIONS}
          bgImage={BACKGROUNDS.certifications}
          blurPx={blurPx}
          renderCard={(cert, index) => (
            <a 

              key={index} 

              href={cert.link || "#"}

              target="_blank"

              rel="noopener noreferrer"

              className="bg-white/90 dark:bg-slate-900/90 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-teal-500/50 transition-all w-96 shrink-0 h-64 cursor-pointer group shadow-sm hover:shadow-md backdrop-blur-sm block"
            >
              <div>
                {/* Check if image is a logo (small) or certificate (large) */}
                <div className="mb-6 h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700">
                    <img src={cert.image} alt={cert.issuer} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight group-hover:text-teal-500 transition-colors">{cert.title}</h3>
                <p className="text-slate-500 dark:text-slate-400">{cert.issuer}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm">
                <span className="text-slate-500">{cert.date}</span>
                {cert.credentialId && (

                  <span className="font-mono text-slate-600 truncate max-w-[120px]">{cert.credentialId}</span>

                )}

              </div>

            </a>
          )}
        />

        <CertificateModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          imageSrc={selectedImage} 
          title={selectedTitle} 
        />

        <Contact blurPx={blurPx} />
        <Footer />
      </div>
    </div>
  );
}