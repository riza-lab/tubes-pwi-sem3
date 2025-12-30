import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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

export default function Admin() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pending, setPending] = useState(0);
  const [accepted, setAccepted] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser");
    if (!adminUser) {
      router.push("/admin-login");
      return;
    }

    const storedBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(storedBookings);

    const total = storedBookings.length;
    const pend = storedBookings.filter(
      (b: Booking) => b.status === "Pending"
    ).length;
    const acc = storedBookings.filter(
      (b: Booking) => b.status === "Confirmed"
    ).length;
    const rev = storedBookings.reduce(
      (sum: number, b: Booking) => sum + parseFloat(b.total.replace("$", "")),
      0
    );

    setTotalOrders(total);
    setPending(pend);
    setAccepted(acc);
    setRevenue(rev);
  }, []);

  const logoutAdmin = () => {
    localStorage.removeItem("adminUser");
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard - GO-RENT</title>
      </Head>

      <header style={{ background: "#1e40af", color: "white" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.5rem 0",
            }}
          >
            <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>
              GO-RENT Admin
            </h1>
            <button
              className="btn"
              style={{
                background: "transparent",
                border: "1px solid white",
                color: "white",
              }}
              onClick={logoutAdmin}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="container" style={{ padding: "2rem 0" }}>
          <h2
            style={{
              fontSize: "2.25rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Order Management
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
            Review and manage car rental bookings
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                background: "#dbeafe",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                textAlign: "center",
              }}
            >
              <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                Total Orders
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#1e40af",
                }}
              >
                {totalOrders}
              </div>
            </div>
            <div
              style={{
                background: "#dbeafe",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                textAlign: "center",
              }}
            >
              <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                Pending
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#1e40af",
                }}
              >
                {pending}
              </div>
            </div>
            <div
              style={{
                background: "#dbeafe",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                textAlign: "center",
              }}
            >
              <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                Accepted
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#1e40af",
                }}
              >
                {accepted}
              </div>
            </div>
            <div
              style={{
                background: "#dbeafe",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                textAlign: "center",
              }}
            >
              <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                Revenue
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#1e40af",
                }}
              >
                ${revenue.toFixed(2)}
              </div>
            </div>
          </div>

          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.75rem",
              padding: "2rem",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Recent Orders
            </h3>
            {bookings.length === 0 ? (
              <p style={{ color: "#6b7280" }}>
                No orders to display. This is a demo admin panel.
              </p>
            ) : (
              <div>
                {bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                      padding: "1rem 0",
                    }}
                  >
                    <div style={{ fontWeight: "600" }}>{booking.carName}</div>
                    <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                      {booking.checkIn} - {booking.checkOut} | {booking.status}{" "}
                      | {booking.total}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
