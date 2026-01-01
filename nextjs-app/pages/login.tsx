import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { getSupabaseClient } from "../utils/supabase";
import Navbar from "../components/Navbar";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check for admin login
    if (email === "drunxxvn@gmail.com" && password === "pukig4r1T") {
      const { data, error } = await getSupabaseClient().auth.signInWithPassword({
        email: "admin@gorent.com",
        password: "admin123",
      });

      if (error) {
        setError("Admin login failed");
      } else {
        router.push("/admin");
      }
      setLoading(false);
      return;
    }

    // Regular user login
    const { data, error } = await getSupabaseClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/browse");
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Login - GO-RENT</title>
      </Head>

      <Navbar />

      <div className="form-container">
        <div className="form-card">
          <div className="form-header">
            <h1>GO-RENT</h1>
            <p>Luxury Car Rental Service</p>
          </div>

          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: "600",
              color: "#2563eb",
              marginBottom: "2rem",
            }}
          >
            Login
          </h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Example@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              Log In
            </button>
          </form>

          <div className="text-center" style={{ marginTop: "1.5rem" }}>
            <span style={{ color: "#6b7280" }}>Don't have an account? </span>
            <Link href="/signup">Create one</Link>
          </div>
        </div>
      </div>
    </>
  );
}
