"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../auth/AuthContext"
import { useNavigate } from "react-router-dom"
import "./Profile.css"
import { User, Mail, Calendar, BookOpen, Award, Clock, Gift, Shield, Zap } from "lucide-react"

const Profile = () => {
  const { fetchProfile, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("info")

  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }

      const profileData = await fetchProfile()
      setProfile(profileData)
      setLoading(false)
    }
    loadProfile()
  }, [fetchProfile, isAuthenticated])

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="profile-auth-required">
        <div className="auth-icon">
          <Shield size={48} />
        </div>
        <h2>Authentication Required</h2>
        <p>Please log in to view your profile.</p>
        <button className="primary-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="profile-error">
        <h2>Failed to load profile</h2>
        <p>We couldn't retrieve your profile information. Please try again later.</p>
        <button onClick={() => navigate("/")} className="primary-btn">
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-avatar">
            {profile.firstName?.charAt(0)}
            {profile.lastName?.charAt(0)}
          </div>
        </div>
        <div className="profile-header-content">
          <h1>
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="profile-tagline">Student at TSU University</p>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Events</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Badges</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Coins</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button className={`tab-btn ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")}>
          <User size={18} />
          <span>Information</span>
        </button>
        <button className={`tab-btn ${activeTab === "badges" ? "active" : ""}`} onClick={() => setActiveTab("badges")}>
          <Award size={18} />
          <span>Badges</span>
        </button>
        <button className={`tab-btn ${activeTab === "events" ? "active" : ""}`} onClick={() => setActiveTab("events")}>
          <Calendar size={18} />
          <span>Events</span>
        </button>
      </div>

      <div className="profile-content">
        {activeTab === "info" && (
          <div className="profile-info-section">
            <div className="info-card">
              <h3>Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <Mail className="info-icon" />
                  <div>
                    <span className="info-label">Email</span>
                    <span className="info-value">{profile.email}</span>
                  </div>
                </div>
                <div className="info-item">
                  <Calendar className="info-icon" />
                  <div>
                    <span className="info-label">Birthday</span>
                    <span className="info-value">{new Date(profile.birthday).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="info-item">
                  <BookOpen className="info-icon" />
                  <div>
                    <span className="info-label">Faculty</span>
                    <span className="info-value">{profile.faculty}</span>
                  </div>
                </div>
                <div className="info-item">
                  <Award className="info-icon" />
                  <div>
                    <span className="info-label">Degree</span>
                    <span className="info-value">{profile.degree}</span>
                  </div>
                </div>
                <div className="info-item">
                  <Clock className="info-icon" />
                  <div>
                    <span className="info-label">Year</span>
                    <span className="info-value">{profile.year}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>Account Status</h3>
              <div className="status-item">
                <div className="status-icon student">
                  <User size={20} />
                </div>
                <div className="status-info">
                  <span className="status-label">Account Type</span>
                  <span className="status-value">Student</span>
                </div>
              </div>
              <div className="status-item">
                <div className="status-icon active">
                  <Zap size={20} />
                </div>
                <div className="status-info">
                  <span className="status-label">Status</span>
                  <span className="status-value">Active</span>
                </div>
              </div>
              <div className="status-item">
                <div className="status-icon joined">
                  <Gift size={20} />
                </div>
                <div className="status-info">
                  <span className="status-label">Joined</span>
                  <span className="status-value">Recently</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "badges" && (
          <div className="badges-section">
            <div className="section-header">
              <h3>Your Badges</h3>
              <p>Earn badges by participating in events and activities</p>
            </div>
            <div className="empty-state">
              <div className="empty-icon">
                <Award size={48} />
              </div>
              <h4>No Badges Yet</h4>
              <p>Participate in events to earn your first badge!</p>
              <button className="primary-btn" onClick={() => navigate("/events")}>
                Explore Events
              </button>
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="events-section">
            <div className="section-header">
              <h3>Your Events</h3>
              <p>Events you've attended or registered for</p>
            </div>
            <div className="empty-state">
              <div className="empty-icon">
                <Calendar size={48} />
              </div>
              <h4>No Events Yet</h4>
              <p>You haven't registered for any events yet.</p>
              <button className="primary-btn" onClick={() => navigate("/events")}>
                Browse Events
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="profile-actions">
        <button onClick={() => navigate("/")} className="secondary-btn">
          Back to Home
        </button>
      </div>
    </div>
  )
}

export default Profile
