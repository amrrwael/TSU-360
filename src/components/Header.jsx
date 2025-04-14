import { useState } from "react"
import { useAuth } from "./auth/AuthContext"
import "./Header.css"
import Logo from "../assets/Logo.png"
import AuthModal from "./auth/AuthModal"
import { useNavigate } from "react-router-dom"

const Header = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState("login")
  const { isAuthenticated, userData, login, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <>
      <header className="header">
        <div className="Whole">
          <div className="left-side">
            <div className="logo" onClick={() => navigate("/")} role="button" tabIndex={0}>
              <img src={Logo || "/placeholder.svg"} alt="TSU Campus" />
              <h1>TSU 360</h1>
            </div>
          </div>

          <div className="right-side">
            {!isAuthenticated ? (
              <>
                <button
                  className="auth-btn signup-btn"
                  onClick={() => {
                    setAuthMode("signup")
                    setAuthModalOpen(true)
                  }}
                >
                  Sign Up
                </button>
                <button
                  className="auth-btn login-btn"
                  onClick={() => {
                    setAuthMode("login")
                    setAuthModalOpen(true)
                  }}
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                <button class="auth-btn Btn" onClick={logout}>
                  <div class="sign">
                    <svg viewBox="0 0 512 512">
                      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                    </svg>
                  </div>

                  <div class="text">Logout</div>
                </button>
                <button className="profile-btn" onClick={() => navigate("/profile")}>
                  <span className="profile-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="18"
                      height="18"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="profile-text">My Profile</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {authModalOpen && <AuthModal mode={authMode} onClose={() => setAuthModalOpen(false)} onAuthSuccess={login} />}
    </>
  )
}

export default Header
