import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import DrugList from './components/pages/DrugList';
import DrugDetail from './components/pages/DrugDetail.jsx';
import Repurposing from './components/pages/Repurposing.jsx';
import SearchResults from './components/pages/SearchResults.jsx';
import LandingPage from './components/pages/LandingPage.jsx'; // Import the new landing page
import Login from './components/pages/Login.jsx';
import Register from './components/pages/Register.jsx';
import './index.css';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/utils/AuthContext.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/drugs',
        element: <DrugList />,
      },
      {
        path: '/drugs/:drugName',
        element: <DrugDetail />,
      },
      {
        path: '/search',
        element: <SearchResults />,
      },
      {
        path: '/repurposing/:drugName/:diseaseName',
        element: <Repurposing />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
]);

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
