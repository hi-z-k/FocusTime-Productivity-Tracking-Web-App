import React, { useState, useEffect } from 'react';
import { usePersonalInfo } from '../../hooks/usePersonalInfo'; // Import your hook
import '../../styles/pages.css';
import '../../styles/forms.css';
import '../../styles/buttons.css';

const Profile = ({ streak, setStreak }) => {
  // 1. Initialize the hook
  const { personalInfo, loading, updateInfo } = usePersonalInfo();
  
  // 2. Local state for the form inputs
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bestStudyTime: 'Morning'
  });

  // 3. Update local form when database data arrives
  useEffect(() => {
    if (personalInfo) {
      setFormData(personalInfo);
    }
  }, [personalInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      // 4. Call the backend via the hook
      await updateInfo(formData);
      
      setStreak(prev => prev + 1);
      alert("Profile Updated! Your streak has increased and data saved to cloud.");
    } catch (error) {
      alert("Failed to save profile. Check console.");
    }
  };

  if (loading) return <div className="dashboard-layout">Loading Profile...</div>;

  return (
    <div className="dashboard-layout">
      <div className="bottom-sections-grid" style={{ marginTop: '20px' }}>
        {/* Left Column: Avatar & Summary */}
        <div className="side-card">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', 
              backgroundColor: '#e5e7eb', display: 'flex', 
              alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', marginBottom: '10px'
            }}>
              👤
            </div>
            <h3 style={{ margin: 0 }}>{formData.firstName || 'User Name'}</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>{formData.email || '@user_handle'}</p>
          </div>
          
          <div className="side-list">
             <button className="btn btn-primary" style={{ width: '100%' }}>Edit Avatar</button>
             <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Daily Streak:</span>
                <span style={{ fontWeight: 'bold', color: '#a08c7d' }}>🔥 {streak} Days</span>
             </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="side-card" style={{ flex: 2 }}>
          <h3 style={{ marginBottom: '20px' }}>Personal Information</h3>
          
          <form onSubmit={handleSaveChanges}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  className="form-input" 
                  value={formData.firstName} 
                  onChange={handleInputChange}
                  placeholder="First Name" 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  className="form-input" 
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name" 
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Email Address</label>
              <input 
                type="email" 
                name="email"
                className="form-input" 
                value={formData.email}
                onChange={handleInputChange}
                placeholder="user@example.com" 
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                className="form-input" 
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 234 567 890" 
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Best Study Time</label>
              <select 
                name="bestStudyTime"
                className="form-select" 
                style={{ width: '100%', padding: '8px' }}
                value={formData.bestStudyTime}
                onChange={handleInputChange}
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn" style={{ border: '1px solid var(--border)' }}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;