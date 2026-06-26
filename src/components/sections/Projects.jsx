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
                className="w-full lg:w-1/2 lg:sticky lg:top-[12.5vh] h-[400px] lg:h-[75vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
                data-scroll 
                data-scroll-sticky 
                data-scroll-target={`#project-container-${project.id}`}
              >
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                  style={{ backgroundImage: `url(${project.image})` }}
                />
                {/* Gradient overlay for aesthetics */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* SCROLLABLE RIGHT SIDE: The Story */}
              <div className="w-full lg:w-1/2 lg:pt-16 pb-32">
                
                <div data-scroll className="opacity-0 translate-y-8 transition-all duration-1000 [&.is-inview]:opacity-100 [&.is-inview]:translate-y-0 flex items-center gap-4 mb-6">
                  <span className="text-emerald-500 font-mono font-bold text-xl">
                    0{index + 1}
                  </span>
                  <div className="h-px bg-slate-300 dark:bg-slate-700 flex-1"></div>
                </div>

                <h3 data-scroll className="opacity-0 translate-y-8 transition-all duration-1000 delay-100 [&.is-inview]:opacity-100 [&.is-inview]:translate-y-0 text-4xl md:text-5xl font-bold text-slate-900 dark:text-emerald-400 mb-8 leading-tight">
                  {project.title}
                </h3>
                
                <p data-scroll className="opacity-0 translate-y-8 transition-all duration-1000 delay-200 [&.is-inview]:opacity-100 [&.is-inview]:translate-y-0 text-slate-600 dark:text-slate-300 text-xl leading-relaxed mb-12">
                  {project.description}
                </p>

                {/* Simulated "Story" sections for the scroll effect */}
                <div className="space-y-16 text-lg text-slate-500 dark:text-slate-400 border-l-2 border-emerald-500/30 pl-6 mb-16">
                  <div data-scroll className="opacity-0 translate-y-12 transition-all duration-1000 [&.is-inview]:opacity-100 [&.is-inview]:translate-y-0">
                    <h4 className="text-slate-800 dark:text-slate-200 font-bold mb-2">The Challenge</h4>
                    <p>When starting this project, the main hurdle was handling complex data pipelines while ensuring maximum efficiency and minimal errors during transformation.</p>
                  </div>
                  <div data-scroll className="opacity-0 translate-y-12 transition-all duration-1000 [&.is-inview]:opacity-100 [&.is-inview]:translate-y-0">
                    <h4 className="text-slate-800 dark:text-slate-200 font-bold mb-2">The Approach</h4>
                    <p>I utilized a combination of modern scripting and automation techniques to systematically break down the data silos and integrate them into a unified dashboard.</p>
                  </div>
                  <div data-scroll className="opacity-0 translate-y-12 transition-all duration-1000 [&.is-inview]:opacity-100 [&.is-inview]:translate-y-0">
                    <h4 className="text-slate-800 dark:text-slate-200 font-bold mb-2">The Impact</h4>
                    <p>The final implementation reduced reporting time by over 70%, giving the team real-time insights that were previously impossible to achieve manually.</p>
                  </div>
                </div>

                <div data-scroll className="opacity-0 translate-y-12 transition-all duration-1000 delay-300 [&.is-inview]:opacity-100 [&.is-inview]:translate-y-0 flex flex-wrap gap-4">
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
          ))}
        </div>
      </div>
    </section>
  );
};

