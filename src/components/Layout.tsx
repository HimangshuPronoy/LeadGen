
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Navbar from "./Navbar";
import { useLocation, Outlet } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  if (isDashboard) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
