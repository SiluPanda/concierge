
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import ForYouPage from './pages/ForYouPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col h-screen bg-dark-bg text-white overflow-hidden font-sans">
        <main className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/for-you" element={<ForYouPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
