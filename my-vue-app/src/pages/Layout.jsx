import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export function Layout() {
  return (
    <div className="flex w-screen h-screen">
      <div className="w-1/3 max-w-xs">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}
