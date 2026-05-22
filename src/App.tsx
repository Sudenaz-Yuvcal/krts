import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');


  return (
    <div className="min-h-screen bg-brand-base text-slate-800 flex w-full overflow-x-hidden font-sans antialiased">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 pl-72 flex flex-col min-h-screen w-full">
        <Header />
        
      </div>
    </div>
  );
}