import React from 'react';
import { ArrowRight } from 'lucide-react';

export const ProjectCard = ({ project }) => {
  const bgImage = project.image;

  return (
    <a 
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-2xl h-[500px] md:h-[600px]"
    >
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex flex-col justify-end p-8 transition-opacity duration-300 group-hover:opacity-0">
        <h3 className="text-3xl md:text-5xl font-bold text-white mb-2 shadow-black drop-shadow-md">{project.title}</h3>
        <div className="w-20 h-2 bg-emerald-500 rounded-full"></div>
      </div>

      <div
        className="absolute inset-0 bg-slate-900/95 transition-opacity duration-300
                  opacity-0 group-hover:opacity-100
                  flex flex-col justify-center items-center p-8 md:p-16 text-center"
      >
        <div className="absolute inset-0 bg-white/10 dark:bg-slate-900/10 pointer-events-none" />
        <h3 className="text-3xl md:text-5xl font-bold text-emerald-400 mb-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {project.title}
        </h3>

        <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-3xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-3 justify-center mb-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-100">
          {project.tech.map((t, i) => (
            <span key={i} className="text-sm md:text-base font-medium bg-emerald-500/10 text-emerald-300 px-5 py-2 rounded-full border border-emerald-500/20">
              {t}
            </span>
          ))}
        </div>

        <div className="inline-flex items-center gap-2 text-white bg-emerald-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-500 transition-colors shadow-lg">
          View Details <ArrowRight size={22} />
        </div>
      </div>
    </a>
  );
};
