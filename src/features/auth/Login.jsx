import React, { useState, useEffect } from 'react';
import '../../styles/forms.css';
import '../../styles/buttons.css';
import { logIn, logInExternal, resetPassword } from '../../services/authService';
import SocialBtn from '../../components/ui/SocialBtn';
import messageOf from './errorMsg';

const Login = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (error || resetSent) {
      const timer = setTimeout(() => {
        setError(null);
        setResetSent(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, resetSent]);

  const handleInput = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await logIn(email, password);
    } catch (err) {
      setError(err);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError({ code: 'auth/missing-email' });
      return;
    }
    setError(null);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      setError(err);
    }
  };

  const handleExternalLogin = (provider) => async () => {
    setError(null);
    try {
      await logInExternal(provider);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div style={authStyles.container}>
      <div style={authStyles.imagePanel}>
        <div style={authStyles.placeholderContent}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>FocusTime</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>
            Master your productivity flow.
          </p>
        </div>
      </div>

      <div style={authStyles.formPanel}>
        <div style={authStyles.formWrapper}>
          <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Login</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Enter your details to get started
          </p>
          
          {error && (
            <div style={authStyles.errorBadge}>
              {messageOf(error)}
            </div>
          )}

          {resetSent && (
            <div style={{ ...authStyles.errorBadge, backgroundColor: '#f0fdf4', color: '#16a34a', borderColor: '#dcfce7' }}>
              Reset email sent! Check your inbox. Don't see it? Please check your spam folder and mark it as 'Not Spam' to ensure you receive future updates.
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={authStyles.label}>Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@gmail.com"
                value={email}
                onChange={handleInput(setEmail)}
                required
              />
            </div>

            <div style={{ marginBottom: '0.5rem' }}>
              <label style={authStyles.label}>Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={handleInput(setPassword)}
                required
              />
            </div>

            <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
              <span 
                onClick={handleForgotPassword}
                style={{ fontSize: '0.85rem', color: '#3b82f6', cursor: 'pointer', fontWeight: '500' }}
              >
                Forgot Password?
              </span>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
              LOGIN
            </button>
          </form>

          <SocialBtn onSocialLogin={handleExternalLogin} mode="in" />

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
            Don't have an account?{" "}
            <span
              onClick={() => onNavigate('register')}
              style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: '600' }}
            >
              Register Now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const authStyles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    backgroundColor: 'white',
  },
  imagePanel: {
    flex: 1,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    borderTopRightRadius: '40px',
    borderBottomRightRadius: '40px',
    position: 'relative',
    overflow: 'hidden',
    display: window.innerWidth < 768 ? 'none' : 'flex',
  },
  placeholderContent: {
    textAlign: 'center',
    zIndex: 2,
  },
  formPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  formWrapper: {
    width: '100%',
    maxWidth: '400px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#333',
  },
  errorBadge: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fef2f2', 
    color: '#dc2626',           
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
    fontWeight: '500',          
    border: '1px solid #fee2e2',
    transition: 'all 0.2s ease-in-out',
  },
};

export default Login;