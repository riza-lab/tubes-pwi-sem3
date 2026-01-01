import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "drunxxvn@gmail.com" && password === "pukig4r1T") {
      localStorage.setItem(
        "adminUser",
        JSON.stringify({ email, role: "admin" })
      );
      router.push("/admin");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - GO-RENT</title>
      </Head>

      <div className="form-container">
        <div className="form-card">
          <div className="form-header">
            <h1>GO-RENT</h1>
            <p>Admin Panel</p>
          </div>

          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: "600",
              color: "#2563eb",
              marginBottom: "2rem",
            }}
          >
            Admin Login
          </h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
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
        </div>
      </div>
    </>
  );
}
