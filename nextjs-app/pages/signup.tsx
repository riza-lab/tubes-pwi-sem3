import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { getSupabaseClient } from "../utils/supabase";
import Navbar from "../components/Navbar";

export default function Signup() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { data, error } = await getSupabaseClient().auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      alert("Account created successfully! Please check your email to confirm your account.");
      router.push("/login");
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Sign Up - GO-RENT</title>
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
            Create Account
          </h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Fullname"
                required
              />
            </div>

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

            <div className="form-group">
              <label>Repeat Password</label>
              <input
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                placeholder="Repeat Password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              Create Account
            </button>
          </form>

          <div className="text-center" style={{ marginTop: "1.5rem" }}>
            <span style={{ color: "#6b7280" }}>Already have an account? </span>
            <Link href="/login">Log in</Link>
          </div>
        </div>
      </div>
    </>
  );
}
