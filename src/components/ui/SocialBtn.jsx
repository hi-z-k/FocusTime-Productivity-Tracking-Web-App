import React from 'react';

const SocialBtn = ({ onSocialLogin, title = "Sign in with" }) => {
  return (
    <>
      <div style={socialStyles.divider}>Or {title}</div>

      <div style={socialStyles.socialButtons}>
        <button 
          className="btn" 
          style={socialStyles.socialBtn} 
          onClick={onSocialLogin('google')}
        >
          Google
        </button>
        
        <button 
          className="btn" 
          style={socialStyles.socialBtn} 
          onClick={onSocialLogin('apple')}
        >
          Apple ID
        </button>
        
        <button 
          className="btn" 
          style={socialStyles.socialBtn} 
          onClick={onSocialLogin('facebook')}
        >
          Facebook
        </button>
      </div>
    </>
  );
};

const socialStyles = {
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
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '4px'
  },
};

export default SocialBtn;