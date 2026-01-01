import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getCarById, Car } from "../data/cars";
import { getSupabaseClient } from "../utils/supabase";
import Navbar from "../components/Navbar";

export default function Booking() {
  const router = useRouter();
  const { id } = router.query;
  const [car, setCar] = useState<Car | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchCar = async () => {
      if (id) {
        const foundCar = await getCarById(parseInt(id as string));
        setCar(foundCar);
      }
    };

    fetchCar();
  }, [id]);

  // Calculate total price dynamically
  const calculateTotal = () => {
    if (!startDate || !endDate || !car) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const pricePerDay = parseFloat(
      car.price.replace("$", "").replace("/day", "")
    );
    const total = (pricePerDay * diffDays).toFixed(2);

    return {
      days: diffDays,
      total: `$${total}`,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate || !car) {
      alert("Please select both start and end dates.");
      return;
    }

    const totalCalc = calculateTotal();
    if (!totalCalc) return;

    const { data: { user } } = await getSupabaseClient().auth.getUser();

    if (!user) {
      alert("Please log in to make a booking.");
      router.push("/login");
      return;
    }

    const booking = {
      user_id: user.id,
      car_id: car.id,
      car_name: `${car.brand} ${car.model}`,
      check_in: startDate,
      check_out: endDate,
      duration: `${totalCalc.days} Days`,
      price: car.price,
      total: totalCalc.total,
      status: "Pending",
    };

    const { error } = await getSupabaseClient()
      .from('bookings')
      .insert([booking]);

    if (error) {
      console.error('Error creating booking:', error);
      alert("Failed to create booking. Please try again.");
      return;
    }

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

  const total = calculateTotal();

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

              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#16a6a3",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                {car.price}
              </div>

              <form onSubmit={handleSubmit}>
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

                {/* Show Total Price Below End Date */}
                {total && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "1rem",
                      backgroundColor: "#f9fafb",
                      borderRadius: "8px",
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: "1.1rem",
                    }}
                  >
                    Total: {total.total} ({total.days} days)
                  </div>
                )}

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
