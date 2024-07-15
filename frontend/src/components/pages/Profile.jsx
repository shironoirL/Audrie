import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/AuthContext.jsx';
import axios from 'axios';

const Profile = () => {
  const { authState } = useAuth();
  const { username, email, token } = authState;
  const [savedDrugs, setSavedDrugs] = useState([]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isPasswordChangeVisible, setIsPasswordChangeVisible] = useState(false);

  useEffect(() => {
    const savedDrugs = JSON.parse(localStorage.getItem(email)) || [];
    setSavedDrugs(savedDrugs);
  }, [email]);

  const handleRemove = (drugName) => {
    const newSavedDrugs = savedDrugs.filter(name => name !== drugName);
    localStorage.setItem(email, JSON.stringify(newSavedDrugs));
    setSavedDrugs(newSavedDrugs);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setMessage('New passwords do not match');
      return;
    }
    try {
      await axios.post(
        '/api/auth/users/set_password/',
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setMessage('Password changed successfully');
    } catch (error) {
      console.error('Failed to change password:', error);
      setMessage('Failed to change password');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Email:</strong> {email}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Saved Drugs</h2>
        <ul>
          {savedDrugs.map((drugName) => (
            <li key={drugName} className="mb-2 flex justify-between items-center">
              <a href={`/drugs/${drugName}`} className="text-blue-500 hover:underline">
                {drugName}
              </a>
              <button
                onClick={() => handleRemove(drugName)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-4 rounded shadow mt-4">
        <button
          onClick={() => setIsPasswordChangeVisible(!isPasswordChangeVisible)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
        >
          {isPasswordChangeVisible ? 'Hide' : 'Change Password'}
        </button>
        {isPasswordChangeVisible && (
          <div>
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="current-password">
                  Current Password
                </label>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-password">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-new-password">
                  Confirm New Password
                </label>
                <input
                  id="confirm-new-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Change Password
              </button>
            </form>
            {message && <p className="mt-4 text-red-500">{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
