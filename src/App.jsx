import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Admin/Login";
import AllRoutes from "./Admin/AllRoutes";
import Application from './Admin/Application'
import City from './Admin/City/City'
import Security from './Admin/Security/Security'
import Job from './Admin/Job/Job'
import { Navigate } from "react-router-dom";
import UserFrom from './User/UserFrom'
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => JSON.parse(localStorage.getItem("isAuthenticated")) || false
  );

  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  return (
    <div className="max-w-screen">
      
      <Routes>
        
        {!isAuthenticated ? (
          <>
          <Route
          path="/"
          element={<Login setIsAuthenticate={setIsAuthenticated} />}
          />
          <Route
          path="/from"
          element={<UserFrom />}
          />
          </>
        ) : (
          <Route path="/" element={<AllRoutes setIsAuthenticate={setIsAuthenticated} />}>
             <Route index element={<Navigate to="Application" replace />} />

            <Route path="City" element={<City />} />
            <Route path="Job" element={<Job />} />
            <Route path="Security" element={<Security />} />
            <Route path="Application" element={<Application />} />
          </Route>
        )}
      </Routes>
    </div>
  );
};

export default App;
