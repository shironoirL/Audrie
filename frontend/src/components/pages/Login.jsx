import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext.jsx';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/token/login/', {
        username,
        password
      });
      if (response.data.auth_token) {
        login(response.data.auth_token);
        setMessage('Login successful');
        navigate('/'); // Redirect to home or another page
      } else {
        setMessage('Login failed: ' + (response.data.non_field_errors ? response.data.non_field_errors.join(', ') : 'Unknown error'));
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="w-full max-w-md p-8 space-y-3 rounded-xl shadow-lg bg-white" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-3 py-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
          Login
        </button>
        {message && <p className="mt-3 text-center text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
