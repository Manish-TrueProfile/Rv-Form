import React, { useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './index.css';
import routes from './routes/routes';

const App = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className={`h-[100dvh] w-full font-inter`}>
      <div className="flex">
        <Routes>
          {routes.map(({ path, Element }) => (
            <Route key={path} path={path} element={Element} />
          ))}
        </Routes>
      </div>
    </div>
  );
};

export default App;
