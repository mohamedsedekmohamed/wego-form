import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Home, Briefcase, Shield, AppWindow, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
const AllRoutes = ({ setIsAuthenticate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "Application", label: "Application", icon: <AppWindow size={20} /> },
    { to: "City", label: "City", icon: <Home size={20} /> },
    { to: "Job", label: "Job", icon: <Briefcase size={20} /> },
    { to: "Security", label: "Security", icon: <Shield size={20} /> },
  ];
  const log = () => {
    localStorage.removeItem("token");
    setIsAuthenticate((p) => !p);
    nav("/")
  };
  const nav=useNavigate()
  return (
    <div className="flex h-screen relative">
      {/* 📌 Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full bg-slate-800 text-white transition-all duration-300 z-50 
        ${isOpen ? "w-64" : "w-0 md:w-64"} 
        overflow-hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-bold">WEGO</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-white p-1 hover:bg-slate-700 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition-colors ${
                  isActive ? "bg-slate-600" : "hover:bg-slate-700"
                }`
              }
              onClick={() => setIsOpen(false)} // يقفل المينيو بعد الضغط
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* 📌 Main */}
      <main className="flex-1 p-6 overflow-auto w-full">
        {/* Header */}
        <header className="p-3 bg-gray-800 text-white rounded-b-3xl flex justify-between items-center">
          <span>Admin</span>
          <button
            className="bg-white text-gray-800 px-3 font-extrabold py-1"
            onClick={() => log()}
          >
            Log out
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-white p-1 hover:bg-gray-700 rounded"
          >
            <Menu size={22} />
          </button>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default AllRoutes;
