// src/components/layout/Sidebar.tsx
import React from 'react';
import { LayoutDashboard, Store, Scissors, CalendarDays, MessageSquare, ShoppingBag, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'salon', name: 'Salon Detayı', icon: Store },
    { id: 'services', name: 'Hizmetler', icon: Scissors },
    { id: 'appointments', name: 'Randevular', icon: CalendarDays },
    { id: 'reviews', name: 'Yorumlar', icon: MessageSquare },
    { id: 'sales', name: 'Ürün Satışı', icon: ShoppingBag },
  ];

  return (
    <div className="w-72 bg-white h-screen fixed left-0 top-0 border-r border-slate-100/80 flex flex-col justify-between py-9 px-6 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.01)]">
      <div>
        <div className="flex items-center gap-3.5 px-3 mb-12">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-brand-purple to-purple-500 flex items-center justify-center shadow-md shadow-purple-200 text-white font-extrabold text-xl tracking-tight">
            K
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-800">KRTS</span>
            <span className="text-[11px] text-brand-purple font-bold tracking-wider uppercase -mt-1">Kuaför Paneli</span>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[14px] font-bold tracking-tight transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-[#F5F3FF] text-brand-purple' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-brand-purple' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <span className="w-1 h-5 bg-brand-purple rounded-full absolute right-0 top-1/2 -translate-y-1/2"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-2">
        <button className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-[14px] font-bold text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 group">
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
          <span>Oturumu Kapat</span>
        </button>
      </div>
    </div>
  );
};