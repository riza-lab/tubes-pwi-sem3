import Head from "next/head";
import { useState, useEffect } from "react";
import { getSupabaseClient } from "../utils/supabase";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";

interface Booking {
  id: number;
  car_name: string;
  check_in: string;
  check_out: string;
  duration: string;
  price: string;
  total: string;
  status: string;
  created_at: string;
  profiles: {
    email: string;
    full_name: string;
  };
}

export default function Admin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pending, setPending] = useState(0);
  const [confirmed, setConfirmed] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchBookings = async () => {
      const { data, error } = await getSupabaseClient()
        .from('bookings')
        .select(`
          *,
          profiles:user_id (
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
        return;
      }

      const bookingsData = data || [];
      setBookings(bookingsData);

      const total = bookingsData.length;
      const pend = bookingsData.filter((b: Booking) => b.status === "Pending").length;
      const conf = bookingsData.filter((b: Booking) => b.status === "Confirmed").length;
      const rev = bookingsData.reduce(
        (sum: number, b: Booking) => sum + parseFloat(b.total.replace("$", "")),
        0
      );

      setTotalOrders(total);
      setPending(pend);
      setConfirmed(conf);
      setRevenue(rev);
      setLoading(false);
    };

    fetchBookings();
  }, []);

  const updateBookingStatus = async (id: number, newStatus: string) => {
    const { error } = await getSupabaseClient()
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating booking:', error);
      return;
    }

    // Update local state
    const updatedBookings = bookings.map((b) =>
      b.id === id ? { ...b, status: newStatus } : b
    );
    setBookings(updatedBookings);

    // Update stats
    if (newStatus === 'Confirmed') {
      setPending(prev => prev - 1);
      setConfirmed(prev => prev + 1);
    } else if (newStatus === 'Cancelled') {
      setPending(prev => prev - 1);
    }
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

  if (!isClient) {
    return (
      <>
        <Head>
          <title>Admin - GO-RENT</title>
        </Head>
        <Navbar />
        <main>
          <div className="container" style={{ padding: "2rem 0", textAlign: "center" }}>
            <p>Loading admin dashboard...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin - GO-RENT</title>
      </Head>

      <Navbar />

      <main>
        <div className="container" style={{ padding: "2rem 0" }}>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: "bold",
              marginBottom: "2rem",
            }}
          >
            Admin Dashboard
          </h1>

          <div className="stats-grid" style={{ marginBottom: "2rem" }}>
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p>{totalOrders}</p>
            </div>
            <div className="stat-card">
              <h3>Pending</h3>
              <p>{pending}</p>
            </div>
            <div className="stat-card">
              <h3>Confirmed</h3>
              <p>{confirmed}</p>
            </div>
            <div className="stat-card">
              <h3>Revenue</h3>
              <p>${revenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="filter-buttons" style={{ marginBottom: "2rem" }}>
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
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                        {booking.car_name}
                      </h3>
                      <p style={{ color: "#6b7280", marginBottom: "0.5rem" }}>
                        {booking.profiles?.full_name || booking.profiles?.email}
                      </p>
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
                      <div style={{ fontWeight: "600" }}>{booking.check_in}</div>
                    </div>
                    <div>
                      <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                        Check Out
                      </div>
                      <div style={{ fontWeight: "600" }}>
                        {booking.check_out}
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
                        Total
                      </div>
                      <div style={{ fontWeight: "600" }}>
                        {booking.total}
                      </div>
                    </div>
                  </div>

                  {booking.status === 'Pending' && (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => updateBookingStatus(booking.id, 'Confirmed')}
                      >
                        Confirm
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}
