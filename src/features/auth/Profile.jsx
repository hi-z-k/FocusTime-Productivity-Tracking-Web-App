import React, { useState, useEffect, useRef } from "react";
import { usePersonalInfo } from "../../hooks/usePersonalInfo";
import { useProgressAnalytics } from "../../hooks/useProgressAnalytics";
import { auth } from "../../services/firebase/firebaseConfig";

import "../../styles/profile.css";

const Profile = () => {
  const { personalInfo, loading, updateInfo } = usePersonalInfo();
  const { data } = useProgressAnalytics();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bestStudyTime: "Morning",
    photoURL: ""
  });

  // Syncs the local form with the database whenever the database updates
  useEffect(() => {
    if (personalInfo && Object.keys(personalInfo).length > 0) {
      setFormData((prev) => ({
        ...prev,
        ...personalInfo
      }));
    }
  }, [personalInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 800000) {
      alert("Image is too large. Please select a photo under 800KB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;

      try {
        setFormData((prev) => ({ ...prev, photoURL: base64String }));
        // Saves the image string directly to Firestore
        await updateInfo({ ...formData, photoURL: base64String });
        alert("Avatar updated!");
      } catch (error) {
        console.error("Save Error:", error);
        alert("Failed to save avatar.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      await updateInfo(formData);
      alert("Profile Updated!");
    } catch (error) {
      alert("Failed to save profile.");
    }
  };

  if (loading) return <div className="dashboard-layout">Loading Profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-grid">
        {/* Left Column: Avatar & Summary */}
        <aside className="profile-card">
          <div className="avatar-section">
            <div className="avatar-circle">
              {formData.photoURL ? (
                <img src={formData.photoURL} alt="Avatar" className="avatar-img" />
              ) : (
                "👤"
              )}
            </div>
            {/* Dynamic Name and Handle */}
            <h3 style={{ margin: "10px 0 5px" }}>
              {formData.firstName || "User"} {formData.lastName || ""}
            </h3>
            <p style={{ color: "var(--text-muted)" }}>
              @{formData.email ? formData.email.split('@')[0] : (formData.firstName?.toLowerCase() || "user_handle")}
            </p>
          </div>

          <div className="side-list">
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              accept="image/*"
              onChange={handleFileChange}
            />
            <button 
              className="btn btn-primary" 
              style={{ width: "100%" }}
              onClick={() => fileInputRef.current.click()}
            >
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
                  value={formData?.firstName || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="profile-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="profile-input"
                  value={formData?.lastName || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="profile-form-group">
              <label className="profile-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="profile-input"
                value={formData?.email || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="profile-form-group">
              <label className="profile-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="profile-input"
                value={formData?.phone || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="profile-form-group">
              <label className="profile-label">Best Study Time</label>
              <select
                name="bestStudyTime"
                className="profile-select"
                value={formData?.bestStudyTime || "Morning"}
                onChange={handleInputChange}
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "30px" }}>
              {/* FIXED CANCEL BUTTON: Reverts to original database state */}
              <button
                type="button"
                className="btn"
                style={{ border: "1px solid var(--border)" }}
                onClick={() => setFormData(personalInfo)} 
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