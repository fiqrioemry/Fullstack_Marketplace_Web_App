import Header from "./Header";
import { Outlet } from "react-router-dom";
import { SidebarNav } from "./SidebarNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <SidebarNav />
      <main className="w-full">
        <Header />
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
