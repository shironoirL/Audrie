import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Activate = () => {
  const { uid, token } = useParams();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const activateAccount = async () => {
      try {
        await axios.post('/api/auth/users/activation/', {
          uid,
          token,
        });
        setMessage('Your account has been successfully activated. You can now log in.');
      } catch (error) {
        setMessage('Activation failed. The activation link might be invalid or expired.');
      }
    };

    activateAccount();
  }, [uid, token]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl shadow-lg bg-white">
        <h1 className="text-2xl font-bold text-center">Account Activation</h1>
        <p className="mt-3 text-center text-red-500 whitespace-pre-line">{message}</p>
      </div>
    </div>
  );
};

export default Activate;
