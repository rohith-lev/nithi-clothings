import { Outlet, ScrollRestoration } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";

export default function Root() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#0F172A] font-body selection:bg-[#064E3B]/20 pb-16 lg:pb-0">
      <ScrollRestoration />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
