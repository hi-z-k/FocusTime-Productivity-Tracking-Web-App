import React, { useState, useEffect } from 'react';
import '../../styles/forms.css';
import '../../styles/buttons.css';
import { signUp, verifyEmail } from '../../services/authService';
import { auth } from '../../services/firebase/firebaseConfig';
import SocialBtn from '../../components/ui/SocialBtn';
import messageOf from './errorMsg';

const Register = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState(null);
  const [isSent, setIsSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    let interval;
    if (isSent && auth.currentUser) {
      interval = setInterval(async () => {
        try {
          await auth.currentUser.reload();
          if (auth.currentUser.emailVerified) {
            clearInterval(interval);
            onNavigate('home');
          }
        } catch (err) {
          console.error("Polling reload failed", err);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isSent, onNavigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError({ code: 'auth/passwords-do-not-match' });
      return;
    }
    try {
      const newUser = await signUp(formData.email, formData.password);
      await verifyEmail(newUser);
      setIsSent(true);
      setCountdown(60); 
    } catch (err) {
      setError(err);
    }
  };

  const handleResend = async () => {
    const user = auth.currentUser;
    if (countdown > 0 || !user) return;
    try {
      await verifyEmail(user);
      setCountdown(60); 
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div style={authStyles.container}>
      <div style={authStyles.imagePanel}>
        <div style={authStyles.placeholderContent}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Join Us</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Master your productivity flow.</p>
        </div>
      </div>

      <div style={authStyles.formPanel}>
        <div style={authStyles.formWrapper}>
          {!isSent ? (
            <>
              <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Register</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Create an account to continue</p>
              {error && <div style={authStyles.errorBadge}>{messageOf(error)}</div>}
              <form onSubmit={handleRegister}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={authStyles.label}>Email</label>
                  <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={authStyles.label}>Password</label>
                  <input type="password" name="password" className="form-input" value={formData.password} onChange={handleChange} required />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={authStyles.label}>Confirm Password</label>
                  <input type="password" name="confirmPassword" className="form-input" value={formData.confirmPassword} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>SIGN UP</button>
              </form>
              <SocialBtn onSocialLogin={() => {}} mode="in" />
              <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                Already have an account? <span onClick={() => onNavigate('login')} style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: '600' }}>Login</span>
              </p>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={authStyles.iconCircle}>📧</div>
              <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>Verify your email</h2>
              <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                We've sent a link to <strong>{formData.email}</strong>.<br />
                The app will update automatically once verified.
              </p>
              
              <div style={{ marginBottom: '2rem', minHeight: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {error && <div style={{...authStyles.errorBadge, marginBottom: '10px'}}>{messageOf(error)}</div>}
                
                {countdown > 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>
                    You can resend the email in <span style={{ color: '#3b82f6' }}>{countdown}s</span>
                  </p>
                ) : (
                  <button onClick={handleResend} className="btn btn-primary" style={{ width: '100%', padding: '10px', backgroundColor: '#3b82f6' }}>
                    RESEND VERIFICATION EMAIL
                  </button>
                )}
              </div>

              <p style={{ fontSize: '0.9rem' }}>
                Wrong email? <span onClick={() => setIsSent(false)} style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: '600' }}>Go Back</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const authStyles = {
  container: { display: 'flex', height: '100vh', width: '100vw', backgroundColor: 'white' },
  imagePanel: { flex: 1, backgroundColor: '#3b82f6', display: window.innerWidth < 768 ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', borderTopRightRadius: '40px', borderBottomRightRadius: '40px' },
  placeholderContent: { textAlign: 'center' },
  formPanel: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  formWrapper: { width: '100%', maxWidth: '400px' },
  label: { display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500', color: '#333' },
  errorBadge: { display: 'flex', alignItems: 'center', backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500', border: '1px solid #fee2e2' },
  iconCircle: { width: '80px', height: '80px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem auto', color: '#3b82f6' }
};

export default Register;