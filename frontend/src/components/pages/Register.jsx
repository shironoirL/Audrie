import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      // Register the user
      await axios.post('/api/auth/users/', {
        email,
        username,
        password,
        re_password: confirmPassword
      });

      // Set the success message
      setMessage('Registration successful. A link to activate your account has been sent to your email.');
    } catch (error) {
      if (error.response && error.response.data) {
        const errors = error.response.data;
        let errorMessage = '';

        for (const value of Object.values(errors)) {
          errorMessage += `${value.join('\n')}\n`;
        }
        setMessage(errorMessage.trim());
      } else {
        setMessage('Registration failed');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleRegister} className="w-full max-w-md p-8 space-y-3 rounded-xl shadow-lg bg-white">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
          Register
        </button>
        {message && <p className="mt-3 text-center text-red-500 whitespace-pre-line">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
