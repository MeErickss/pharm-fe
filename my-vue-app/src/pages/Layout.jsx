import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export function Layout() {
  return (
    <div className="flex w-screen h-screen">
      <div className="w-52">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 bg-gray-300">
        <Outlet />
      </div>
    </div>
  );
}
