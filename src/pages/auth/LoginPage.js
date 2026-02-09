// admin-panel/src/pages/auth/LoginPage.js

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import './LoginPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone || phone.length !== 8) {
      setError('Утасны дугаар 8 оронтой байх ёстой');
      return;
    }

    if (!password) {
      setError('Нууц үг оруулна уу');
      return;
    }

    setLoading(true);
    const result = await login(phone, password);
    setLoading(false);

    if (!result.success) {
      setError(result.message || 'Нэвтрэх амжилтгүй');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
  <div className="logo-large">
    <div className="logo-icon-large">X</div>
  </div>
  <h1>ZeelX Admin</h1>
  <p>Админ панел руу нэвтрэх</p>
</div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label>Утасны дугаар</label>
            <input
              type="text"
              placeholder="99999999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={8}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Нууц үг</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={loading}
            className="login-button"
          >
            Нэвтрэх
          </Button>
        </form>
      </div>
    </div>
  );
}