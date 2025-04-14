"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import "./EventDetails.css"
import { Calendar, MapPin, Clock, User, Users, CheckCircle, XCircle, AlertCircle } from "lucide-react"

// Enum for attendance status
const AttendanceStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
  Attended: 3,
  NoShow: 4,
}

// Event status
const EventStatus = {
  Upcoming: 0,
  Ongoing: 1,
  Completed: 2,
  Cancelled: 3,
}

// Status labels and colors
const statusConfig = {
  [AttendanceStatus.Pending]: { label: "Pending", color: "#f59e0b", bgColor: "rgba(245, 158, 11, 0.1)" },
  [AttendanceStatus.Approved]: { label: "Approved", color: "#10b981", bgColor: "rgba(16, 185, 129, 0.1)" },
  [AttendanceStatus.Rejected]: { label: "Rejected", color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.1)" },
  [AttendanceStatus.Attended]: { label: "Attended", color: "#3b82f6", bgColor: "rgba(59, 130, 246, 0.1)" },
  [AttendanceStatus.NoShow]: { label: "No Show", color: "#6b7280", bgColor: "rgba(107, 114, 128, 0.1)" },
}

const eventStatusConfig = {
  [EventStatus.Upcoming]: { label: "Upcoming", color: "#3b82f6", bgColor: "rgba(59, 130, 246, 0.1)" },
  [EventStatus.Ongoing]: { label: "Ongoing", color: "#10b981", bgColor: "rgba(16, 185, 129, 0.1)" },
  [EventStatus.Completed]: { label: "Completed", color: "#6b7280", bgColor: "rgba(107, 114, 128, 0.1)" },
  [EventStatus.Cancelled]: { label: "Cancelled", color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.1)" },
}

const EventDetails = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, userData } = useAuth()
  const [event, setEvent] = useState(null)
  const [attendances, setAttendances] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusUpdating, setStatusUpdating] = useState({})
  const [userRole, setUserRole] = useState("attendee") // Default role

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!isAuthenticated || !eventId) {
        setLoading(false)
        return
      }

      try {
        const token = localStorage.getItem("authToken")
        const response = await fetch(`https://localhost:7221/api/Event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch event details")
        }

        const data = await response.json()
        console.log("Event details:", data) // Log the event details
        setEvent(data)

        // Determine user role (simplified - in a real app, you'd get this from auth context)
        // For now, let's assume if the user is the creator, they're a curator
        if (userData && data.createdById === userData.id) {
          setUserRole("curator")
        }

        // Fetch attendances after getting event details
        fetchAttendances(token)
      } catch (err) {
        console.error("Error fetching event details:", err)
        setError(err.message)
        setLoading(false)
      }
    }

    const fetchAttendances = async (token) => {
      try {
        const response = await fetch(`https://localhost:7221/api/Event/${eventId}/attendances`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch attendances")
        }

        const data = await response.json()
        console.log("Attendances:", data) // Log the attendances
        setAttendances(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching attendances:", err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchEventDetails()
  }, [eventId, isAuthenticated, userData])

  // Update attendance status
  const updateAttendanceStatus = async (attendanceId, newStatus) => {
    if (!isAuthenticated) return

    setStatusUpdating((prev) => ({ ...prev, [attendanceId]: true }))

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`https://localhost:7221/api/Event/attendance/${attendanceId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStatus),
      })

      if (!response.ok) {
        throw new Error("Failed to update attendance status")
      }

      // Update the local state with the new status
      setAttendances((prev) =>
        prev.map((attendance) =>
          attendance.id === attendanceId
            ? {
                ...attendance,
                status: newStatus,
                processedAt: new Date().toISOString(),
                processedByName: userData?.email || "Current User",
              }
            : attendance,
        ),
      )
    } catch (err) {
      console.error("Error updating attendance status:", err)
      setError(err.message)
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [attendanceId]: false }))
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) return <div className="event-details-loading">Loading event details...</div>

  if (!isAuthenticated) {
    return (
      <div className="event-details-auth-required">
        <h2>Authentication Required</h2>
        <p>Please log in to view event details.</p>
        <button className="primary-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="event-details-error">
        <h2>Error Loading Event</h2>
        <p>{error}</p>
        <button className="primary-btn" onClick={() => navigate("/events")}>
          Back to Events
        </button>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="event-details-error">
        <h2>Event Not Found</h2>
        <p>The event you're looking for doesn't exist or has been removed.</p>
        <button className="primary-btn" onClick={() => navigate("/events")}>
          Back to Events
        </button>
      </div>
    )
  }

  // Get creator name
  const creatorName = event.createdBy && event.createdBy !== "string" ? event.createdBy : "Event Organizer"

  return (
    <div className="event-details-container">
      <div className="event-details-header">
        <button className="back-btn" onClick={() => navigate("/events")}>
          Back to Events
        </button>
        <h1>{event.title}</h1>
        <div
          className="event-status-badge"
          style={{
            backgroundColor: eventStatusConfig[event.status].bgColor,
            color: eventStatusConfig[event.status].color,
          }}
        >
          {eventStatusConfig[event.status].label}
        </div>
      </div>

      <div className="event-details-content">
        <div className="event-info-section">
          <div className="event-banner">
            {event.imageUrl && event.imageUrl !== "string" ? (
              <img src={event.imageUrl || "/placeholder.svg"} alt={event.title} />
            ) : (
              <div className="placeholder-banner">
                <span>{event.title.charAt(0)}</span>
              </div>
            )}
          </div>

          <div className="event-info-card">
            <h2>Event Information</h2>
            <div className="event-info-content">
              <div className="info-item">
                <Calendar size={20} />
                <div>
                  <span className="info-label">Date</span>
                  <span className="info-value">{formatDate(event.startDate).split(" ")[0]}</span>
                </div>
              </div>

              <div className="info-item">
                <Clock size={20} />
                <div>
                  <span className="info-label">Time</span>
                  <span className="info-value">
                    {formatDate(event.startDate).split(" ")[1]} - {formatDate(event.endDate).split(" ")[1]}
                  </span>
                </div>
              </div>

              <div className="info-item">
                <MapPin size={20} />
                <div>
                  <span className="info-label">Location</span>
                  <span className="info-value">{event.location !== "string" ? event.location : "To be announced"}</span>
                </div>
              </div>

              <div className="info-item">
                <User size={20} />
                <div>
                  <span className="info-label">Organized by</span>
                  <span className="info-value">{creatorName}</span>
                </div>
              </div>
            </div>

            <div className="event-description-section">
              <h3>About This Event</h3>
              <p>{event.description !== "string" ? event.description : "No description available for this event."}</p>
            </div>
          </div>
        </div>

        <div className="attendees-section">
          <div className="attendees-header">
            <h2>
              <Users size={20} /> Attendees
            </h2>
            <div className="attendees-count">
              <span className="approved-count">
                {attendances.filter((a) => a.status === AttendanceStatus.Approved).length} Approved
              </span>
              <span className="pending-count">
                {attendances.filter((a) => a.status === AttendanceStatus.Pending).length} Pending
              </span>
            </div>
          </div>

          {attendances.length === 0 ? (
            <div className="no-attendees">
              <p>No one has registered for this event yet.</p>
            </div>
          ) : (
            <div className="attendees-list">
              <div className="attendees-table-header">
                <div className="attendee-name-col">Name</div>
                <div className="attendee-status-col">Status</div>
                <div className="attendee-requested-col">Requested</div>
                <div className="attendee-processed-col">Processed</div>
                {(userRole === "curator" || userRole === "volunteer") && (
                  <div className="attendee-actions-col">Actions</div>
                )}
              </div>

              {attendances.map((attendance) => (
                <div key={attendance.id} className="attendee-row">
                  <div className="attendee-name-col">
                    {attendance.userName !== "string" ? attendance.userName : "Anonymous User"}
                  </div>
                  <div className="attendee-status-col">
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: statusConfig[attendance.status].bgColor,
                        color: statusConfig[attendance.status].color,
                      }}
                    >
                      {statusConfig[attendance.status].label}
                    </span>
                  </div>
                  <div className="attendee-requested-col">{formatDate(attendance.requestedAt)}</div>
                  <div className="attendee-processed-col">
                    {attendance.processedAt ? formatDate(attendance.processedAt) : "Not processed"}
                  </div>

                  {(userRole === "curator" || userRole === "volunteer") && (
                    <div className="attendee-actions-col">
                      {attendance.status === AttendanceStatus.Pending ? (
                        <div className="action-buttons">
                          <button
                            className="action-btn approve"
                            onClick={() => updateAttendanceStatus(attendance.id, AttendanceStatus.Approved)}
                            disabled={statusUpdating[attendance.id]}
                          >
                            {statusUpdating[attendance.id] ? (
                              <span className="btn-spinner"></span>
                            ) : (
                              <CheckCircle size={16} />
                            )}
                            Approve
                          </button>
                          <button
                            className="action-btn reject"
                            onClick={() => updateAttendanceStatus(attendance.id, AttendanceStatus.Rejected)}
                            disabled={statusUpdating[attendance.id]}
                          >
                            {statusUpdating[attendance.id] ? (
                              <span className="btn-spinner"></span>
                            ) : (
                              <XCircle size={16} />
                            )}
                            Reject
                          </button>
                        </div>
                      ) : attendance.status === AttendanceStatus.Approved ? (
                        <div className="action-buttons">
                          <button
                            className="action-btn attended"
                            onClick={() => updateAttendanceStatus(attendance.id, AttendanceStatus.Attended)}
                            disabled={statusUpdating[attendance.id]}
                          >
                            {statusUpdating[attendance.id] ? (
                              <span className="btn-spinner"></span>
                            ) : (
                              <CheckCircle size={16} />
                            )}
                            Mark Attended
                          </button>
                          <button
                            className="action-btn no-show"
                            onClick={() => updateAttendanceStatus(attendance.id, AttendanceStatus.NoShow)}
                            disabled={statusUpdating[attendance.id]}
                          >
                            {statusUpdating[attendance.id] ? (
                              <span className="btn-spinner"></span>
                            ) : (
                              <AlertCircle size={16} />
                            )}
                            No Show
                          </button>
                        </div>
                      ) : (
                        <div className="status-message">
                          {attendance.status === AttendanceStatus.Rejected
                            ? "Rejected"
                            : attendance.status === AttendanceStatus.Attended
                              ? "Marked as Attended"
                              : "Marked as No Show"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventDetails
