import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Username validation check (default "admin")
    if (username.trim().toLowerCase() !== "admin") {
      return toast.error("Invalid Admin Username!");
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const success = login(password);
    setLoading(false);
    if (success) {
      toast.success("Welcome back, Admin! 👋");
      navigate("/admin/dashboard");
    } else {
      toast.error("Incorrect password. Try again.");
      setPassword("");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0700 0%, #1a0e04 50%, #241608 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      {/* Background orbs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(217,119,6,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(111,78,55,0.12) 0%, transparent 70%)" }} />
      </div>

      <div className="animate-fade-in" style={{ width: "100%", maxWidth: "420px" }}>
        {/* Card */}
        <div
          style={{
            background: "rgba(36,22,8,0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "1.5rem",
            padding: "2.5rem",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "0.75rem" }}>🧇</div>
            <h1
              className="font-display"
              style={{ color: "#fbbf24", fontSize: "1.6rem", fontWeight: "700", marginBottom: "0.35rem" }}
            >
              Belgian Bliss
            </h1>
            <p style={{ color: "#9b7b60", fontSize: "0.85rem", letterSpacing: "0.1em" }}>
              ADMIN PORTAL
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", color: "#d4b896", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
                ADMIN USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username (e.g. admin)"
                required
                className="input-field-dark"
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{ display: "block", color: "#d4b896", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.5rem", letterSpacing: "0.05em" }}
              >
                ADMIN PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="input-field-dark"
                  style={{ paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#9b7b60",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.875rem",
                borderRadius: "0.875rem",
                border: "none",
                background: loading
                  ? "rgba(217,119,6,0.5)"
                  : "linear-gradient(135deg, #d97706, #b45309)",
                color: "white",
                fontSize: "1rem",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                letterSpacing: "0.03em",
                boxShadow: "0 4px 15px rgba(217,119,6,0.3)",
              }}
            >
              {loading ? "Verifying..." : "🔐 Login to Admin"}
            </button>
          </form>

          <p style={{ textAlign: "center", color: "#5a3e2b", fontSize: "0.78rem", marginTop: "1.5rem" }}>
            Belgian Bliss Dessert Bowl & Waffle
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;