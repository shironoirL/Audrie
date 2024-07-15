import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './utils/AuthContext.jsx';
import Logo from './logo/img.svg';

const Navigation = () => {
  const { authState, logout } = useAuth();
  const { username } = authState;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <header className="w-full">
      <nav className="bg-gradient-to-r from-indigo-500 via-blue-300 to-blue-100 border-gray-200 px-4 lg:px-6 py-2 dark:bg-gray-800 w-full">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl w-full">
          <a href="/" className="flex items-center">
            <img src={Logo} className="h-12 mr-3" alt="Logo" />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white hover:text-indigo-600">AUDRiE</span>
          </a>
          <div className="flex items-center lg:order-2">
            <form onSubmit={(e) => { e.preventDefault(); navigate(`/search?query=${encodeURIComponent(e.target.search.value)}`); }} className="flex items-center space-x-2">
              <input
                type="text"
                name="search"
                placeholder="Search drugs"
                className="p-2 border rounded-l-full"
              />
              <button type="submit" className="p-2 bg-golubenkiy text-white rounded-r-full hover:bg-blue-500">
                Search
              </button>
            </form>
            {username ? (
              <>
                <a href="/profile" className="text-black bg-primary-700 ml-4 hover:bg-primary-800 hover:text-indigo-600">
                  {username}
                </a>
                <button onClick={handleLogout} className="text-black bg-primary-700 ml-4 hover:bg-primary-800 hover:text-indigo-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="text-black bg-primary-700 ml-4 hover:bg-primary-800 hover:text-indigo-600">Login</a>
                <a href="/register" className="text-black bg-primary-700 ml-4 hover:bg-primary-800 hover:text-indigo-600">Register</a>
              </>
            )}
            <button data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 hover:text-indigo-600">
              <span className="sr-only">Open main menu</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a 1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
              <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
          </div>
          <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
            <ul className="flex flex-col mt-4 font-medium lg:space-x-8 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <a href="/drugs" className="text-black bg-primary-700 hover:bg-primary-800 hover:text-indigo-600">Compounds</a>
              </li>
              <li>
                <a href="https://audrie.tilda.ws/" className="text-black bg-primary-700 ml-4 hover:bg-primary-800 hover:text-indigo-600">About</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
