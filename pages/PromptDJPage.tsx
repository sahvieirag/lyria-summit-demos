import React from 'react';
import './../prompt-dj.css';

const PromptDJPage: React.FC = () => {
  return (
    <div style={{ height: 'calc(100vh - 80px)' }}>
      <iframe
        src="/prompt-dj-frame.html"
        style={{width: '100%', height: '100%', border: 'none'}}
        title="Prompt DJ"
      />
    </div>
  );
};

export default PromptDJPage;
