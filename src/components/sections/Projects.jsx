import React from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { GlossyText } from '../ui/GlossyText';
import { BackgroundOverlay } from '../ui/BackgroundOverlay';
import { ProjectCard } from '../ui/ProjectCard';
import { useBackgroundImage } from '../../hooks/useBackgroundImage';
import { PROJECTS, LOCAL_BACKGROUNDS, REMOTE_BACKGROUNDS } from '../../data/constants';

export const Projects = ({ blurPx }) => {
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
