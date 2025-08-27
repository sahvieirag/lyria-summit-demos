import React from 'react';
import ReactDOM from 'react-dom/client';
import {gen} from '../components/PromptDJ';
import type {PromptDj} from '../components/PromptDJ';
import './../prompt-dj.css';

const PromptDJFrame = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const promptDjRef = React.useRef<PromptDj | null>(null);

  React.useEffect(() => {
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PromptDJFrame />
  </React.StrictMode>,
);
