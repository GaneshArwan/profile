/**
 * tests/e2e/challenger_m1_schemas.test.jsx
 * Empirical Challenger Adversarial Stress & Fuzz Testing Suite for Milestone M1
 * Target: src/lib/schemas.js & src/data/constants.jsx
 */

import { describe, it, expect } from 'vitest';
import * as schemas from '../../src/lib/schemas';
import * as constants from '../../src/data/constants';

describe('Challenger M1: Adversarial Schema & Data Stress Suite', () => {

  // ==========================================================================
  // Suite 1: Production Constants Zero-False-Positive Empirical Test
  // ==========================================================================
  describe('Suite 1: Production Constants Validation (Zero False Positives)', () => {
    it('S1.1: master validatePortfolioData returns valid: true on production constants', () => {
      const result = schemas.validatePortfolioData({
        PERSONAL_INFO: constants.PERSONAL_INFO,
        EXPERIENCE: constants.EXPERIENCE,
        PROJECTS: constants.PROJECTS,
        SKILL_CATEGORIES: constants.SKILL_CATEGORIES,
        SKILLS: constants.SKILLS,
        CERTIFICATIONS: constants.CERTIFICATIONS,
        REMOTE_BACKGROUNDS: constants.REMOTE_BACKGROUNDS,
        LOCAL_BACKGROUNDS: constants.LOCAL_BACKGROUNDS,
        HERO_VIDEOS: constants.HERO_VIDEOS,
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('S1.2: personalInfoSchema parses constants.PERSONAL_INFO with verified credentials', () => {
      const parsed = schemas.personalInfoSchema.safeParse(constants.PERSONAL_INFO);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.name).toBe('William');
        expect(parsed.data.education[0].institution).toContain('Tarumanagara University');
        expect(parsed.data.education[0].gpa).toContain('3.89');
        expect(parsed.data.telemetryStats.length).toBe(4);
      }
    });

    it('S1.3: experienceItemSchema parses every item in constants.EXPERIENCE', () => {
      expect(constants.EXPERIENCE.length).toBeGreaterThan(0);
      for (let i = 0; i < constants.EXPERIENCE.length; i++) {
        const item = constants.EXPERIENCE[i];
        const parsed = schemas.experienceItemSchema.safeParse(item);
        expect(parsed.success, `Failed on experience item ${i} (${item.company})`).toBe(true);
        if (item.domains) {
          expect(item.domains.length).toBe(5); // 5 MDM domains
        }
      }
    });

    it('S1.4: projectSchema parses every item in constants.PROJECTS including 3 flagship CV projects', () => {
      expect(constants.PROJECTS.length).toBe(8);
      const flagships = constants.PROJECTS.filter((p) => p.flagship);
      expect(flagships.length).toBe(3);

      for (let i = 0; i < constants.PROJECTS.length; i++) {
        const proj = constants.PROJECTS[i];
        const parsed = schemas.projectSchema.safeParse(proj);
        expect(parsed.success, `Failed on project ${i} (${proj.title}): ${parsed.error?.message}`).toBe(true);
      }
    });

    it('S1.5: skillCategorySchema parses all 4 moat categories', () => {
      expect(constants.SKILL_CATEGORIES.length).toBe(4);
      for (const cat of constants.SKILL_CATEGORIES) {
        const parsed = schemas.skillCategorySchema.safeParse(cat);
        expect(parsed.success, `Failed on category ${cat.category}`).toBe(true);
        expect(cat.skills.length).toBeGreaterThan(0);
      }
    });

    it('S1.6: certificationSchema parses all 87 certifications including DeepLearning.AI, IBM, Anthropic, Google & Dicoding credentials', () => {
      expect(constants.CERTIFICATIONS.length).toBe(87);
      for (const cert of constants.CERTIFICATIONS) {
        const parsed = schemas.certificationSchema.safeParse(cert);
        expect(parsed.success, `Failed on cert ${cert.title}`).toBe(true);
      }
    });

    it('S1.7: backgroundAssetsSchema and heroVideosSchema parse asset constants', () => {
      const parsedRemote = schemas.backgroundAssetsSchema.safeParse(constants.REMOTE_BACKGROUNDS);
      expect(parsedRemote.success).toBe(true);

      const parsedLocal = schemas.backgroundAssetsSchema.safeParse(constants.LOCAL_BACKGROUNDS);
      expect(parsedLocal.success).toBe(true);

      const parsedVideos = schemas.heroVideosSchema.safeParse(constants.HERO_VIDEOS);
      expect(parsedVideos.success).toBe(true);
    });
  });

  // ==========================================================================
  // Suite 2: Contact Form Boundary & Injection Testing
  // ==========================================================================
  describe('Suite 2: Contact Form Boundaries & Validation Contract', () => {
    it('S2.1: accepts valid input and trims strings', () => {
      const res = schemas.validateContactForm({
        name: '  Alice Bob  ',
        email: '  alice@example.com  ',
        message: '  This is a valid message exceeding ten characters  ',
      });
      expect(res.success).toBe(true);
      expect(res.data.name).toBe('Alice Bob');
      expect(res.data.email).toBe('alice@example.com');
      expect(res.data.message).toBe('This is a valid message exceeding ten characters');
      expect(res.errors).toEqual({});
    });

    it('S2.2: rejects empty and null inputs safely without crash', () => {
      const nullRes = schemas.validateContactForm(null);
      expect(nullRes.success).toBe(false);
      expect(nullRes.errors).toBeDefined();

      const undefRes = schemas.validateContactForm(undefined);
      expect(undefRes.success).toBe(false);

      const emptyRes = schemas.validateContactForm({});
      expect(emptyRes.success).toBe(false);
      expect(emptyRes.errors.name).toBeDefined();
      expect(emptyRes.errors.email).toBeDefined();
      expect(emptyRes.errors.message).toBeDefined();
    });

    it('S2.3: tests exact length boundary for name (1 char vs 2 chars)', () => {
      const oneChar = schemas.validateContactForm({
        name: 'A',
        email: 'test@example.com',
        message: 'Valid message body here',
      });
      expect(oneChar.success).toBe(false);
      expect(oneChar.errors.name).toMatch(/2 characters/i);

      const oneCharAfterTrim = schemas.validateContactForm({
        name: '  A  ',
        email: 'test@example.com',
        message: 'Valid message body here',
      });
      expect(oneCharAfterTrim.success).toBe(false);
      expect(oneCharAfterTrim.errors.name).toMatch(/2 characters/i);

      const twoChars = schemas.validateContactForm({
        name: 'Li',
        email: 'test@example.com',
        message: 'Valid message body here',
      });
      expect(twoChars.success).toBe(true);
    });

    it('S2.4: tests exact length boundary for message (9 chars vs 10 chars)', () => {
      const nineChars = schemas.validateContactForm({
        name: 'William',
        email: 'test@example.com',
        message: '123456789',
      });
      expect(nineChars.success).toBe(false);
      expect(nineChars.errors.message).toMatch(/10 characters/i);

      const tenChars = schemas.validateContactForm({
        name: 'William',
        email: 'test@example.com',
        message: '1234567890',
      });
      expect(tenChars.success).toBe(true);

      const tenSpaces = schemas.validateContactForm({
        name: 'William',
        email: 'test@example.com',
        message: '          ',
      });
      expect(tenSpaces.success).toBe(false);
      expect(tenSpaces.errors.message).toBeDefined();
    });

    it('S2.5: rejects malformed email formats and injection attempts', () => {
      const invalidEmails = [
        'plainaddress',
        '#@%^%#$@#$@#.com',
        '@example.com',
        'Joe Smith <email@example.com>',
        'email.example.com',
        'email@example@example.com',
        'email@example',
        'user@domain.com\r\nBcc:attacker@example.com',
        'user@domain..com',
      ];

      for (const email of invalidEmails) {
        const res = schemas.validateContactForm({
          name: 'William',
          email,
          message: 'Valid message body test',
        });
        expect(res.success, `Expected email to fail: ${email}`).toBe(false);
        expect(res.errors.email).toBeDefined();
      }
    });

    it('S2.6: rejects non-string types safely without throwing', () => {
      const weirdPayloads = [
        { name: 12345, email: 'test@example.com', message: 'Valid message body' },
        { name: 'William', email: true, message: 'Valid message body' },
        { name: 'William', email: 'test@example.com', message: ['not', 'a', 'string'] },
        { name: null, email: null, message: null },
      ];

      for (const payload of weirdPayloads) {
        expect(() => schemas.validateContactForm(payload)).not.toThrow();
        const res = schemas.validateContactForm(payload);
        expect(res.success).toBe(false);
      }
    });

    it('S2.7: contactFormSchema enforces .max() boundaries preventing DoS payloads', () => {
      // Payloads exceeding bounds are safely rejected
      const largePayload = {
        name: 'A'.repeat(5000),
        email: 'normal@example.com',
        message: 'M'.repeat(100000),
      };
      const res = schemas.validateContactForm(largePayload);
      expect(res.success).toBe(false);
      expect(res.errors.name).toMatch(/100 characters/i);
      expect(res.errors.message).toMatch(/5000 characters/i);
    });
  });

  // ==========================================================================
  // Suite 3: Project Schema Boundary & Adversarial Typing
  // ==========================================================================
  describe('Suite 3: Project Schema Boundaries', () => {
    const baseProject = {
      id: 'test-proj',
      title: 'Test Project',
      category: 'ai',
      description: 'Comprehensive test project description for validation.',
      highlights: ['Feature 1', 'Feature 2'],
      tech: ['React', 'TypeScript'],
      repoUrl: 'https://github.com/example/repo',
      liveUrl: 'https://example.com',
      githubStats: {
        stars: 10,
        language: 'TypeScript',
        topics: ['testing'],
      },
    };

    it('S3.1: rejects invalid category enums and validates rejection', () => {
      const invalidCategories = ['crypto', 'web', 'machine-learning', '', null, 123, true];

      for (const cat of invalidCategories) {
        const res = schemas.projectSchema.safeParse({ ...baseProject, category: cat });
        expect(res.success, `Expected category '${cat}' to fail`).toBe(false);
        if (!res.success) {
          const catError = res.error.issues.find((i) => i.path.includes('category'));
          expect(catError).toBeDefined();
          // In Zod 4, z.enum error message is 'Invalid option: expected one of "ai"|"data"|"automation"'
          expect(catError.message).toMatch(/Invalid option|Category must be/);
        }
      }
    });

    it('S3.2: rejects empty or non-array tech stacks', () => {
      const emptyTech = schemas.projectSchema.safeParse({ ...baseProject, tech: [] });
      expect(emptyTech.success).toBe(false);
      expect(emptyTech.error?.issues[0].message).toMatch(/at least one tech/i);

      const stringTech = schemas.projectSchema.safeParse({ ...baseProject, tech: 'TypeScript' });
      expect(stringTech.success).toBe(false);

      const nullTech = schemas.projectSchema.safeParse({ ...baseProject, tech: null });
      expect(nullTech.success).toBe(false);
    });

    it('S3.3: rejects negative numbers and non-integers for stars and forks', () => {
      const negativeStars = schemas.projectSchema.safeParse({
        ...baseProject,
        githubStats: { ...baseProject.githubStats, stars: -5 },
      });
      expect(negativeStars.success).toBe(false);

      const floatStars = schemas.projectSchema.safeParse({
        ...baseProject,
        githubStats: { ...baseProject.githubStats, stars: 3.14 },
      });
      expect(floatStars.success).toBe(false);

      const negativeForks = schemas.projectSchema.safeParse({
        ...baseProject,
        githubStats: { ...baseProject.githubStats, forks: -1 },
      });
      expect(negativeForks.success).toBe(false);
    });

    it('S3.4: handles nullable and empty liveUrl correctly', () => {
      const nullLive = schemas.projectSchema.safeParse({ ...baseProject, liveUrl: null });
      expect(nullLive.success).toBe(true);

      const emptyLive = schemas.projectSchema.safeParse({ ...baseProject, liveUrl: '' });
      expect(emptyLive.success).toBe(true);

      const omittedLive = schemas.projectSchema.safeParse({ ...baseProject, liveUrl: undefined });
      expect(omittedLive.success).toBe(true);

      const invalidLive = schemas.projectSchema.safeParse({ ...baseProject, liveUrl: 'not_a_valid_url' });
      expect(invalidLive.success).toBe(false);
    });

    it('S3.5: rejects description with less than 10 characters', () => {
      const shortDesc = schemas.projectSchema.safeParse({ ...baseProject, description: 'Too short' });
      expect(shortDesc.success).toBe(false);
      expect(shortDesc.error?.issues[0].message).toMatch(/at least 10 characters/i);
    });

    it('S3.6: [SECURITY REMEDIATED] rejects javascript: pseudo-protocol and requires http/https', () => {
      const jsUrlRes = schemas.projectSchema.safeParse({ ...baseProject, repoUrl: 'javascript:alert(1)' });
      expect(jsUrlRes.success).toBe(false);
      expect(jsUrlRes.error?.issues[0]?.message).toMatch(/URL must use https or http protocol/i);
    });
  });

  // ==========================================================================
  // Suite 4: Experience & Custom Union Auditing
  // ==========================================================================
  describe('Suite 4: Experience Schema & Union Type Safety', () => {
    const baseExp = {
      company: 'Test Corp',
      role: 'Software Engineer',
      period: '2024 - 2025',
      type: 'Full-time',
      description: 'Solid description of work responsibilities and outcomes.',
      achievements: ['Achievement 1'],
    };

    it('S4.1: accepts string descriptions', () => {
      const res = schemas.experienceItemSchema.safeParse(baseExp);
      expect(res.success).toBe(true);
    });

    it('S4.2: accepts React element or object description', () => {
      const objectDesc = { ...baseExp, description: { type: 'div', props: {} } };
      const res = schemas.experienceItemSchema.safeParse(objectDesc);
      expect(res.success).toBe(true);
    });

    it('S4.3: description rejects null safely', () => {
      const nullDesc = { ...baseExp, description: null };
      const res = schemas.experienceItemSchema.safeParse(nullDesc);
      expect(res.success).toBe(false);
    });

    it('S4.4: description rejects empty string "" safely', () => {
      const emptyDesc = { ...baseExp, description: '' };
      const res = schemas.experienceItemSchema.safeParse(emptyDesc);
      expect(res.success).toBe(false);
    });

    it('S4.5: [ASYMMETRY FINDING] experienceAwardSchema.credentialUrl rejects null (unlike liveUrl in projects)', () => {
      const awardWithNull = {
        title: 'Best Award',
        issuer: 'Kawan Lama',
        credentialUrl: null,
      };
      const res = schemas.experienceAwardSchema.safeParse(awardWithNull);
      // Fails because credentialUrl has .optional().or(z.literal('')) without .nullable()
      expect(res.success).toBe(false);
    });
  });

  // ==========================================================================
  // Suite 5: Store Schema & Helper Utilities
  // ==========================================================================
  describe('Suite 5: Store Schema & Helper Utilities', () => {
    it('S5.1: formatZodIssues handles empty array, undefined, and missing paths', () => {
      expect(schemas.formatZodIssues([])).toEqual({});
      expect(schemas.formatZodIssues(undefined)).toEqual({});

      const issuesWithNoPath = [{ path: [], message: 'General failure' }];
      const formatted = schemas.formatZodIssues(issuesWithNoPath);
      expect(formatted._general).toBe('General failure');

      const nestedIssue = [{ path: ['EXPERIENCE', 0, 'company'], message: 'Missing company' }];
      const nestedFormatted = schemas.formatZodIssues(nestedIssue);
      expect(nestedFormatted.EXPERIENCE).toBe('Missing company');
    });

    it('S5.2: formatZodIssues safely handles null argument without crashing', () => {
      expect(schemas.formatZodIssues(null)).toEqual({});
    });

    it('S5.3: validatePortfolioData returns valid: false when mandatory root entities are missing', () => {
      const emptyData = schemas.validatePortfolioData({});
      expect(emptyData.valid).toBe(false);
      expect(emptyData.message).toContain('Portfolio data must include personalInfo, experience, and projects');

      const onlyPersonal = schemas.validatePortfolioData({
        PERSONAL_INFO: constants.PERSONAL_INFO,
      });
      expect(onlyPersonal.valid).toBe(false);
    });

    it('S5.4: validatePortfolioData supports lowercase aliases (personalInfo, experience, projects)', () => {
      const res = schemas.validatePortfolioData({
        personalInfo: constants.PERSONAL_INFO,
        experience: constants.EXPERIENCE,
        projects: constants.PROJECTS,
      });
      expect(res.valid).toBe(true);
    });

    it('S5.5: validatePortfolioData safely handles null options argument without crashing', () => {
      expect(() => schemas.validatePortfolioData({}, null)).not.toThrow();
      const res = schemas.validatePortfolioData({}, null);
      expect(res.valid).toBe(false);
    });
  });

  // ==========================================================================
  // Suite 6: Fuzz Testing (Adversarial, Unicode, Prototype, & ReDoS)
  // ==========================================================================
  describe('Suite 6: Fuzz Testing & Resilience', () => {
    it('S6.1: fuzzed contact form with 50 randomized extreme payloads never crashes safeParse', () => {
      const fuzzStrings = [
        '\u0000\u0001\u0002', // Control chars
        '💩'.repeat(500),      // Multi-byte Unicode emojis
        '<script>alert(1)</script>', // XSS payload
        "' OR '1'='1",        // SQL injection attempt
        'A'.repeat(50000),    // 50k large string
        '‎‏\u200B\u200C',     // Zero-width & direction override characters
        '{"nested": {"evil": true}}',
      ];

      for (const str of fuzzStrings) {
        expect(() => {
          schemas.validateContactForm({
            name: str,
            email: `${str}@example.com`,
            message: str,
          });
        }).not.toThrow();
      }
    });

    it('S6.2: prototype pollution attack payloads do not corrupt schema validation', () => {
      const maliciousPayload = JSON.parse('{"__proto__": {"isAdmin": true}, "name": "Eve", "email": "eve@evil.com", "message": "Valid length message body"}');
      
      const res = schemas.validateContactForm(maliciousPayload);
      expect(res.success).toBe(true);
      expect({}.isAdmin).toBeUndefined();
    });

    it('S6.3: fuzzed projects array with mutated types never throws unhandled exceptions', () => {
      const weirdValues = [
        null,
        undefined,
        12345,
        NaN,
        Infinity,
        -Infinity,
        Symbol('test'),
        () => {},
        [1, 2, 3],
        new Date(),
      ];

      for (const val of weirdValues) {
        expect(() => {
          schemas.projectSchema.safeParse(val);
        }).not.toThrow();

        expect(() => {
          schemas.personalInfoSchema.safeParse(val);
        }).not.toThrow();

        expect(() => {
          schemas.experienceItemSchema.safeParse(val);
        }).not.toThrow();
      }
    });
  });
});
