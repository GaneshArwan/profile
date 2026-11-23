import React, { useState, useEffect, useRef, useId } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Copy, Check, Maximize2, X, Code2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useI18n } from '../../lib/i18n';

export const MermaidViewer = ({ chart, id, title = 'Architecture Workflow', className = '' }) => {
  const { isIndonesian } = useI18n();
  const rawId = useId().replace(/:/g, '');
  const containerRef = useRef(null);
  const [svgHtml, setSvgHtml] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, startPanX: 0, startPanY: 0 });
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => 
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true
  );

  // Real-time theme sync via MutationObserver
  useEffect(() => {
    if (typeof MutationObserver === 'undefined') return;
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Keyboard navigation for full-screen modal
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Mermaid SVG rendering lifecycle
  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      if (!chart) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setHasError(false);

      // Test environment safety guard (Happy-DOM lacks getBBox on SVGGraphicsElement/SVGSVGElement/SVGElement)
      const hasGetBBox =
        typeof window !== 'undefined' &&
        Boolean(
          window.SVGGraphicsElement?.prototype?.getBBox ||
          window.SVGSVGElement?.prototype?.getBBox ||
          window.SVGElement?.prototype?.getBBox
        );
      const isTest = 
        !hasGetBBox ||
        import.meta.env?.MODE === 'test' ||
        (typeof globalThis !== 'undefined' && globalThis.process?.env?.NODE_ENV === 'test');

      if (isTest) {
        setSvgHtml(`
          <svg class="mermaid-mock-svg w-full h-auto text-emerald-700 dark:text-emerald-400" viewBox="0 0 600 160" aria-label="${title} Workflow Diagram">
            <rect width="600" height="160" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4" rx="8" />
            <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="currentColor" font-family="ui-monospace, monospace" font-size="13" font-weight="600">${title}</text>
            <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="currentColor" opacity="0.8" font-family="ui-monospace, monospace" font-size="11">[Mermaid Architecture Flowchart]</text>
          </svg>
        `);
        setIsLoading(false);
        return;
      }

      const sanitizedId = String(id || rawId).replace(/[^a-zA-Z0-9_-]/g, '');
      const uniqueRenderId = `mermaid-${sanitizedId}-${Math.random().toString(36).slice(2, 9)}`;

      try {
        const { default: mermaid } = await import('mermaid');
        mermaid.initialize({
          startOnLoad: false,
          suppressErrorRendering: true,
          securityLevel: 'strict',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          theme: 'base',
          themeVariables: isDark ? {
            darkMode: true,
            background: 'transparent',
            primaryColor: '#0b1a11',
            primaryTextColor: '#ecfdf5',
            primaryBorderColor: '#059669',
            lineColor: '#34d399',
            arrowheadColor: '#34d399',
            secondaryColor: '#050e09',
            tertiaryColor: '#13241b',
            edgeLabelBackground: '#0b1a11',
            nodeTextColor: '#ecfdf5',
          } : {
            darkMode: false,
            background: 'transparent',
            primaryColor: '#f4f6f4',
            primaryTextColor: '#064e3b',
            primaryBorderColor: '#047857',
            lineColor: '#047857',
            arrowheadColor: '#047857',
            secondaryColor: '#ffffff',
            tertiaryColor: '#ebf1ed',
            edgeLabelBackground: '#ffffff',
            nodeTextColor: '#064e3b',
          }
        });

        const { svg } = await mermaid.render(uniqueRenderId, chart);
        
        if (isMounted) {
          // Responsive viewBox containment scoped strictly to the root <svg> opening tag
          const responsiveSvg = svg.replace(/<svg\b([^>]*)>/i, (_, attrs) => {
            const cleanedAttrs = attrs.replace(/\s+(?:width|height|preserveAspectRatio|style)="[^"]*"/gi, '');
            return `<svg${cleanedAttrs} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="max-width: 100%; max-height: 100%; width: 100%; height: 100%;">`;
          });
          setSvgHtml(responsiveSvg);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      } finally {
        try {
          const rogueError = typeof document !== 'undefined' && typeof CSS !== 'undefined' && CSS.escape
            ? document.querySelector(`[id^="d${CSS.escape(uniqueRenderId)}"]`)
            : document.querySelector(`[id^="d${uniqueRenderId}"]`);
          if (rogueError) rogueError.remove();
        } catch {
          // Silently handle DOM query exceptions
        }
      }
    };

    renderChart();
    return () => { isMounted = false; };
  }, [chart, id, isDark, rawId, title]);

  const handlePointerDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      // Graceful fallback for environments lacking setPointerCapture
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    setPan({
      x: Math.round(dragStartRef.current.startPanX + dx),
      y: Math.round(dragStartRef.current.startPanY + dy),
    });
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture?.(e.pointerId);
      } catch {
        // Silently handle
      }
    }
  };

  const handleWheelZoom = (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoom((z) => Math.min(2.0, Math.max(0.6, Number((z + delta).toFixed(2)))));
  };

  const handleCopy = () => {
    if (!navigator.clipboard || !chart) return;
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!chart) return null;

  return (
    <div className={`relative rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950/60 overflow-hidden ${className}`}>
      {/* Top Action Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-900/60">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400">
          <Code2 size={13} className="text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
          <span>{isIndonesian ? 'Diagram Alur Mermaid' : 'Mermaid Flowchart'}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(Number((z + 0.15).toFixed(2)), 2.0))}
            aria-label={isIndonesian ? 'Perbesar diagram' : 'Zoom in diagram'}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <ZoomIn size={13} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(Number((z - 0.15).toFixed(2)), 0.6))}
            aria-label={isIndonesian ? 'Perkecil diagram' : 'Zoom out diagram'}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <ZoomOut size={13} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            aria-label={isIndonesian ? 'Atur ulang pembesaran' : 'Reset diagram zoom'}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={isIndonesian ? 'Salin definisi diagram Mermaid' : 'Copy Mermaid diagram definition'}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check size={13} className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            ) : (
              <Copy size={13} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
              setIsModalOpen(true);
            }}
            aria-label={isIndonesian ? 'Buka diagram layar penuh' : 'Expand diagram fullscreen'}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Maximize2 size={13} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div 
        ref={containerRef}
        className={`relative w-full h-[320px] sm:h-[360px] overflow-hidden select-none touch-none flex items-center justify-center p-4 bg-slate-50/50 dark:bg-slate-950/40 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ touchAction: 'none' }}
        tabIndex={0}
        role="region"
        aria-label={`${title} ${isIndonesian ? 'diagram alur interaktif' : 'interactive workflow diagram'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheelZoom}
      >
        {isLoading ? (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono py-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            <span>{isIndonesian ? 'Memuat diagram...' : 'Rendering diagram...'}</span>
          </div>
        ) : hasError ? (
          <div className="text-center py-6 px-4">
            <p className="text-xs text-rose-500 font-mono mb-2">
              {isIndonesian ? 'Gagal memuat visualisasi diagram' : 'Unable to render diagram visualization'}
            </p>
            <pre className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 p-2.5 rounded-lg text-left overflow-x-auto max-w-md mx-auto">
              {chart}
            </pre>
          </div>
        ) : (
          <div 
            style={{ 
              transform: (pan.x !== 0 || pan.y !== 0) 
                ? `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` 
                : `scale(${zoom})`, 
              transformOrigin: 'center center', 
              transition: isDragging ? 'none' : 'transform 150ms ease-out' 
            }}
            className="w-full h-full flex items-center justify-center pointer-events-none [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-full [&_svg]:h-full [&_svg]:overflow-visible"
            dangerouslySetInnerHTML={{ __html: svgHtml }}
          />
        )}
      </div>

      {/* Full-Screen Modal Dialog */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} ${isIndonesian ? 'Detail Diagram Arsitektur' : 'Architecture Diagram Detail'}`}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 shrink-0">
              <div className="flex items-center gap-2">
                <Code2 size={16} className="text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {title} // {isIndonesian ? 'Alur Arsitektur' : 'Architecture Flow'}
                </h4>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(Number((z + 0.15).toFixed(2)), 2.0))}
                  aria-label={isIndonesian ? 'Perbesar diagram layar penuh' : 'Zoom in fullscreen diagram'}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  <ZoomIn size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(Number((z - 0.15).toFixed(2)), 0.6))}
                  aria-label={isIndonesian ? 'Perkecil diagram layar penuh' : 'Zoom out fullscreen diagram'}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  <ZoomOut size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  }}
                  aria-label={isIndonesian ? 'Atur ulang pembesaran layar penuh' : 'Reset fullscreen diagram zoom'}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  <RotateCcw size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  aria-label={isIndonesian ? 'Tutup dialog diagram' : 'Close diagram modal'}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer ml-1"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div
              className={`relative w-full h-[65vh] min-h-[320px] max-h-[72vh] shrink-0 p-6 overflow-hidden select-none touch-none flex items-center justify-center bg-slate-100/50 dark:bg-slate-950/50 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{ touchAction: 'none' }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onWheel={handleWheelZoom}
            >
              <div 
                style={{
                  transform: (pan.x !== 0 || pan.y !== 0)
                    ? `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
                    : `scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 150ms ease-out'
                }}
                className="w-full h-full flex items-center justify-center pointer-events-none [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-full [&_svg]:h-full [&_svg]:overflow-visible"
                dangerouslySetInnerHTML={{ __html: svgHtml }}
              />
            </div>
            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
              <span>{isIndonesian ? 'Tekan Escape untuk keluar' : 'Press Escape to dismiss'}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"
              >
                {copied ? <Check size={12} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? (isIndonesian ? 'Tersalin!' : 'Copied!') : (isIndonesian ? 'Salin Mermaid' : 'Copy Mermaid')}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
