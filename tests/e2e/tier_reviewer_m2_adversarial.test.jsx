import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../../src/App';
import { Navbar } from '../../src/components/layout/Navbar';
import { I18nProvider } from '../../src/lib/i18n';

describe('Reviewer 1 Adversarial Suite: Milestone M2 Verification', () => {
  let originalInnerWidth;
  let originalInnerHeight;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
    localStorage.clear();
    document.documentElement.className = '';
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    window.innerHeight = originalInnerHeight;
    vi.restoreAllMocks();
  });

  const setViewport = (width, height) => {
    window.innerWidth = width;
    window.innerHeight = height;
    window.dispatchEvent(new Event('resize'));
  };

  // =========================================================================
  // Challenge 1: The <830px Laptop Height Defect
  // =========================================================================
  describe('Challenge 1: Desktop Navigation on Short Laptops (<830px)', () => {
    it('R1.1: renders full desktop navigation links at 1280x600 (sub-830px laptop height)', () => {
      setViewport(1280, 600);
      render(<App />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();

      // Find all desktop navigation links
      const buttons = screen.getAllByRole('button');
      const navLinkLabels = ['About', 'Experience', 'Projects', 'Skills', 'Contact'];
      
      navLinkLabels.forEach(label => {
        const matches = buttons.filter(btn => new RegExp(`^${label}$`, 'i').test(btn.textContent.trim()));
        expect(matches.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('R1.2: renders full desktop navigation links at 1024x500 (extreme low-height desktop/netbook)', () => {
      setViewport(1024, 500);
      render(<App />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();

      const projectsLinks = screen.getAllByRole('button').filter(btn => /Projects/i.test(btn.textContent));
      expect(projectsLinks.length).toBeGreaterThanOrEqual(1);
    });
  });

  // =========================================================================
  // Challenge 2: Mobile Drawer Escape Key & Interaction Resilience
  // =========================================================================
  describe('Challenge 2: Mobile Drawer Escape Key & Interaction State Machine', () => {
    it('R2.1: pressing Escape key closes open mobile navigation drawer', () => {
      setViewport(375, 667);
      render(<App />);

      const toggleMenuBtn = screen.getByLabelText(/Toggle navigation menu/i);
      expect(toggleMenuBtn).toHaveAttribute('aria-expanded', 'false');

      // Open drawer
      act(() => {
        fireEvent.click(toggleMenuBtn);
      });
      expect(toggleMenuBtn).toHaveAttribute('aria-expanded', 'true');

      const drawer = document.getElementById('mobile-navigation-drawer');
      expect(drawer).toHaveClass(/opacity-100|visible/);

      // Press Escape
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      });

      expect(toggleMenuBtn).toHaveAttribute('aria-expanded', 'false');
      expect(drawer).toHaveClass(/opacity-0|invisible/);
    });

    it('R2.2: pressing Escape key when drawer is already closed is a harmless no-op', () => {
      setViewport(375, 667);
      render(<App />);

      const toggleMenuBtn = screen.getByLabelText(/Toggle navigation menu/i);
      expect(toggleMenuBtn).toHaveAttribute('aria-expanded', 'false');

      // Press Escape while closed
      expect(() => {
        act(() => {
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        });
      }).not.toThrow();

      expect(toggleMenuBtn).toHaveAttribute('aria-expanded', 'false');
    });

    it('R2.3: clicking any navigation link inside drawer invokes scrollTo and closes drawer', () => {
      setViewport(375, 667);
      const mockScrollTo = vi.fn();

      render(
        <I18nProvider>
          <Navbar 
            isDarkMode={false}
            toggleTheme={vi.fn()}
            activeSection="about"
            scrollTo={mockScrollTo}
            scrollDirection="up"
          />
        </I18nProvider>
      );

      const toggleMenuBtn = screen.getByLabelText(/Toggle navigation menu/i);
      act(() => {
        fireEvent.click(toggleMenuBtn);
      });

      const drawer = document.getElementById('mobile-navigation-drawer');
      const contactBtn = Array.from(drawer.querySelectorAll('button')).find(btn => /Contact/i.test(btn.textContent));
      expect(contactBtn).toBeDefined();

      act(() => {
        fireEvent.click(contactBtn);
      });

      expect(mockScrollTo).toHaveBeenCalledWith('contact');
      expect(drawer).toHaveClass(/opacity-0|invisible/);
    });
  });

  // =========================================================================
  // Challenge 3: Live Locale Switcher in Navbar
  // =========================================================================
  describe('Challenge 3: Live Locale Switcher & Nav Label Localization', () => {
    it('R3.1: clicking language toggle dynamically updates navigation labels between EN and ID', () => {
      render(<App />);

      // Find language toggle button
      const langBtns = screen.getAllByLabelText(/Toggle language/i);
      expect(langBtns.length).toBeGreaterThanOrEqual(1);

      // Initial state is English
      expect(langBtns[0].textContent.trim().toLowerCase()).toBe('en');
      expect(screen.getAllByText(/About/i).length).toBeGreaterThanOrEqual(1);

      // Switch to Indonesian (ID)
      act(() => {
        fireEvent.click(langBtns[0]);
      });

      expect(langBtns[0].textContent.trim().toLowerCase()).toBe('id');
      // Indonesian nav translation should be present
      expect(screen.getAllByText(/Tentang/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Proyek/i).length).toBeGreaterThanOrEqual(1);

      // Switch back to English (EN)
      act(() => {
        fireEvent.click(langBtns[0]);
      });

      expect(langBtns[0].textContent.trim().toLowerCase()).toBe('en');
      expect(screen.getAllByText(/About/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  // =========================================================================
  // Challenge 4: Zero Blocking Loaders & Custom Cursors
  // =========================================================================
  describe('Challenge 4: Antislop Scaffolding Invariants', () => {
    it('R4.1: App mounts instantly with zero loader delay (FuturisticLoader absent)', () => {
      const { container } = render(<App />);

      // FuturisticLoader elements must NOT be present
      expect(container.querySelector('[data-scroll-container]')).toBeNull();
      expect(screen.queryByText(/INITIALIZING/i)).toBeNull();
      expect(screen.queryByText(/DATA TELEMETRY/i)).toBeNull();
      
      // Main semantic landmarks must be immediately interactable
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('R4.2: CustomCursor DOM elements are completely absent', () => {
      const { container } = render(<App />);
      const cursorDoms = container.querySelectorAll('.mix-blend-difference');
      expect(cursorDoms.length).toBe(0);
    });

    it('R4.3: glossy-matcha gradient text clipping is completely eliminated', () => {
      const { container } = render(<App />);
      const glossyDoms = container.querySelectorAll('.glossy-matcha');
      expect(glossyDoms.length).toBe(0);
    });

    it('R4.4: glowing blur halos (blur-lg opacity-20) are completely eliminated', () => {
      const { container } = render(<App />);
      const blurHalos = container.querySelectorAll('.blur-lg.opacity-20, .blur.opacity-0');
      expect(blurHalos.length).toBe(0);
    });
  });
});
