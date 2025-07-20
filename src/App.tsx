import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import TranscriptionModule from './components/TranscriptionModule';
import RAGModule from './components/RAGModule';
import DocumentationModule from './components/DocumentationModule';
import StatisticsModule from './components/StatisticsModule';

export type ActiveModule = 'chat' | 'transcription' | 'rag' | 'documentation' | 'statistics';

function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('chat');

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'chat':
        return <ChatInterface />;
      case 'transcription':
        return <TranscriptionModule />;
      case 'rag':
        return <RAGModule />;
      case 'documentation':
        return <DocumentationModule />;
      case 'statistics':
        return <StatisticsModule />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <main className="flex-1 flex flex-col">
        {renderActiveModule()}
      </main>
    </div>
  );
}

export default App;