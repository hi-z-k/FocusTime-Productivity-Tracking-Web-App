import React, { useState, useEffect } from "react";
import { usePersonalInfo } from "../../hooks/usePersonalInfo"; // Import your hook
import { useProgressAnalytics } from "../../hooks/useProgressAnalytics";

import "../../styles/profile.css";

const Profile = () => {
  // 1. Initialize the hook
  const { personalInfo, loading, updateInfo } = usePersonalInfo();
  const { data } = useProgressAnalytics();
  const streak = data?.streak || 0;

  // 2. Local state for the form inputs
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bestStudyTime: "Morning",
  });

  // 3. Update local form when database data arrives
  useEffect(() => {
    if (personalInfo) {
      setFormData(personalInfo);
    }
  }, [personalInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      // 4. Call the backend via the hook
      await updateInfo(formData);

      alert(
        "Profile Updated! Your streak has increased and data saved to cloud."
      );
    } catch (error) {
      alert("Failed to save profile. Check console.");
    }
  };

  if (loading)
    return <div className="dashboard-layout">Loading Profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-grid">
        {/* Left Column: Avatar & Summary */}
        <aside className="profile-card">
          <div className="avatar-section">
            <div className="avatar-circle">👤</div>
            <h3 style={{ margin: "10px 0 5px" }}>
              {formData.firstName || "User Name"}
            </h3>
            <p style={{ color: "var(--text-muted)" }}>
              {formData.email || "@user_handle"}
            </p>
          </div>

          <div className="side-list">
            <button className="btn btn-primary" style={{ width: "100%" }}>
              Edit Avatar
            </button>
            <div className="streak-badge">
              <span>Daily Streak</span>
              <span className="streak-count">🔥 {data?.streak || 0} Days</span>
            </div>
          </div>
        </aside>

        {/* Right Column: Edit Form */}
        <main className="profile-card">
          <h3 style={{ marginBottom: "25px" }}>Personal Information</h3>

          <form onSubmit={handleSaveChanges}>
            <div className="profile-input-grid profile-form-group">
              <div>
                <label className="profile-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="profile-input"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="profile-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="profile-input"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className="profile-form-group">
              <label className="profile-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="profile-input"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="profile-form-group">
              <label className="profile-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="profile-input"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="profile-form-group">
              <label className="profile-label">Best Study Time</label>
              <select
                name="bestStudyTime"
                className="profile-select"
                value={formData.bestStudyTime}
                onChange={handleInputChange}
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
                marginTop: "30px",
              }}
            >
              <button
                type="button"
                className="btn"
                style={{ border: "1px solid var(--border)" }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Profile;
