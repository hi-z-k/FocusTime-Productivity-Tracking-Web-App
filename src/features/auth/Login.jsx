import React, { useState } from 'react';
import '../../styles/forms.css';
import '../../styles/buttons.css';
import { logIn } from '../../services/authService';

const Login = ({ onNavigate }) => { // Added onNavigate prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const [error, setError] = useState(null); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); 

    try {
      await logIn(email, password)
    } catch (err) {
      setError(err.message); 
    }
  };

  return (
    <div style={authStyles.container}>
      {/* Left Panel - Visual/Image */}
      <div style={authStyles.imagePanel}>
        <div style={authStyles.placeholderContent}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>FocusTime</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>
            Master your productivity flow.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={authStyles.formPanel}>
        <div style={authStyles.formWrapper}>
          <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Login</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Enter your details to get started
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={authStyles.label}>Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={authStyles.label}>Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
              LOGIN
            </button>
          </form>

          <div style={authStyles.divider}>Or Sign in with</div>

          <div style={authStyles.socialButtons}>
            <button className="btn" style={authStyles.socialBtn}>Google</button>
            <button className="btn" style={authStyles.socialBtn}>Apple ID</button>
            <button className="btn" style={authStyles.socialBtn}>Facebook</button>
          </div>

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
    // FIXED: Only one display key here now
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
  divider: {
    textAlign: 'center',
    margin: '20px 0',
    color: '#666',
    fontSize: '0.85rem',
  },
  socialButtons: {
    display: 'flex',
    gap: '10px',
  },
  socialBtn: {
    flex: 1,
    border: '1px solid #ddd',
    background: 'white',
  },
};

export default Login;