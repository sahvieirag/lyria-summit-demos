import React, { useEffect, useRef } from 'react';
import { PromptDj } from '../components/PromptDJ';
import './../prompt-dj.css';

const PromptDJPage: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      // Clear any existing content
      ref.current.innerHTML = '';
      // Create a new instance of the Lit element
      const promptDjElement = new PromptDj();
      // Append it to the container
      ref.current.appendChild(promptDjElement);
    }
  }, []);

  return <div ref={ref} style={{ height: '100%', width: '100%' }} />;
};

export default PromptDJPage;
