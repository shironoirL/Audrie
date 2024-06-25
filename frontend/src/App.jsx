// App.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-grow p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
