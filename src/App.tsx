// src/App.tsx
import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/HairdresserPanel/Dashboard';
import { SalonDetails } from './pages/HairdresserPanel/SalonDetails';
import { Services } from './pages/HairdresserPanel/Services';
import { Appointments } from './pages/HairdresserPanel/Appointments';
import { Reviews } from './pages/HairdresserPanel/Reviews';
import { ProductSales } from './pages/HairdresserPanel/ProductSales';

function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'salon': return <SalonDetails />;
      case 'services': return <Services />;
      case 'appointments': return <Appointments />;
      case 'reviews': return <Reviews />;
      case 'sales': return <ProductSales />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-base text-slate-800 flex w-full overflow-x-hidden font-sans antialiased">
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 pl-72 flex flex-col min-h-screen w-full">
        <Header />
        
        <main className="flex-1 px-12 pb-12 w-full animate-fadeIn">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;