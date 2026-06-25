import React, { useState } from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { GlossyText } from '../ui/GlossyText';
import { BackgroundOverlay } from '../ui/BackgroundOverlay';
import { CertificateModal } from '../ui/CertificateModal';
import { Award } from 'lucide-react';
import { useBackgroundImage } from '../../hooks/useBackgroundImage';
import { EXPERIENCE, LOCAL_BACKGROUNDS, REMOTE_BACKGROUNDS } from '../../data/constants';

export const Experience = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage] = useState('');
  const [selectedTitle] = useState('');

  const bgImage = useBackgroundImage(LOCAL_BACKGROUNDS.experience, REMOTE_BACKGROUNDS.experience);

  return (
    <section id="experience" className="py-20 relative transition-colors duration-300 scroll-mt-20 bg-slate-50 dark:bg-slate-900">
      <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/90" />
          <BackgroundOverlay />
        </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader title={<GlossyText>Experience</GlossyText>} />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
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
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-white/80 dark:bg-slate-900/80 p-6 rounded-xl border border-white/50 dark:border-slate-700/50 shadow-lg backdrop-blur-md">
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
