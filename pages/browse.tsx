import Head from "next/head";
import Link from "next/link";
import { cars } from "../data/cars";
import Navbar from "../components/Navbar";

export default function Browse() {
  return (
    <>
      <Head>
        <title>Browse Cars - GO-RENT</title>
        <meta
          name="description"
          content="Choose from our premium collection of luxury vehicles"
        />
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
            Browse Luxury Cars
          </h1>
          <p style={{ color: "#6b7280", marginBottom: "3rem" }}>
            Choose from our premium collection of luxury vehicles
          </p>

          <div className="cars-grid">
            {cars.map((car) => (
              <div key={car.id} className="car-card">
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  className="car-image"
                />
                <div className="car-info">
                  <h3>
                    {car.brand} {car.model}
                  </h3>
                  <p className="car-type">{car.type}</p>
                  <div className="car-details">
                    <span>{car.year}</span>
                    <span>{car.seats} seats</span>
                    <span>{car.gear}</span>
                  </div>
                  <p className="car-description">{car.description}</p>
                  <div className="car-footer">
                    <span className="car-price">{car.price}</span>
                    <Link
                      href={`/booking?id=${car.id}`}
                      className="btn btn-primary"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
