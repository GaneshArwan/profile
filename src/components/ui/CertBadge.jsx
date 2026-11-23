import React, { useState } from 'react';
import { Award } from 'lucide-react';

const ISSUER_LOGOS = {
  'IBM': '/logos/ibm.svg',
  'DeepLearning.AI': '/logos/deeplearning-ai.svg',
  'Anthropic': '/logos/anthropic.svg',
  'Google': '/logos/google.svg',
  'Google Digital Academy (Skillshop)': '/logos/google.svg',
  'Dicoding Indonesia': '/logos/dicoding.svg',
  'Kawan Lama Group': '/logos/kawan-lama.svg',
  'Securiti AI': '/logos/securiti-ai.svg',
  'MySkill': '/logos/myskill.svg',
  'Pijak in collab with IBM SkillsBuild': '/logos/ibm.svg',
  'Pijak in collaboration with IBM SkillsBuild': '/logos/ibm.svg',
  'Microsoft': '/logos/microsoft.svg',
  'AWS': '/logos/aws.svg',
};

/**
 * Accessible, resilient certification badge with 2-tier graceful fallback:
 * 1. Explicit image or mapped local SVG logo
 * 2. On load failure or missing source: renders Lucide Award icon
 */
export function CertBadge({ src, alt = '', issuer, size = 'sm', className = '' }) {
  const [hasError, setHasError] = useState(false);

  const resolvedSrc = !hasError ? (src || (issuer ? ISSUER_LOGOS[issuer] : null)) : null;

  if (hasError || !resolvedSrc) {
    if (size === 'md') {
      return (
        <div 
          className={`h-14 w-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center shrink-0 ${className}`}
          aria-hidden="true"
        >
          <Award 
            size={24} 
            className="text-emerald-700 dark:text-emerald-400" 
          />
        </div>
      );
    }

    return (
      <Award 
        size={20} 
        aria-hidden="true" 
        className={`w-10 h-10 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400 shrink-0 ${className}`} 
      />
    );
  }

  if (size === 'md') {
    return (
      <div className={`h-14 w-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700 shrink-0 ${className}`}>
        <img 
          src={resolvedSrc} 
          alt={alt} 
          aria-hidden={!alt ? "true" : undefined}
          loading="lazy" 
          decoding="async" 
          width="56" 
          height="56" 
          onError={() => setHasError(true)}
          className="w-full h-full object-cover" 
        />
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      aria-hidden={!alt ? "true" : undefined}
      loading="lazy"
      decoding="async"
      width="48"
      height="48"
      className={`w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0 ${className}`}
      onError={() => setHasError(true)}
    />
  );
}
