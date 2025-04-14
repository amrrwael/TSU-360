"use client"

import { useState } from "react"
import "./AuthModal.css"
import {
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Lock,
  Calendar,
  BookOpen,
  Award,
  Clock,
} from "lucide-react"

const AuthModal = ({ mode, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(mode === "login")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    birthday: "",
    faculty: 0,
    year: 1,
    degree: 0,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const faculties = ["SoftwareEngineering", "Science", "Engineering", "Medicine", "Arts", "Business", "Law", "Other"]

  const degrees = ["Bachelor", "Master", "PhD"]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "faculty" || name === "degree" || name === "year" ? Number.parseInt(value) : value,
    }))

    // Calculate password strength
    if (name === "password") {
      let strength = 0
      if (value.length >= 8) strength += 1
      if (/[A-Z]/.test(value)) strength += 1
      if (/[0-9]/.test(value)) strength += 1
      if (/[^A-Za-z0-9]/.test(value)) strength += 1
      setPasswordStrength(strength)
    }
  }

  const validateStep1 = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields")
      return false
    }
    if (!isLogin && (!formData.firstName || !formData.lastName)) {
      setError("Please fill in all required fields")
      return false
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }
    return true
  }

  const nextStep = () => {
    if (validateStep1()) {
      setError("")
      setStep(2)
    }
  }

  const prevStep = () => {
    setStep(1)
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const url = isLogin ? "https://localhost:7221/api/Auth/login" : "https://localhost:7221/api/Auth/register"

      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            ...formData,
            faculty: faculties[formData.faculty],
            degree: degrees[formData.degree],
            // Remove time portion from date
            birthday: formData.birthday ? new Date(formData.birthday).toISOString() : null,
          }

      console.log("Sending payload:", payload)

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.title || errorData.message || "Authentication failed")
      }

      const data = await response.json()
      onAuthSuccess(data)
      onClose()
    } catch (err) {
      setError(err.message)
      console.error("Authentication error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        <div className="auth-header">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p>{isLogin ? "Log in to continue" : "Join our community"}</p>
        </div>

        {error && (
          <div className="error-message">
            <XCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {!isLogin && (
          <div className="signup-progress">
            <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
              <div className="step-number">1</div>
              <span className="step-label">Account</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
              <div className="step-number">2</div>
              <span className="step-label">Details</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isLogin ? (
            // Login Form
            <>
              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={16} />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <Lock size={16} />
                  <span>Password</span>
                </label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </>
          ) : // Sign Up Form - Step 1
          step === 1 ? (
            <>
              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={16} />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">
                    <User size={16} />
                    <span>First Name</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">
                    <User size={16} />
                    <span>Last Name</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <Lock size={16} />
                  <span>Password</span>
                </label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    required
                    minLength="8"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="password-strength">
                  <div className="strength-bars">
                    <div className={`strength-bar ${passwordStrength >= 1 ? "active" : ""}`}></div>
                    <div className={`strength-bar ${passwordStrength >= 2 ? "active" : ""}`}></div>
                    <div className={`strength-bar ${passwordStrength >= 3 ? "active" : ""}`}></div>
                    <div className={`strength-bar ${passwordStrength >= 4 ? "active" : ""}`}></div>
                  </div>
                  <span className="strength-text">
                    {passwordStrength === 0
                      ? "Enter password"
                      : passwordStrength === 1
                        ? "Weak"
                        : passwordStrength === 2
                          ? "Fair"
                          : passwordStrength === 3
                            ? "Good"
                            : "Strong"}
                  </span>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="next-btn" onClick={nextStep}>
                  Continue
                  <ArrowRight size={16} />
                </button>
              </div>
            </>
          ) : (
            // Sign Up Form - Step 2
            <>
              <div className="form-group">
                <label htmlFor="birthday">
                  <Calendar size={16} />
                  <span>Date of Birth</span>
                </label>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="faculty">
                  <BookOpen size={16} />
                  <span>Faculty</span>
                </label>
                <select id="faculty" name="faculty" value={formData.faculty} onChange={handleChange} required>
                  {faculties.map((faculty, index) => (
                    <option key={faculty} value={index}>
                      {faculty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="degree">
                    <Award size={16} />
                    <span>Degree</span>
                  </label>
                  <select id="degree" name="degree" value={formData.degree} onChange={handleChange} required>
                    {degrees.map((degree, index) => (
                      <option key={degree} value={index}>
                        {degree}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="year">
                    <Clock size={16} />
                    <span>Year of Study</span>
                  </label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    min="1"
                    max="5"
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="back-btn" onClick={prevStep}>
                  Back
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              className="switch-btn"
              onClick={() => {
                setIsLogin(!isLogin)
                setStep(1)
                setError("")
              }}
            >
              {isLogin ? " Sign up" : " Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
