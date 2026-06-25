import React, { useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { Mail, Send } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { GlossyText } from '../ui/GlossyText';
import { BackgroundOverlay } from '../ui/BackgroundOverlay';
import { GithubIcon, LinkedinIcon } from '../icons';
import { useBackgroundImage } from '../../hooks/useBackgroundImage';
import { PERSONAL_INFO, LOCAL_BACKGROUNDS, REMOTE_BACKGROUNDS } from '../../data/constants';

export const Contact = ({ isDarkMode }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA verification.");
      return;
    }

    const response = await fetch("https://formspree.io/f/xbdrzqwr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        "g-recaptcha-response": recaptchaToken
      }),
    });
    
    if (response.ok) {
      setFormData({ name: '', email: '', message: '' });
      setRecaptchaToken(null);
      alert("Message sent successfully!");
    } else {
      alert("Failed to send message. Please try again.");
    }
  };

  const bgImage = useBackgroundImage(LOCAL_BACKGROUNDS.contact, REMOTE_BACKGROUNDS.contact);

  return (
    <section id="contact" className="py-20 relative transition-colors duration-300 bg-slate-50 dark:bg-slate-900">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/90" />
        <BackgroundOverlay />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader title={<GlossyText>Get In Touch</GlossyText>} />
      </div>

      <div className="max-w-4xl mx-auto px-2 sm:px-6 relative z-10">
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg leading-relaxed">
              I am currently open to opportunities in Data Analysis, Data Science, and Machine Learning. 
              Whether you have a question, a project collaboration idea, or just want to say hi, I'll try my best to get back to you!
            </p>
            
            <div className="space-y-6">
              <a href={`mailto:${PERSONAL_INFO.email}`} className="flex items-center gap-4 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors group">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-emerald-500 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-emerald-500 transition-all group-hover:scale-110">
                  <Mail size={20} />
                </div>
                <span>{PERSONAL_INFO.email}</span>
              </a>
              <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors group">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-emerald-500 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-emerald-500 transition-all group-hover:scale-110">
                  <LinkedinIcon size={20} />
                </div>
                <span>LinkedIn Profile</span>
              </a>
              <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors group">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-emerald-500 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-emerald-500 transition-all group-hover:scale-110">
                  <GithubIcon size={20} />
                </div>
                <span>GitHub Profile</span>
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-white/80 dark:bg-slate-800/80 p-2 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-sm">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-slate-500 dark:text-slate-400 mb-1">Name</label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Ex: William"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-slate-500 dark:text-slate-400 mb-1">Email</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Ex: william@gmail.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-lg font-medium text-slate-500 dark:text-slate-400 mb-1">Message</label>
              <textarea 
                name="message" 
                id="message" 
                rows="4" 
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                placeholder="Hello, Welcome to my portfolio!"
              ></textarea>
            </div>
            <div className="my-4 w-full flex justify-start">
              <div className="transform scale-[0.77] origin-top-left sm:scale-100 sm:origin-top-left">
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={setRecaptchaToken}
                  theme={isDarkMode ? "dark" : "light"}
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-emerald-500/20"
            >
              <Send size={18} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
