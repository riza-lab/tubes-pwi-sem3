import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { cars, Car } from "../data/cars";
import Navbar from "../components/Navbar";

export default function Booking() {
  const router = useRouter();
  const { id } = router.query;
  const [car, setCar] = useState<Car | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [user, setUser] = useState({ email: "" });

  useEffect(() => {
    if (id) {
      const foundCar = cars.find((c) => c.id === parseInt(id as string));
      setCar(foundCar || null);
    }

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate || !car) {
      alert("Please select both start and end dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const pricePerDay = parseFloat(
      car.price.replace("$", "").replace("/day", "")
    );
    const total = (pricePerDay * diffDays).toFixed(2);

    const booking = {
      id: Date.now(),
      carName: `${car.brand} ${car.model}`,
      checkIn: startDate,
      checkOut: endDate,
      duration: `${diffDays} Days`,
      price: car.price,
      total: `$${total}`,
      status: "Pending",
    };

    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    alert("Booking confirmed! Confirmation email will be sent.");
    router.push("/bookings");
  };

  if (!car) {
    return (
      <>
        <Head>
          <title>Book Car - GO-RENT</title>
        </Head>
        <Navbar />
        <main>
          <div className="container" style={{ padding: "2rem 0" }}>
            <p>Car not found.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>
          Book {car.brand} {car.model} - GO-RENT
        </title>
      </Head>

      <Navbar />

      <main>
        <div className="container" style={{ padding: "2rem 0" }}>
          <Link
            href="/browse"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              marginBottom: "2rem",
              display: "inline-block",
            }}
          >
            &lt; Back To Cars
          </Link>

          <div className="booking-content">
            <div>
              <div className="booking-image">
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>

            <div className="booking-form">
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "2rem",
                }}
              >
                Book This Car
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    style={{ background: "#f9fafb" }}
                  />
                </div>

                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full">
                  Book Now
                </button>
              </form>
            </div>
          </div>

          <div className="booking-details">
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              {car.brand} {car.model}
            </h3>
            <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
              {car.description}
            </p>

            <div className="detail-grid">
              <div className="detail-item">
                <div className="label">Year</div>
                <div className="value">{car.year}</div>
              </div>
              <div className="detail-item">
                <div className="label">Seats</div>
                <div className="value">{car.seats}</div>
              </div>
              <div className="detail-item">
                <div className="label">Transmission</div>
                <div className="value">{car.gear}</div>
              </div>
              <div className="detail-item">
                <div className="label">Color</div>
                <div className="value">{car.color}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
