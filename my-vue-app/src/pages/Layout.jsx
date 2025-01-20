import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export function Layout() {
  return (
    <div className="flex w-screen min-h-screen">
      <Sidebar />
      <main className="flex flex-1">
        <Outlet />
      </main>
    </div>
  );
}
