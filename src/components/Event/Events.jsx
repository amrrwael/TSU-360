"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import "./Events.css"

const Events = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attendingStatus, setAttendingStatus] = useState({})
  const [attendingMessage, setAttendingMessage] = useState({})

  // Add a function to handle attending an event
  const handleAttendEvent = async (eventId, eventTitle) => {
    if (!isAuthenticated) {
      setError("You must be logged in to attend events")
      return
    }

    try {
      // Set the status to loading for this specific event
      setAttendingStatus((prev) => ({
        ...prev,
        [eventId]: "loading",
      }))

      const token = localStorage.getItem("authToken")
      const response = await fetch(`https://localhost:7221/api/Event/${eventId}/attend`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to register for event")
      }

      const data = await response.json()

      // Update the status and message for this specific event
      setAttendingStatus((prev) => ({
        ...prev,
        [eventId]: "success",
      }))

      setAttendingMessage((prev) => ({
        ...prev,
        [eventId]: `You've successfully requested to attend "${eventTitle}". Please wait for approval from a Curator or Volunteer.`,
      }))

      // After 5 seconds, clear the success status but keep the message
      setTimeout(() => {
        setAttendingStatus((prev) => ({
          ...prev,
          [eventId]: "pending",
        }))
      }, 5000)
    } catch (err) {
      console.error("Error attending event:", err)
      setAttendingStatus((prev) => ({
        ...prev,
        [eventId]: "error",
      }))
      setAttendingMessage((prev) => ({
        ...prev,
        [eventId]: `Error: ${err.message}`,
      }))
    }
  }

  // Navigate to event details
  const handleViewEventDetails = (eventId) => {
    navigate(`/events/${eventId}`) // Changed from /Event/ to /events/
  }

  useEffect(() => {
    const fetchEvents = async () => {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }

      try {
        const token = localStorage.getItem("authToken")
        const response = await fetch("https://localhost:7221/api/Event", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }

        const data = await response.json()
        setEvents(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching events:", err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchEvents()
  }, [isAuthenticated])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) return <div className="events-loading">Loading events...</div>

  if (!isAuthenticated) {
    return (
      <div className="events-auth-required">
        <h2>Authentication Required</h2>
        <p>Please log in to view events.</p>
        <button className="primary-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="events-error">
        <h2>Error Loading Events</h2>
        <p>{error}</p>
        <button className="primary-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="events-container">
      <div className="events-header">
        <h2>Upcoming Events</h2>
        <button className="back-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>

      {events.length === 0 ? (
        <p className="no-events">No events available at this time.</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                {event.imageUrl && event.imageUrl !== "string" ? (
                  <img src={event.imageUrl || "/placeholder.svg"} alt={event.title} />
                ) : (
                  <div className="placeholder-image">
                    <span>{event.title.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="event-content">
                <h3>{event.title}</h3>
                <p className="event-description">
                  {event.description !== "string" ? event.description : "No description available"}
                </p>
                <div className="event-details">
                  <p>
                    <strong>Location:</strong> {event.location !== "string" ? event.location : "TBA"}
                  </p>
                  <p>
                    <strong>Start:</strong> {formatDate(event.startDate)}
                  </p>
                  <p>
                    <strong>End:</strong> {formatDate(event.endDate)}
                  </p>
                  <p>
                    <strong>Created by:</strong> {event.createdBy}
                  </p>
                </div>

                {/* Attendance status message */}
                {attendingMessage[event.id] && (
                  <div className={`attendance-message ${attendingStatus[event.id]}`}>{attendingMessage[event.id]}</div>
                )}

                <div className="event-actions">
                  <button
                    className={`event-btn attend-btn ${attendingStatus[event.id] ? attendingStatus[event.id] : ""}`}
                    onClick={() => handleAttendEvent(event.id, event.title)}
                    disabled={
                      attendingStatus[event.id] === "loading" ||
                      attendingStatus[event.id] === "success" ||
                      attendingStatus[event.id] === "pending"
                    }
                  >
                    {attendingStatus[event.id] === "loading" ? (
                      <>
                        <span className="btn-spinner"></span>
                        Processing...
                      </>
                    ) : attendingStatus[event.id] === "success" ? (
                      "Request Sent!"
                    ) : attendingStatus[event.id] === "pending" ? (
                      "Awaiting Approval"
                    ) : (
                      "Attend Event"
                    )}
                  </button>
                  <button className="event-btn secondary" onClick={() => handleViewEventDetails(event.id)}>
                    Event Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Events
