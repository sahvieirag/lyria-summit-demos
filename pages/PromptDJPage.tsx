import React, {useEffect, useRef} from 'react';
import {gen} from '../components/PromptDJ';
import type {PromptDj} from '../components/PromptDJ';
import './../prompt-dj.css';

const PromptDJPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const promptDjRef = useRef<PromptDj | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Clear any previous content
      containerRef.current.innerHTML = '';
      // Generate the Lit component and store a reference to it
      promptDjRef.current = gen(containerRef.current);
    }

    // Cleanup function to be called on component unmount
    return () => {
      if (promptDjRef.current) {
        promptDjRef.current.close();
        promptDjRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} style={{height: '100%', width: '100%'}} />;
};

export default PromptDJPage;
