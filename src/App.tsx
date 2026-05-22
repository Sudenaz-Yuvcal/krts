import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Services } from './pages/HairdresserPanel/Services';
import { Products } from './pages/HairdresserPanel/Products'; 
import { Appointments } from './pages/HairdresserPanel/Appointments';

function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const renderPage = () => {
    switch (activeTab) {
      case 'services':
        return <Services />;
      case 'products':
        return <Products />; 
      case 'appointments':
        return <Appointments />;
      case 'salon':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tight text-slate-800">Salon Detayı</h2>
            <div className="bg-white p-8 rounded-[32px] shadow-xs border border-slate-100 text-slate-400 font-bold text-sm">
              Salon bilgileri, çalışma saatleri ve adres yönetimi alanı.
            </div>
          </div>
        );
      case 'staff':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tight text-slate-800">Çalışanlar</h2>
            <div className="bg-white p-8 rounded-[32px] shadow-xs border border-slate-100 text-slate-400 font-bold text-sm">
              Personel listesi ve koltuk doluluk oranları alanı.
            </div>
          </div>
        );
      case 'reviews':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tight text-slate-800">Yorumlar</h2>
            <div className="bg-white p-8 rounded-[32px] shadow-xs border border-slate-100 text-slate-400 font-bold text-sm">
              Müşteri geri bildirimleri ve puanlamalar alanı.
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tight text-slate-800">Panel Özeti</h2>
            <div className="bg-white p-8 rounded-[32px] shadow-xs border border-slate-100 text-slate-400 font-bold text-sm">
              Genel performans ve analizlerin listelendiği ana gösterge paneli.
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-brand-base text-slate-800 flex w-full overflow-x-hidden font-sans antialiased">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 pl-72 flex flex-col min-h-screen w-full">
        <Header />
        <main className="flex-1 px-12 pb-12 w-full">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;