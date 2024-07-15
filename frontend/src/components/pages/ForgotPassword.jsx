import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/users/reset_password/', {
        email,
      });
      setMessage('Password reset email has been sent.');
    } catch (error) {
      setMessage('Failed to send password reset email. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="w-full max-w-md p-8 space-y-3 rounded-xl shadow-lg bg-white" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        <div className="space-y-2">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
          Send Reset Email
        </button>
        {message && <p className="mt-3 text-center text-red-500 whitespace-pre-line">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
