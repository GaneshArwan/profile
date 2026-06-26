import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { GlossyText } from '../ui/GlossyText';
import { BackgroundOverlay } from '../ui/BackgroundOverlay';
import { useBackgroundImage } from '../../hooks/useBackgroundImage';
import { PROJECTS, LOCAL_BACKGROUNDS, REMOTE_BACKGROUNDS } from '../../data/constants';

export const Projects = () => {
  const bgImage = useBackgroundImage(LOCAL_BACKGROUNDS.projects, REMOTE_BACKGROUNDS.projects);

  return (
    <section id="projects" className="py-20 pt-32 relative transition-colors duration-300 scroll-mt-32 bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/90" />
          <BackgroundOverlay />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader title={<GlossyText>Projects</GlossyText>} subtitle="A selection of my work in Data Analysis and Automation." />
        
        <div className="space-y-32 mb-12 mt-16">
          {PROJECTS.map((project, index) => (
            <div 
              key={project.id} 
              id={`project-container-${project.id}`} 
              className="relative flex flex-col lg:flex-row items-start min-h-[120vh] gap-12 lg:gap-16"
            >
              
              {/* STICKY LEFT SIDE: The Image */}
              <div 
                className="w-full lg:w-1/2 h-[400px] lg:h-screen flex flex-col justify-center lg:sticky top-0"
                data-scroll 
                data-scroll-sticky 
                data-scroll-target={`#project-container-${project.id}`}
              >
                <div className="w-full h-full lg:h-[75vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative">
                  <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                  {/* Gradient overlay for aesthetics */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* SCROLLABLE RIGHT SIDE: The Story */}
              <div className="w-full lg:w-1/2 lg:py-[15vh]">
                
                {/* Block 1: Overview */}
                <div className="min-h-[70vh] flex flex-col justify-center">
                  <div data-scroll className="opacity-0 translate-y-8 transition-all duration-1000 [&.is-inview]:opacity-100 [&.is-inview]:translate-y-0 flex items-center gap-4 mb-6">
                    <span className="text-emerald-500 font-mono font-bold text-xl">
                      0{index + 1}
                    </span>
                    <div className="h-px bg-slate-300 dark:bg-slate-700 flex-1"></div>
                  </div>

                  <h3 data-scroll className="opacity-0 translate-y-8 transition-all duration-1000 delay-100 [&.is-inview]:opacity-100 [&.is-inview]:translate-y-0 text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-emerald-400 mb-8 leading-tight">
                    {project.title}
                  </h3>
                  
                  <p data-scroll className="opacity-0 translate-y-8 transition-all duration-1000 delay-200 [&.is-inview]:opacity-100 [&.is-inview]:translate-y-0 text-slate-600 dark:text-slate-300 text-xl md:text-2xl leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Block 2: Technologies */}
                <div className="min-h-[70vh] flex flex-col justify-center">
                  <h4 data-scroll className="opacity-0 translate-y-12 transition-all duration-1000 [&.is-inview]:opacity-100 [&.is-inview]:translate-y-0 text-2xl font-bold text-slate-800 dark:text-slate-200 mb-8">
                    Core Technologies
                  </h4>
                  <div data-scroll className="opacity-0 translate-y-12 transition-all duration-1000 delay-100 [&.is-inview]:opacity-100 [&.is-inview]:translate-y-0 flex flex-wrap gap-4">
                    {project.tech.map((t, i) => (
                      <span key={i} className="text-lg font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-6 py-3 rounded-full border border-emerald-500/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Block 3: Action */}
                <div className="min-h-[40vh] flex flex-col justify-center">
                  <div data-scroll className="opacity-0 translate-y-12 transition-all duration-1000 [&.is-inview]:opacity-100 [&.is-inview]:translate-y-0 flex flex-wrap gap-4">
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-3 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-500/20 transition-all shadow-lg hover:-translate-y-1"
                    >
                      View Repo
                    </a>
                    <a 
                      href={project.liveLink || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-3 text-white bg-emerald-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1"
                    >
                      View Live <ArrowRight size={22} />
                    </a>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

