import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LandingPage.css';
import ParticlesBackground from '../particles/ParticlesBackground'; // Import the new component
import Logo from '../logo/img.svg'; // Import the SVG file

const LandingPage = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('non-scrollable');
    return () => {
      document.body.classList.remove('non-scrollable');
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}`);
    }
  };

  return (
    <div className="landing-page">
      <ParticlesBackground />
      <div className="content">
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
          <h1 className="title">AUDRIE</h1>
        </div>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter name of compound, e.g. Propranolol"
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;
