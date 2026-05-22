import { LayoutDashboard, Store, Scissors, CalendarDays, MessageSquare, ShoppingBag, Users } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Kontrol Paneli', icon: LayoutDashboard },
    { id: 'salon', label: 'Salon Detayı', icon: Store },
    { id: 'services', label: 'Hizmetler', icon: Scissors },
    { id: 'appointments', label: 'Randevular', icon: CalendarDays },
    { id: 'staff', label: 'Çalışanlar', icon: Users },
    { id: 'reviews', label: 'Yorumlar', icon: MessageSquare },
    { id: 'sales', label: 'Ürünler', icon: ShoppingBag },
  ];

  return (
    <aside className="w-72 h-screen bg-white border-r border-slate-100/80 fixed left-0 top-0 flex flex-col justify-between py-8 z-40">
      <div className="space-y-10">
        <div className="flex items-center gap-3 px-8">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center overflow-hidden">
            <img src="src/assets/krtsLogo.png" alt="Krts" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-800 leading-none">KRTS</h1>
            <span className="text-[10px] font-black tracking-widest text-brand-purple uppercase block mt-1">KUAFÖR PANELİ</span>
          </div>
        </div>

        <nav className="space-y-1 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold tracking-tight transition-all duration-200 relative cursor-pointer ${
                  isActive
                    ? 'bg-purple-50/70 text-brand-purple'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-brand-purple' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <div className="w-1 h-5 bg-brand-purple rounded-full absolute right-0 top-1/2 -translate-y-1/2" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};