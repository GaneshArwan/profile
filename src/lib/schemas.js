/**
 * src/lib/schemas.js
 * Comprehensive Zod Runtime Validation Schemas for William's Portfolio
 * Verified Enterprise Data & Engineering Schemas
 * 
 * Complies with PROJECT.md Interface Contracts and strict runtime validation.
 */
import { z } from 'zod';

const isHttpUrl = (val) => !val || /^https?:\/\//i.test(val);
const urlProtocolRefinement = { message: 'URL must use https or http protocol' };
const noNullByte = (val) => typeof val !== 'string' || !val.includes('\0');
const nullByteRefinement = { message: 'Null bytes are not allowed' };

// 1. Personal Information & Education Schemas

export const educationItemSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  gpa: z.string().min(1, 'GPA is required'),
  period: z.string().min(1, 'Period is required'),
  honors: z.string().optional(),
  location: z.string().optional(),
  relevantCourses: z.array(z.string()).optional(),
});

export const telemetryStatSchema = z.object({
  label: z.string().min(1, 'Stat label is required'),
  value: z.string().min(1, 'Stat value is required'),
  detail: z.string().min(1, 'Stat detail description is required'),
});

export const personalInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  role: z.string().optional(), // Legacy backward compatibility
  email: z.string().email('Valid email is required'),
  location: z.string().min(1, 'Location is required'),
  github: z.string().url('GitHub profile must be a valid URL').refine(isHttpUrl, urlProtocolRefinement),
  linkedin: z.string().url('LinkedIn profile must be a valid URL').refine(isHttpUrl, urlProtocolRefinement),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  about: z.string().optional(), // Legacy backward compatibility
  education: z.array(educationItemSchema).default([]),
  telemetryStats: z.array(telemetryStatSchema).default([]),
});

// 2. Experience & Domain Schemas

export const domainSchema = z.object({
  name: z.string().min(1, 'Domain name is required'),
  label: z.string().optional(),
  description: z.string().min(1, 'Domain description is required'),
  metrics: z.string().min(1, 'Domain metrics are required'),
  details: z.array(z.string()).optional(),
});

export const experienceAwardSchema = z.object({
  title: z.string().min(1, 'Award title is required'),
  issuer: z.string().min(1, 'Award issuer is required'),
  credentialUrl: z.string().url('Credential URL must be valid').refine(isHttpUrl, urlProtocolRefinement).optional().or(z.literal('')),
  date: z.string().optional(),
});

export const experienceItemSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role title is required'),
  period: z.string().min(1, 'Period is required'),
  date: z.string().optional(), // Legacy backward compatibility
  type: z.string().min(1, 'Employment type is required'),
  location: z.string().optional(),
  summary: z.string().optional(),
  description: z.custom(
    (val) => {
      if (typeof val === 'string') return val.trim().length > 0;
      if (!val || typeof val !== 'object' || Array.isArray(val)) return false;
      if (typeof Symbol !== 'undefined' && (val.$$typeof || val.type)) return true;
      return Object.keys(val).length > 0;
    },
    { message: 'Description must be a non-empty string or React element' }
  ),
  domains: z.array(domainSchema).optional(),
  achievements: z.array(z.string()).default([]),
  award: experienceAwardSchema.optional(),
  highlight: z.string().nullable().optional(), // Legacy backward compatibility
  link: z.string().nullable().optional(), // Legacy backward compatibility
  certificate: z.string().nullable().optional(),
  tech: z.array(z.string()).optional(),
});

// 3. Projects & GitHub Metadata Schemas

export const technicalIndicatorSchema = z.object({
  label: z.string().min(1, 'Indicator label is required'),
  value: z.string().min(1, 'Indicator value is required'),
  detail: z.string().optional(),
  type: z.enum(['architecture', 'latency', 'metric', 'security', 'verification', 'throughput']).optional(),
});

export const technicalMoatSchema = z.object({
  architecture: z.string().optional(),
  primaryMetric: z.string().optional(),
  verificationStatus: z.string().optional(),
  testCoverage: z.string().optional(),
  throughputOrLatency: z.string().optional(),
  indicators: z.array(technicalIndicatorSchema).optional(),
});

export const githubStatsSchema = z.object({
  stars: z.number().int().nonnegative().default(0),
  language: z.string().min(1, 'Primary language is required'),
  topics: z.array(z.string()).default([]),
  forks: z.number().int().nonnegative().optional(),
  openIssues: z.number().int().nonnegative().optional(),
});

export const projectMediaItemSchema = z.object({
  type: z.enum(['image', 'video']).default('image'),
  src: z.string().min(1, 'Media source path is required'),
  poster: z.string().optional(),
  caption: z.string().min(1).optional(),
  captionEn: z.string().min(1).optional(),
  captionId: z.string().min(1).optional(),
}).refine(
  (item) => Boolean(item.caption || (item.captionEn && item.captionId)),
  { message: 'Media item requires caption or bilingual captionEn/captionId' }
);

export const projectWorkflowStepSchema = z.object({
  step: z.string().min(1),
  title: z.string().min(1),
  detail: z.string().min(1),
});

export const projectSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string().min(1, 'Project title is required'),
  category: z.enum(['ai', 'data', 'automation'], {
    errorMap: () => ({ message: "Category must be 'ai', 'data', or 'automation'" }),
  }),
  flagship: z.boolean().optional(),
  description: z.string().min(10, 'Project description must be at least 10 characters'),
  highlights: z.array(z.string()).default([]),
  tech: z.array(z.string()).min(1, 'At least one tech stack item is required'),
  repoUrl: z.string().url('Repository URL must be a valid URL').refine(isHttpUrl, urlProtocolRefinement),
  liveUrl: z.string().url('Live URL must be a valid URL').refine(isHttpUrl, urlProtocolRefinement).nullable().optional().or(z.literal('')),
  // Compatibility with existing Projects.jsx
  link: z.string().url().refine(isHttpUrl, urlProtocolRefinement).optional(),
  liveLink: z.string().url().refine(isHttpUrl, urlProtocolRefinement).nullable().optional().or(z.literal('')),
  image: z.string().optional(),
  media: z.array(projectMediaItemSchema).optional(),
  workflowSteps: z.array(projectWorkflowStepSchema).optional(),
  workflowMermaid: z.string().optional(),
  technicalBadge: z.string().optional(),
  technicalMetric: z.string().optional(),
  metricBadgeLabel: z.string().optional(),
  technicalMoat: technicalMoatSchema.optional(),
  technicalIndicators: z.array(technicalIndicatorSchema).optional(),
  githubStats: githubStatsSchema.optional(),
});

// 4. Skills & Technical Competency Matrix Schemas

export const skillItemSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  level: z.string().optional(),
  context: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  category: z.string().optional(),
});

export const skillCategorySchema = z.object({
  category: z.string().min(1, 'Category name is required'),
  description: z.string().min(1, 'Category description is required'),
  skills: z.array(skillItemSchema).min(1, 'At least one skill item is required'),
});

export const legacySkillSchema = z.object({
  name: z.string().min(1),
  image: z.string().min(1),
  category: z.string().min(1),
});

// 5. Certifications & Background Assets Schemas

export const certificationSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  title: z.string().min(1, 'Certification title is required'),
  issuer: z.string().min(1, 'Certification issuer is required'),
  date: z.string().optional(),
  url: z.string().url('Certification URL must be a valid URL').refine(isHttpUrl, urlProtocolRefinement).optional().or(z.literal('')),
  link: z.string().url().refine(isHttpUrl, urlProtocolRefinement).optional().or(z.literal('')), // Legacy alias
  credentialId: z.string().optional(),
  image: z.string().optional(),
});

export const backgroundAssetsSchema = z.object({
  hero: z.string().min(1),
  about: z.string().min(1),
  skills: z.string().min(1),
  experience: z.string().min(1),
  projects: z.string().min(1),
  certifications: z.string().min(1),
  contact: z.string().min(1),
});

export const heroVideosSchema = z.object({
  light: z.string().min(1),
  dark: z.string().min(1),
});

// 6. Contact Form Validation Contract

export const contactFormSchema = z.object({
  name: z
    .string({ required_error: 'Name is required', message: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .refine(noNullByte, nullByteRefinement),
  email: z
    .string({ required_error: 'Email is required', message: 'Email is required' })
    .trim()
    .email('Please enter a valid email address')
    .max(254, 'Email must be at most 254 characters')
    .refine(noNullByte, nullByteRefinement),
  message: z
    .string({ required_error: 'Message is required', message: 'Message is required' })
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be at most 5000 characters')
    .refine(noNullByte, nullByteRefinement),
});

// 7. Master Portfolio Store Schema

export const portfolioDataSchema = z.object({
  PERSONAL_INFO: personalInfoSchema.optional(),
  personalInfo: personalInfoSchema.optional(),
  EXPERIENCE: z.array(experienceItemSchema).optional(),
  experience: z.array(experienceItemSchema).optional(),
  PROJECTS: z.array(projectSchema).optional(),
  projects: z.array(projectSchema).optional(),
  SKILL_CATEGORIES: z.array(skillCategorySchema).optional(),
  skillCategories: z.array(skillCategorySchema).optional(),
  SKILLS: z.array(z.union([skillItemSchema, legacySkillSchema])).optional(),
  skills: z.array(z.union([skillItemSchema, legacySkillSchema])).optional(),
  CERTIFICATIONS: z.array(certificationSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  REMOTE_BACKGROUNDS: backgroundAssetsSchema.optional(),
  LOCAL_BACKGROUNDS: backgroundAssetsSchema.optional(),
  HERO_VIDEOS: heroVideosSchema.optional(),
}).refine(
  (data) => (data.PERSONAL_INFO || data.personalInfo) && 
            (data.EXPERIENCE || data.experience) && 
            (data.PROJECTS || data.projects),
  { message: 'Portfolio data must include personalInfo, experience, and projects' }
);

// 8. Runtime Validation & Helper Utilities

/**
 * Normalizes Zod issues across Zod v3 and v4 into a flat { [field]: message } map.
 * In Zod 4.x, error.issues is standard, while error.errors is undefined.
 * 
 * @param {Array} issues 
 * @returns {Record<string, string>}
 */
export function formatZodIssues(issues = []) {
  const safeIssues = Array.isArray(issues) ? issues : [];
  const formatted = {};
  for (const issue of safeIssues) {
    if (!issue || typeof issue !== 'object') continue;
    const path = Array.isArray(issue.path) ? issue.path : [];
    const field = path[0] || '_general';
    if (!formatted[field]) {
      formatted[field] = typeof issue.message === 'string' ? issue.message : 'Invalid value';
    }
  }
  return formatted;
}

/**
 * Validates contact form submission data.
 * Returns { success: true, data } or { success: false, errors: { [field]: message } }.
 * 
 * @param {object} formData 
 * @returns {{ success: boolean, data?: object, errors: Record<string, string>, rawIssues?: Array }}
 */
export function validateContactForm(formData) {
  const result = contactFormSchema.safeParse(formData);
  if (!result.success) {
    const issues = result.error.issues || result.error.errors || [];
    return {
      success: false,
      errors: formatZodIssues(issues),
      rawIssues: issues,
    };
  }
  return {
    success: true,
    data: result.data,
    errors: {},
  };
}

/**
 * Validates portfolio data dictionary against portfolioDataSchema.
 * 
 * @param {object} data
 * @param {object} [options]
 * @param {boolean} [options.strict=false]
 * @returns {{ valid: boolean, errors?: Array, formatted?: object, message?: string, data?: object }}
 */
export function validatePortfolioData(data, options = {}) {
  const strict = Boolean(options && options.strict);
  const result = portfolioDataSchema.safeParse(data);
  if (!result.success) {
    const issues = Array.isArray(result.error?.issues)
      ? result.error.issues
      : (Array.isArray(result.error?.errors) ? result.error.errors : []);
    const errorMessages = issues
      .map((err) => `[${Array.isArray(err.path) ? err.path.join('.') : ''}] ${err.message || 'Validation error'}`)
      .join('\n  ');

    const isDev = Boolean(
      (typeof import.meta !== 'undefined' && import.meta.env?.DEV) ||
      (typeof globalThis !== 'undefined' && globalThis.process?.env?.NODE_ENV !== 'production')
    );

    if (strict || isDev) {
      console.error(`[Zod Schema Validation Error] Portfolio data failed validation:\n  ${errorMessages}`);
    }

    return {
      valid: false,
      errors: issues,
      formatted: typeof result.error?.format === 'function' ? result.error.format() : {},
      message: errorMessages,
    };
  }
  return {
    valid: true,
    data: result.data,
  };
}

/**
 * Development assertion helper for constants.jsx.
 * Validates in DEV environment and warns without breaking production builds.
 * 
 * @param {object} data 
 * @returns {object} data passed in
 */
export function assertValidPortfolio(data) {
  const isDev = Boolean(
    (typeof import.meta !== 'undefined' && import.meta.env?.DEV) ||
    (typeof globalThis !== 'undefined' && globalThis.process?.env?.NODE_ENV !== 'production')
  );

  if (isDev) {
    const check = validatePortfolioData(data, { strict: false });
    if (!check.valid) {
      console.warn('[Zod Runtime Validation Warning] Schema deviations detected in portfolio constants:', check.errors);
    }
  }
  return data;
}
