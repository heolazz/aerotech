import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import CustomOrder from './pages/CustomOrder';
import Tracking from './pages/Tracking';
import Support from './pages/Support';
import Portofolio from './pages/Portofolio';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'catalog':
        return <Catalog />;
      case 'custom':
        return <CustomOrder />;
      case 'tracking':
        return <Tracking />;
      case 'support':
        return <Support />;
      case 'portfolio':
        return <Portofolio />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-slate-200 selection:text-black">
      <Navbar activePage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
};

export default App;