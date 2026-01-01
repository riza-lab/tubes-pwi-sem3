import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Head>
        <title>GO-RENT - Luxury Car Rental</title>
        <meta
          name="description"
          content="Rent premium luxury vehicles for your next adventure"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main>
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1>Experience Luxury on the Road</h1>
              <p>
                Rent premium luxury vehicles for your next adventure. From sleek
                sedans to powerful SUVs, we have perfect car for every occasion.
              </p>
              <Link href="/browse" className="btn btn-primary">
                Browse Cars
              </Link>
            </div>
            <div className="hero-image">
              <img
                src="/images_for_v0/porsche_gt3rs.jpg"
                alt="Porsche GT3RS"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h2>Why Choose GO-RENT</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Premium Selection</h3>
                <p>Hand-picked luxury vehicles from the world's best brands</p>
              </div>
              <div className="feature-card">
                <h3>Easy Booking</h3>
                <p>Simple, secure, and hassle-free reservation process</p>
              </div>
              <div className="feature-card">
                <h3>24/7 Support</h3>
                <p>Round-the-clock customer service for your peace of mind</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
