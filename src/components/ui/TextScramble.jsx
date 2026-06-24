import React, { useState, useEffect, useRef } from 'react';

export const TextScramble = ({ phrases, wait = 2000 }) => {
  const [text] = useState(phrases[0]);
  const elementRef = useRef(null);
  const chars = "!<>-_\\/[]{}░▒▓—=+*^?#________";
  const queue = useRef([]);
  const frameRequest = useRef(null);
  const frame = useRef(0);
  const resolve = useRef(null);

  useEffect(() => {
    let counter = 0;
    
    const next = () => {
      const newText = phrases[counter % phrases.length];
      scramble(newText).then(() => {
        setTimeout(() => {
          counter++;
          next();
        }, wait);
      });
    };

    next();
    return () => cancelAnimationFrame(frameRequest.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrases]);

  const scramble = (newText) => {
    const length = Math.max(text.length, newText.length);
    const promise = new Promise((res) => (resolve.current = res));
    queue.current = [];
    
    for (let i = 0; i < length; i++) {
      const from = text[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.current.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(frameRequest.current);
    frame.current = 0;
    update();
    return promise;
  };

  const update = () => {
    let output = "";
    let complete = 0;
    
    for (let i = 0, n = queue.current.length; i < n; i++) {
      let { from, to, start, end, char } = queue.current[i];
      if (frame.current >= end) {
        complete++;
        output += to;
      } else if (frame.current >= start) {
        if (!char || Math.random() < 0.28) {
          char = chars[Math.floor(Math.random() * chars.length)];
          queue.current[i].char = char;
        }
        output += `<span class="text-emerald-500/50">${char}</span>`;
      } else {
        output += from;
      }
    }
    
    if (elementRef.current) elementRef.current.innerHTML = output;
    
    if (complete === queue.current.length) {
      resolve.current();
    } else {
      frameRequest.current = requestAnimationFrame(update);
      frame.current++;
    }
  };

  return <span className="font-mono" ref={elementRef}>{text}</span>;
};
