/**
/**
 * tests/e2e/tier_challenger_sec_m4.test.jsx
 * Empirical Challenger 1: Adversarial Security, Input Validation & ErrorBoundary Suite
 * 
 * Fused Specialist Personas & Methodologies:
 * - penetration-testing-with-strix (autonomous dynamic attack payloads & exploit validation)
 * - agency-application-security-engineer (threat modeling, URL scheme enforcement, XSS & prototype pollution defense)
 * - agency-autonomous-optimization-architect (guardrail evaluation, circuit-breaking, boundaries)
 * - investigate-first (empirical evidence gathering and verification)
 */
import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as schemas from '../../src/lib/schemas';
import ErrorBoundary from '../../src/components/common/ErrorBoundary';
import { renderPortfolio, resetTestEnvironment } from './harness';
import fs from 'fs';
import path from 'path';

describe('Empirical Challenger 1: Adversarial Security & Boundary Fuzzing Suite', () => {

  // ==========================================================================
  // Suite 1: Adversarial URL Scheme Injection & Protocol Smuggling Attacks
  // ==========================================================================
  describe('Suite 1: Adversarial URL Scheme Injection & Protocol Smuggling', () => {
    const maliciousProtocols = [
      { name: 'standard javascript:', url: 'javascript:alert(1)' },
      { name: 'javascript:void(0)', url: 'javascript:void(0)' },
      { name: 'uppercase JAVASCRIPT:', url: 'JAVASCRIPT:alert("xss")' },
      { name: 'mixed-case JaVaScRiPt:', url: 'JaVaScRiPt:alert(document.cookie)' },
      { name: 'vbscript: pseudo-protocol', url: 'vbscript:msgbox(1)' },
      { name: 'data: text/html payload', url: 'data:text/html,<script>alert(1)</script>' },
      { name: 'data: base64 payload', url: 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==' },
      { name: 'file: local file inclusion (unix)', url: 'file:///etc/passwd' },
      { name: 'file: local file inclusion (windows)', url: 'file:///C:/Windows/win.ini' },
      { name: 'protocol-relative URL', url: '//evil.com/payload.js' },
      { name: 'ftp: protocol', url: 'ftp://ftp.example.com/exploit' },
      { name: 'ws: websocket protocol', url: 'ws://evil-ws.com/listen' },
      { name: 'wss: secure websocket protocol', url: 'wss://evil-ws.com/listen' },
      { name: 'blob: object URI', url: 'blob:https://example.com/3f8211da-2b7e' },
      { name: 'malformed scheme http://', url: 'http://' },
      { name: 'malformed scheme https://', url: 'https://' },
      { name: 'spaces in scheme ht tp://example.com', url: 'ht tp://example.com' },
      { name: 'invalid characters in url', url: 'http://<script>alert(1)</script>.com' },
      { name: 'bare string without scheme', url: 'just-some-random-domain.com' },
    ];

    const validUrls = [
      'https://github.com/GaneshArwan',
      'http://github.com/GaneshArwan',
      'https://www.linkedin.com/in/william-oo00/',
      'https://example.com/path?query=1&var=value#hash',
      'http://localhost:3000',
      'http://127.0.0.1:8080',
    ];

    describe('1.1 PersonalInfoSchema URL attributes (github, linkedin)', () => {
      const basePersonalInfo = {
        name: 'William',
        title: 'Data Analyst & AI Engineer',
        email: 'wiliamzwili135@gmail.com',
        location: 'Jakarta, Indonesia',
        github: 'https://github.com/GaneshArwan',
        linkedin: 'https://www.linkedin.com/in/william-oo00/',
        bio: 'Data Analyst & AI Engineer with 2 years of experience in data management.',
      };

      it.each(maliciousProtocols)('rejects hostile github URL: $name ($url)', ({ url }) => {
        const result = schemas.personalInfoSchema.safeParse({ ...basePersonalInfo, github: url });
        expect(result.success).toBe(false);
      });

      it.each(maliciousProtocols)('rejects hostile linkedin URL: $name ($url)', ({ url }) => {
        const result = schemas.personalInfoSchema.safeParse({ ...basePersonalInfo, linkedin: url });
        expect(result.success).toBe(false);
      });

      it.each(validUrls)('accepts legitimate http/https URL: %s', (url) => {
        const result = schemas.personalInfoSchema.safeParse({
          ...basePersonalInfo,
          github: url,
          linkedin: url,
        });
        expect(result.success).toBe(true);
      });
    });

    describe('1.2 ProjectSchema URL attributes (repoUrl, liveUrl, link, liveLink)', () => {
      const baseProject = {
        id: 'rag-chat',
        title: 'RAG Document Chat',
        category: 'ai',
        description: 'Production-ready Retrieval-Augmented Generation system.',
        highlights: ['ChromaDB integration'],
        tech: ['Python', 'FastAPI', 'ChromaDB'],
        repoUrl: 'https://github.com/GaneshArwan/RAGChat',
        liveUrl: 'https://ragchat-demo.example.com',
        link: 'https://github.com/GaneshArwan/RAGChat',
        liveLink: 'https://ragchat-demo.example.com',
      };

      it.each(maliciousProtocols)('rejects hostile repoUrl: $name ($url)', ({ url }) => {
        const result = schemas.projectSchema.safeParse({ ...baseProject, repoUrl: url });
        expect(result.success).toBe(false);
      });

      it.each(maliciousProtocols)('rejects hostile liveUrl: $name ($url)', ({ url }) => {
        const result = schemas.projectSchema.safeParse({ ...baseProject, liveUrl: url });
        expect(result.success).toBe(false);
      });

      it.each(maliciousProtocols)('rejects hostile legacy link: $name ($url)', ({ url }) => {
        const result = schemas.projectSchema.safeParse({ ...baseProject, link: url });
        expect(result.success).toBe(false);
      });

      it.each(maliciousProtocols)('rejects hostile legacy liveLink: $name ($url)', ({ url }) => {
        const result = schemas.projectSchema.safeParse({ ...baseProject, liveLink: url });
        expect(result.success).toBe(false);
      });

      it('permits empty string or null for optional liveUrl and liveLink', () => {
        const nullRes = schemas.projectSchema.safeParse({ ...baseProject, liveUrl: null, liveLink: null });
        expect(nullRes.success).toBe(true);

        const emptyRes = schemas.projectSchema.safeParse({ ...baseProject, liveUrl: '', liveLink: '' });
        expect(emptyRes.success).toBe(true);
      });
    });

    describe('1.3 ExperienceAwardSchema & CertificationSchema URL attributes', () => {
      const baseAward = {
        title: 'Awarded Best Intern',
        issuer: 'Kawan Lama Group',
        credentialUrl: 'https://www.linkedin.com/in/william-oo00/overlay/1743496220514/',
      };

      it.each(maliciousProtocols)('rejects hostile credentialUrl in experienceAwardSchema: $name ($url)', ({ url }) => {
        const result = schemas.experienceAwardSchema.safeParse({ ...baseAward, credentialUrl: url });
        expect(result.success).toBe(false);
      });

      const baseCert = {
        title: 'TensorFlow Developer Certificate',
        issuer: 'Google',
        url: 'https://www.credential.net/example',
        link: 'https://www.credential.net/example',
      };

      it.each(maliciousProtocols)('rejects hostile url in certificationSchema: $name ($url)', ({ url }) => {
        const result = schemas.certificationSchema.safeParse({ ...baseCert, url });
        expect(result.success).toBe(false);
      });

      it.each(maliciousProtocols)('rejects hostile link in certificationSchema: $name ($url)', ({ url }) => {
        const result = schemas.certificationSchema.safeParse({ ...baseCert, link: url });
        expect(result.success).toBe(false);
      });
    });

    describe('1.4 ExperienceItemSchema Legacy Link Boundary Probe', () => {
      const baseExperience = {
        company: 'Kawan Lama Group',
        role: 'Master Data Management Data Analyst Officer',
        period: '2024 - 2026',
        type: 'Full-time',
        description: 'Engineered master data pipelines and automated ETL processes.',
        achievements: ['Optimized BigQuery ingestion'],
      };

      it('safely handles experience items with legitimate URLs in link and award', () => {
        const result = schemas.experienceItemSchema.safeParse({
          ...baseExperience,
          link: 'https://www.linkedin.com/in/william-oo00/',
          award: {
            title: 'Best Intern',
            issuer: 'Kawan Lama',
            credentialUrl: 'https://www.linkedin.com/in/william-oo00/',
          },
        });
        expect(result.success).toBe(true);
      });
    });
  });

  // ==========================================================================
  // Suite 2: Contact Form Adversarial Fuzzing, Injection & Overflow Suite
  // ==========================================================================
  describe('Suite 2: Contact Form Fuzzing, Injection & Overflow Suite', () => {
    const validContact = {
      name: 'Alexander Hamilton',
      email: 'alexander@treasury.gov',
      message: 'Discussing the analytical data pipelines and AI governance models.',
    };

    describe('2.1 Null-Byte Injection Attacks', () => {
      it('rejects null byte in name field', () => {
        const result = schemas.validateContactForm({ ...validContact, name: 'Alexander\0Hamilton' });
        expect(result.success).toBe(false);
        expect(result.errors.name).toMatch(/null byte/i);
      });

      it('rejects null byte in email field', () => {
        const result = schemas.validateContactForm({ ...validContact, email: 'alex\0@treasury.gov' });
        expect(result.success).toBe(false);
        expect(result.errors.email).toMatch(/(null byte|valid email)/i);
      });

      it('rejects null byte in message field', () => {
        const result = schemas.validateContactForm({ ...validContact, message: 'Legitimate header\0<script>evil()</script>' });
        expect(result.success).toBe(false);
        expect(result.errors.message).toMatch(/null byte/i);
      });
    });

    describe('2.2 String Overflow / Resource Exhaustion Fuzzing', () => {
      it('rejects name exceeding 100 characters', () => {
        const overflowName = 'A'.repeat(101);
        const result = schemas.validateContactForm({ ...validContact, name: overflowName });
        expect(result.success).toBe(false);
        expect(result.errors.name).toMatch(/at most 100 characters/i);
      });

      it('rejects massive 10,000-character name overflow', () => {
        const massiveName = 'B'.repeat(10000);
        const result = schemas.validateContactForm({ ...validContact, name: massiveName });
        expect(result.success).toBe(false);
        expect(result.errors.name).toBeDefined();
      });

      it('accepts boundary-valid name of exactly 100 characters', () => {
        const boundaryName = 'A'.repeat(100);
        const result = schemas.validateContactForm({ ...validContact, name: boundaryName });
        expect(result.success).toBe(true);
      });

      it('rejects email exceeding 254 characters', () => {
        const localPart = 'a'.repeat(245);
        const overflowEmail = `${localPart}@domain.com`; // 245 + 11 = 256 chars (>254)
        const result = schemas.validateContactForm({ ...validContact, email: overflowEmail });
        expect(result.success).toBe(false);
        expect(result.errors.email).toBeDefined();
      });

      it('rejects massive 10,000-character email overflow', () => {
        const massiveEmail = 'c'.repeat(9990) + '@domain.com';
        const result = schemas.validateContactForm({ ...validContact, email: massiveEmail });
        expect(result.success).toBe(false);
        expect(result.errors.email).toBeDefined();
      });

      it('rejects message exceeding 5000 characters', () => {
        const overflowMessage = 'M'.repeat(5001);
        const result = schemas.validateContactForm({ ...validContact, message: overflowMessage });
        expect(result.success).toBe(false);
        expect(result.errors.message).toMatch(/at most 5000 characters/i);
      });

      it('rejects massive 10,000-character message overflow', () => {
        const massiveMessage = 'X'.repeat(10000);
        const result = schemas.validateContactForm({ ...validContact, message: massiveMessage });
        expect(result.success).toBe(false);
        expect(result.errors.message).toBeDefined();
      });

      it('accepts boundary-valid message of exactly 5000 characters', () => {
        const boundaryMessage = 'M'.repeat(5000);
        const result = schemas.validateContactForm({ ...validContact, message: boundaryMessage });
        expect(result.success).toBe(true);
      });
    });

    describe('2.3 SQL Injection & Script Injection Payloads', () => {
      const sqliPayloads = [
        "' OR '1'='1",
        "admin' --",
        "'; DROP TABLE users; --",
        "1; SELECT * FROM pg_catalog.pg_tables; --",
        "UNION ALL SELECT null, null, username, password FROM users --",
        "1' OR 1=1 #",
      ];

      it.each(sqliPayloads)('rejects SQL injection payloads when supplied as email: %s', (sqli) => {
        const result = schemas.validateContactForm({ ...validContact, email: sqli });
        expect(result.success).toBe(false);
        expect(result.errors.email).toBeDefined();
      });

      it.each(sqliPayloads)('safely accepts SQL injection strings as literal text in message without throwing', (sqli) => {
        const result = schemas.validateContactForm({
          ...validContact,
          message: `Inquiring about this SQL query: ${sqli} for our security scanner`,
        });
        expect(result.success).toBe(true);
        expect(result.data.message).toContain(sqli);
      });

      const xssPayloads = [
        '<script>alert(1)</script>',
        '<img src=x onerror=alert(1)>',
        '<svg onload=alert(1)>',
        '"><script>alert("xss")</script>',
        '<iframe src="javascript:alert(1)"></iframe>',
      ];

      it.each(xssPayloads)('rejects XSS payloads in email field: %s', (xss) => {
        const result = schemas.validateContactForm({ ...validContact, email: xss });
        expect(result.success).toBe(false);
        expect(result.errors.email).toBeDefined();
      });

      it.each(xssPayloads)('safely preserves XSS payloads as raw string data in message without crashing', (xss) => {
        const result = schemas.validateContactForm({
          ...validContact,
          message: `Testing XSS mitigation for: ${xss}`,
        });
        expect(result.success).toBe(true);
        expect(result.data.message).toContain(xss);
      });
    });

    describe('2.4 Empty, Whitespace & Minimum Length Boundaries', () => {
      it('rejects empty strings across all fields', () => {
        const result = schemas.validateContactForm({ name: '', email: '', message: '' });
        expect(result.success).toBe(false);
        expect(result.errors.name).toBeDefined();
        expect(result.errors.email).toBeDefined();
        expect(result.errors.message).toBeDefined();
      });

      it('rejects whitespace-only strings across all fields', () => {
        const result = schemas.validateContactForm({
          name: '     ',
          email: '   \t  ',
          message: '   \n\r\t     ',
        });
        expect(result.success).toBe(false);
        expect(result.errors.name).toMatch(/at least 2 characters/i);
        expect(result.errors.email).toMatch(/valid email/i);
        expect(result.errors.message).toMatch(/at least 10 characters/i);
      });

      it('rejects name with only 1 non-whitespace character', () => {
        const result = schemas.validateContactForm({ ...validContact, name: ' W ' });
        expect(result.success).toBe(false);
        expect(result.errors.name).toMatch(/at least 2 characters/i);
      });

      it('accepts name with exactly 2 characters', () => {
        const result = schemas.validateContactForm({ ...validContact, name: 'Li' });
        expect(result.success).toBe(true);
      });

      it('rejects message with only 9 non-whitespace characters', () => {
        const result = schemas.validateContactForm({ ...validContact, message: '123456789' });
        expect(result.success).toBe(false);
        expect(result.errors.message).toMatch(/at least 10 characters/i);
      });

      it('accepts message with exactly 10 non-whitespace characters', () => {
        const result = schemas.validateContactForm({ ...validContact, message: '1234567890' });
        expect(result.success).toBe(true);
      });
    });

    describe('2.5 Prototype Pollution & Object Tampering Defense', () => {
      it('does not poison Object prototype via formatZodIssues', () => {
        const hostileIssues = [
          { path: ['__proto__'], message: 'polluted' },
          { path: ['constructor'], message: 'polluted' },
          { path: ['prototype'], message: 'polluted' },
        ];
        const formatted = schemas.formatZodIssues(hostileIssues);
        expect(formatted.__proto__).toBe(Object.prototype); // Unpolluted
        expect(Object.prototype.polluted).toBeUndefined();
      });

      it('handles non-array or malformed issues safely', () => {
        expect(schemas.formatZodIssues(null)).toEqual({});
        expect(schemas.formatZodIssues(undefined)).toEqual({});
        expect(schemas.formatZodIssues('not-an-array')).toEqual({});
        expect(schemas.formatZodIssues([null, undefined, 42, 'string'])).toEqual({});
      });
    });
  });

  // ==========================================================================
  // Suite 3: ErrorBoundary Component Resilience & Recovery
  // ==========================================================================
  describe('Suite 3: ErrorBoundary Resilience & Recovery', () => {
    let originalConsoleError;

    beforeEach(() => {
      originalConsoleError = console.error;
      console.error = vi.fn(); // Suppress expected React error boundary logs
    });

    afterEach(() => {
      console.error = originalConsoleError;
    });

    const BombComponent = ({ shouldThrow, message = 'Explosive runtime explosion' }) => {
      if (shouldThrow) {
        throw new Error(message);
      }
      return <div data-testid="bomb-content">Normal Healthy Component</div>;
    };

    it('renders children cleanly when no error is thrown', () => {
      render(
        <ErrorBoundary>
          <BombComponent shouldThrow={false} />
        </ErrorBoundary>
      );
      expect(screen.getByTestId('bomb-content')).toBeInTheDocument();
      expect(screen.getByText('Normal Healthy Component')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('catches uncaught child exception, prevents crash, and renders accessible fallback UI', () => {
      render(
        <ErrorBoundary>
          <BombComponent shouldThrow={true} message="Critical rendering crash" />
        </ErrorBoundary>
      );

      const alertBanner = screen.getByRole('alert');
      expect(alertBanner).toBeInTheDocument();
      expect(alertBanner).toHaveAttribute('aria-live', 'assertive');
      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
      expect(screen.getByText(/The application encountered an unexpected runtime state/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reload Page/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('[ErrorBoundary caught error]'),
        expect.any(Error),
        expect.anything()
      );
    });

    it('recovers component state when "Try Again" is clicked and error condition is cleared', () => {
      const StateControlledHost = () => {
        const [hasError, setHasError] = useState(true);
        return (
          <div>
            <button onClick={() => setHasError(false)}>Fix Child State</button>
            <ErrorBoundary>
              <BombComponent shouldThrow={hasError} />
            </ErrorBoundary>
          </div>
        );
      };

      render(<StateControlledHost />);

      // Initially crashed
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.queryByTestId('bomb-content')).not.toBeInTheDocument();

      // Fix the condition in state
      fireEvent.click(screen.getByText('Fix Child State'));

      // Click "Try Again"
      fireEvent.click(screen.getByRole('button', { name: /Try Again/i }));

      // Now recovered
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByTestId('bomb-content')).toBeInTheDocument();
    });

    it('supports custom React element fallback', () => {
      const customFallback = <div role="alert" data-testid="custom-fallback">Custom Safe Fallback</div>;
      render(
        <ErrorBoundary fallback={customFallback}>
          <BombComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom Safe Fallback')).toBeInTheDocument();
    });

    it('supports custom function fallback receiving error and reset handler', () => {
      const functionFallback = ({ error, reset }) => (
        <div role="alert" data-testid="function-fallback">
          <span>Caught: {error.message}</span>
          <button onClick={reset}>Custom Reset</button>
        </div>
      );

      render(
        <ErrorBoundary fallback={functionFallback}>
          <BombComponent shouldThrow={true} message="Specific custom error text" />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('function-fallback')).toBeInTheDocument();
      expect(screen.getByText('Caught: Specific custom error text')).toBeInTheDocument();
    });

    it('triggers window.location.reload when "Reload Page" is clicked', () => {
      const originalLocation = window.location;
      delete window.location;
      window.location = { reload: vi.fn() };

      render(
        <ErrorBoundary>
          <BombComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByRole('button', { name: /Reload Page/i }));
      expect(window.location.reload).toHaveBeenCalledTimes(1);

      window.location = originalLocation;
    });
  });

  // ==========================================================================
  // Suite 4: Security Headers & CSP Configuration Audit (vercel.json)
  // ==========================================================================
  describe('Suite 4: Security Headers & CSP Configuration Audit (vercel.json)', () => {
    let vercelConfig;

    beforeEach(() => {
      const vercelPath = path.resolve(process.cwd(), 'vercel.json');
      const rawContent = fs.readFileSync(vercelPath, 'utf8');
      vercelConfig = JSON.parse(rawContent);
    });

    it('defines global headers route matching "/(.*)"', () => {
      expect(vercelConfig.headers).toBeDefined();
      expect(Array.isArray(vercelConfig.headers)).toBe(true);
      const rootHeaderRule = vercelConfig.headers.find(h => h.source === '/(.*)');
      expect(rootHeaderRule).toBeDefined();
    });

    it('enforces all foundational OWASP secure HTTP headers', () => {
      const headerRule = vercelConfig.headers.find(h => h.source === '/(.*)');
      const headerMap = {};
      headerRule.headers.forEach(h => {
        headerMap[h.key] = h.value;
      });

      expect(headerMap['X-Content-Type-Options']).toBe('nosniff');
      expect(headerMap['X-Frame-Options']).toBe('DENY');
      expect(headerMap['X-XSS-Protection']).toBe('1; mode=block');
      expect(headerMap['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
      expect(headerMap['Strict-Transport-Security']).toMatch(/max-age=31536000/);
      expect(headerMap['Strict-Transport-Security']).toMatch(/includeSubDomains/);
      expect(headerMap['Permissions-Policy']).toMatch(/camera=\(\)/);
      expect(headerMap['Permissions-Policy']).toMatch(/microphone=\(\)/);
      expect(headerMap['Permissions-Policy']).toMatch(/geolocation=\(\)/);
    });

    it('enforces strict Content-Security-Policy with zero wildcard scripts', () => {
      const headerRule = vercelConfig.headers.find(h => h.source === '/(.*)');
      const cspHeader = headerRule.headers.find(h => h.key === 'Content-Security-Policy');
      expect(cspHeader).toBeDefined();
      const csp = cspHeader.value;

      expect(csp).toMatch(/default-src 'self'/);
      expect(csp).toMatch(/frame-ancestors 'none'/);
      expect(csp).toMatch(/object-src 'none'/);
      expect(csp).toMatch(/base-uri 'self'/);
      expect(csp).toMatch(/https:\/\/formspree\.io/);
      expect(csp).toMatch(/https:\/\/www\.google\.com\/recaptcha\//);
      expect(csp).not.toMatch(/script-src [^;]*\*/); // No wildcards in script-src
    });
  });

  // ==========================================================================
  // Suite 5: External Link Safety & Reverse Tabnabbing Protection Audit
  // ==========================================================================
  describe('Suite 5: External Link Safety & Reverse Tabnabbing Protection Audit', () => {
    beforeEach(() => {
      resetTestEnvironment();
    });

    it('5.1 verifies all rendered external anchor links have target="_blank" and rel="noopener noreferrer"', () => {
      renderPortfolio({ advanceLoader: false });
      const allAnchors = Array.from(document.querySelectorAll('a'));
      expect(allAnchors.length).toBeGreaterThan(0);

      const externalAnchors = allAnchors.filter(a => {
        const href = a.getAttribute('href') || '';
        return /^https?:\/\//i.test(href);
      });

      expect(externalAnchors.length).toBeGreaterThan(0);

      externalAnchors.forEach(anchor => {
        const href = anchor.getAttribute('href');
        const target = anchor.getAttribute('target');
        const rel = anchor.getAttribute('rel') || '';

        expect(target, `External link ${href} must have target="_blank"`).toBe('_blank');
        expect(rel, `External link ${href} must include noopener`).toMatch(/noopener/);
        expect(rel, `External link ${href} must include noreferrer`).toMatch(/noreferrer/);
      });
    });

    it('5.2 scans all source JSX components to verify zero unhardened external anchor tags', () => {
      const srcDir = path.resolve(process.cwd(), 'src');
      
      function getJsxFiles(dir) {
        let results = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            results = results.concat(getJsxFiles(fullPath));
          } else if (/\.jsx$/.test(entry.name)) {
            results.push(fullPath);
          }
        }
        return results;
      }

      const files = getJsxFiles(srcDir);
      expect(files.length).toBeGreaterThan(0);

      // Match strictly HTML <a> tags with whitespace, not React components like <App or <Award
      const anchorTagRegex = /<a\s+[\s\S]*?>/gi;
      const externalViolations = [];

      files.forEach(filePath => {
        const content = fs.readFileSync(filePath, 'utf8');
        let match;
        while ((match = anchorTagRegex.exec(content)) !== null) {
          const tag = match[0].replace(/\s+/g, ' ');
          
          // Skip internal hash navigation links and mailto/tel links
          const isInternal = /href=\{?`?["']?(#|mailto:|tel:)/i.test(tag);
          if (isInternal) continue;

          // Check for external attributes
          const hasTargetBlank = /target=["'{]_blank["'}]/.test(tag);
          const hasNoopener = /rel=["'{][^"'}]*noopener/i.test(tag);
          const hasNoreferrer = /rel=["'{][^"'}]*noreferrer/i.test(tag);

          if (!hasTargetBlank || !hasNoopener || !hasNoreferrer) {
            externalViolations.push({
              file: path.relative(process.cwd(), filePath),
              tag: tag.substring(0, 100),
              hasTargetBlank,
              hasNoopener,
              hasNoreferrer,
            });
          }
        }
      });

      expect(externalViolations, `Found unhardened external links: ${JSON.stringify(externalViolations)}`).toHaveLength(0);
    });
  });
});
