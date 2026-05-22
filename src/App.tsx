import { useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { SalonDetails } from "./pages/HairdresserPanel/SalonDetails";
import { Staff } from "./pages/HairdresserPanel/Emloyees";
import { Reviews } from "./pages/HairdresserPanel/Reviews"; 

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="p-6 text-sm font-semibold">
            Kontrol Paneli / İstatistikler
          </div>
        );

      case "salon":
        return <SalonDetails />;

      case "services":
        return (
          <div className="p-6 text-sm font-semibold">
            Hizmetler ve Fiyat Listesi Yönetimi
          </div>
        );

      case "appointments":
        return <div className="p-6 text-sm font-semibold">Randevu Takvimi</div>;

      case "staff":
        return <Staff />;

      case "reviews":
        return <Reviews />;
      case "sales":
        return (
          <div className="p-6 text-sm font-semibold">
            Ürün Satış ve Stok Yönetimi
          </div>
        );

      default:
        return <div className="p-6 text-sm font-semibold">Kontrol Paneli</div>;
    }
  };

  return (
    <div className="min-h-screen bg-brand-base text-slate-800 flex w-full overflow-x-hidden font-sans antialiased">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 pl-72 flex flex-col min-h-screen w-full">
        <Header />

        <main className="flex-1 w-full p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
