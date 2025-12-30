import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { auth } from "../utils/auth";
import Navbar from "../components/Navbar";

interface Booking {
  id: number;
  carName: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  price: string;
  total: string;
  status: string;
}

export default function Bookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeBookings, setActiveBookings] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    if (!auth.isLoggedIn()) {
      router.push("/login");
      return;
    }

    const storedBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(storedBookings);
    updateStats(storedBookings);
  }, []);

  const updateStats = (bookingsList: Booking[]) => {
    const active = bookingsList.filter((b) =>
      ["Pending", "Confirmed"].includes(b.status)
    ).length;
    const completed = bookingsList.filter(
      (b) => b.status === "Completed"
    ).length;
    const total = bookingsList.reduce(
      (sum, b) => sum + parseFloat(b.total.replace("$", "")),
      0
    );

    setActiveBookings(active);
    setCompletedBookings(completed);
    setTotalSpent(total);
  };

  const cancelBooking = (id: number) => {
    const updatedBookings = bookings.map((b) =>
      b.id === id ? { ...b, status: "Cancelled" } : b
    );
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    updateStats(updatedBookings);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "#fef3c7";
      case "Confirmed":
        return "#cffafe";
      case "Completed":
        return "#f3f4f6";
      case "Cancelled":
        return "#f3f4f6";
      default:
        return "#fce7f3";
    }
  };

  const filteredBookings =
    selectedStatus === "All"
      ? bookings
      : bookings.filter((b) => b.status === selectedStatus);

  return (
    <>
      <Head>
        <title>My Bookings - GO-RENT</title>
      </Head>

      <Navbar />

      <main>
        <div className="container" style={{ padding: "2rem 0" }}>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            My Bookings
          </h1>
          <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
            View and manage your luxury car reservations
          </p>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Active Bookings</div>
              <div className="stat-value">{activeBookings}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Completed</div>
              <div className="stat-value">{completedBookings}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Spent</div>
              <div className="stat-value">${totalSpent.toFixed(2)}</div>
            </div>
          </div>

          <div className="filter-buttons">
            {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(
              (status) => (
                <button
                  key={status}
                  className={`btn btn-outline filter-btn ${
                    selectedStatus === status ? "active" : ""
                  }`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </button>
              )
            )}
          </div>

          <div>
            {filteredBookings.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "#6b7280",
                  padding: "2rem",
                }}
              >
                No bookings found.
              </p>
            ) : (
              filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="booking-card"
                  style={{ background: getStatusColor(booking.status) }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        background: "#e5e7eb",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ color: "#6b7280" }}>Image</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                        {booking.carName}
                      </h3>
                      <span
                        style={{
                          background: "rgba(255,255,255,0.5)",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "9999px",
                          fontSize: "0.875rem",
                        }}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                        Check In
                      </div>
                      <div style={{ fontWeight: "600" }}>{booking.checkIn}</div>
                    </div>
                    <div>
                      <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                        Check Out
                      </div>
                      <div style={{ fontWeight: "600" }}>
                        {booking.checkOut}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                        Duration
                      </div>
                      <div style={{ fontWeight: "600" }}>
                        {booking.duration}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                        Price per Day
                      </div>
                      <div style={{ fontWeight: "600" }}>{booking.price}</div>
                    </div>
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.2)",
                      paddingTop: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        color: "#6b7280",
                        fontSize: "0.875rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Currently in progress - Return by {booking.checkOut}
                    </div>
                    <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                      Total Price: {booking.total}
                    </div>
                  </div>

                  {booking.status === "Pending" && (
                    <button
                      className="btn"
                      style={{ background: "#dc2626", color: "white" }}
                      onClick={() => cancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          background: rgba(37, 99, 235, 0.1);
          border-radius: 0.75rem;
          padding: 1.5rem;
          text-align: center;
        }
        .stat-label {
          color: #6b7280;
          font-size: 0.875rem;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #2563eb;
        }
        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }
        .filter-btn.active {
          background-color: #2563eb;
          color: white;
        }
        .booking-card {
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </>
  );
}
