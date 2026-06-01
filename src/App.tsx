import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom"; 
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { SalonDetails } from "./pages/HairdresserPanel/SalonDetails";
import { Staff } from "./pages/HairdresserPanel/Emloyees";
import { Reviews } from "./pages/HairdresserPanel/Reviews";
import { Services } from "./pages/HairdresserPanel/Services";
import { Products } from "./pages/HairdresserPanel/Products";
import { Appointments } from "./pages/HairdresserPanel/Appointments";
import { Dashboard } from "./pages/HairdresserPanel/Dashboard";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "salon":
        return <SalonDetails />;
      case "services":
        return <Services />;
      case "appointments":
        return <Appointments />;
      case "staff":
        return <Staff />;
      case "reviews":
        return <Reviews />;
      case "products":
        return <Products />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-brand-base text-slate-800 flex w-full overflow-x-hidden font-sans antialiased">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 pl-72 flex flex-col min-h-screen w-full">
          <Header />

          <main className="flex-1 px-12 pb-12 w-full">{renderContent()}</main>
        </div>
      </div>
    </Router>
  );
}
