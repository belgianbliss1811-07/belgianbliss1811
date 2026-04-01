import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getAllOrders } from "../../services/orderService";
import { roundCurrency } from "../../utils/formatCurrency";

const statusColors = {
  Pending: "badge-pending",
  Preparing: "badge-preparing",
  Served: "badge-served",
  Paid: "badge-paid",
};

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === "Pending").length;
  const preparingOrders = orders.filter((o) => o.orderStatus === "Preparing").length;
  const totalRevenue = roundCurrency(
    orders
      .filter((o) => o.orderStatus === "Paid" || o.paymentMode === "Online")
      .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0)
  );

  const recentOrders = orders.slice(0, 8);

  const stats = [
    { label: "Total Orders", value: totalOrders, icon: "🧾", color: "#d97706" },
    { label: "Pending", value: pendingOrders, icon: "⏳", color: "#f59e0b" },
    { label: "Preparing", value: preparingOrders, icon: "👨‍🍳", color: "#3b82f6" },
    { label: "Revenue (Paid)", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: "💰", color: "#10b981" },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Live overview of Belgian Bliss">
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {stats.map((stat, i) => (
          <div key={i} className="stat-card admin-card-hover" style={{ animationDelay: `${i * 0.05}s` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "var(--admin-muted)", fontSize: "0.82rem", fontWeight: "500", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {stat.label}
                </p>
                <p
                  className="font-display"
                  style={{ color: stat.color, fontSize: "2.25rem", fontWeight: "700", marginTop: "0.5rem", lineHeight: "1" }}
                >
                  {loading ? "..." : stat.value}
                </p>
              </div>
              <span style={{ fontSize: "2rem", opacity: 0.7 }}>{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Orders Table */}
      <div className="admin-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span className="live-dot" />
            <h2
              className="font-display"
              style={{ color: "var(--admin-text)", fontSize: "1.25rem", fontWeight: "700" }}
            >
              Live Orders
            </h2>
          </div>
          <button
            onClick={fetchOrders}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--admin-border)", color: "var(--admin-muted)", padding: "0.4rem 0.9rem", borderRadius: "0.625rem", fontSize: "0.82rem", cursor: "pointer" }}
          >
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--admin-muted)" }}>Loading orders...</div>
        ) : recentOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--admin-muted)" }}>
            <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🍫</p>
            <p>No orders yet. Waiting for customers...</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  {["Order ID", "Table", "Customer", "Items", "Total", "Status", "Time"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "var(--admin-muted)", fontSize: "0.78rem", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="admin-table-row">
                    <td style={{ padding: "0.9rem 1rem", color: "var(--amber-light)", fontWeight: "600", fontSize: "0.82rem" }}>
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td style={{ padding: "0.9rem 1rem", color: "var(--admin-text)" }}>
                      Table {order.tableNumber}
                    </td>
                    <td style={{ padding: "0.9rem 1rem", color: "var(--admin-text)", fontSize: "0.88rem" }}>
                      {order.customerWhatsApp}
                    </td>
                    <td style={{ padding: "0.9rem 1rem", color: "var(--admin-muted)", fontSize: "0.85rem" }}>
                      {order.items.map((i) => i.name).join(", ").slice(0, 40)}
                      {order.items.map((i) => i.name).join(", ").length > 40 ? "..." : ""}
                    </td>
                    <td style={{ padding: "0.9rem 1rem", color: "#10b981", fontWeight: "700" }}>
                      ₹{order.totalAmount}
                    </td>
                    <td style={{ padding: "0.9rem 1rem" }}>
                      <span className={`badge ${statusColors[order.orderStatus] || "badge-pending"}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td style={{ padding: "0.9rem 1rem", color: "var(--admin-muted)", fontSize: "0.8rem" }}>
                      {new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;