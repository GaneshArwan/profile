import React, { useState, useEffect } from 'react';

export const RotatingText = ({ words, interval = 3000 }) => {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false); // Fade out
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setIsVisible(true); // Fade in
      }, 500); // Wait for fade out
    }, interval);
    return () => clearInterval(timer);
  }, [interval, words.length]);

  return (
    <span className={`inline-block transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {words[index]}
    </span>
  );
};
