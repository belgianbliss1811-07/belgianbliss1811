import AdminLayout from "../../components/admin/AdminLayout";
import { SHOP_NAME } from "../../utils/constants";

const SettingsPage = () => {
  return (
    <AdminLayout title="Settings" subtitle="Shop & system configuration">
      <div style={{ display: "grid", gap: "1.5rem", maxWidth: "640px" }}>
        {/* Shop Info */}
        <div className="admin-card">
          <h2 className="font-display" style={{ color: "var(--admin-text)", fontSize: "1.1rem", fontWeight: "700", marginBottom: "1.25rem" }}>
            🏪 Shop Information
          </h2>
          <div style={{ display: "grid", gap: "0.875rem" }}>
            {[
              { label: "Shop Name", value: SHOP_NAME },
              { label: "Total Tables", value: "5 (Table 1 – 5)" },
              { label: "Currency", value: "INR (₹)" },
              { label: "Payment Modes", value: "Cash, Online" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.03)", borderRadius: "0.75rem", border: "1px solid var(--admin-border)" }}>
                <span style={{ color: "var(--admin-muted)", fontSize: "0.85rem" }}>{label}</span>
                <span style={{ color: "var(--admin-text)", fontWeight: "600", fontSize: "0.9rem" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Info */}
        <div className="admin-card">
          <h2 className="font-display" style={{ color: "var(--admin-text)", fontSize: "1.1rem", fontWeight: "700", marginBottom: "1.25rem" }}>
            🔐 Admin Access
          </h2>
          <div style={{ display: "grid", gap: "0.875rem" }}>
            {[
              { label: "Admin Password", value: "admin123" },
              { label: "Auth Storage", value: "Browser localStorage" },
              { label: "Session", value: "Persistent until logout" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.03)", borderRadius: "0.75rem", border: "1px solid var(--admin-border)" }}>
                <span style={{ color: "var(--admin-muted)", fontSize: "0.85rem" }}>{label}</span>
                <span style={{ color: "var(--amber-light)", fontWeight: "600", fontSize: "0.88rem" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="admin-card">
          <h2 className="font-display" style={{ color: "var(--admin-text)", fontSize: "1.1rem", fontWeight: "700", marginBottom: "1.25rem" }}>
            ⚙️ Tech Stack
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {["React 19", "Vite", "Tailwind CSS v4", "Node.js", "Express", "MongoDB", "Mongoose", "Axios"].map((tech) => (
              <span key={tech} style={{ background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.2)", color: "#d97706", padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: "600" }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* API Info */}
        <div className="admin-card">
          <h2 className="font-display" style={{ color: "var(--admin-text)", fontSize: "1.1rem", fontWeight: "700", marginBottom: "1.25rem" }}>
            🔌 API Endpoints
          </h2>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {[
              "POST /api/orders",
              "GET /api/orders",
              "PATCH /api/orders/:id/status",
              "GET /api/reports/summary",
              "GET /api/billing",
              "GET /api/tables",
            ].map((ep) => (
              <div key={ep} style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "#34d399", background: "rgba(16,185,129,0.06)", padding: "0.5rem 0.875rem", borderRadius: "0.5rem", border: "1px solid rgba(16,185,129,0.15)" }}>
                {ep}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;