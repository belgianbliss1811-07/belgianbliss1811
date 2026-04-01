import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getAllInvoices, sendInvoiceViaWhatsApp } from "../../services/billingService";
import { formatCurrency } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

const BillingPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState(null);

  const fetchInvoices = useCallback(async () => {
    try {
      const res = await getAllInvoices();
      setInvoices(res.data || []);
    } catch {
      toast.error("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSendWhatsApp = async (invoiceId) => {
    setSendingId(invoiceId);
    try {
      await sendInvoiceViaWhatsApp(invoiceId);
      toast.success("Invoice sent via WhatsApp ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send invoice");
    } finally {
      setSendingId(null);
    }
  };

  useEffect(() => {
    fetchInvoices();
    const interval = setInterval(fetchInvoices, 30000);
    return () => clearInterval(interval);
  }, [fetchInvoices]);

  const totalRevenue = invoices.reduce((s, inv) => s + inv.totalAmount, 0);
  const cashTotal = invoices.filter((i) => i.paymentMode === "Cash").reduce((s, i) => s + i.totalAmount, 0);
  const onlineTotal = invoices.filter((i) => i.paymentMode === "Online").reduce((s, i) => s + i.totalAmount, 0);

  return (
    <AdminLayout title="Billing" subtitle="All paid invoices and revenue">
      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: "💰", color: "#10b981" },
          { label: "Total Invoices", value: invoices.length, icon: "🧾", color: "#d97706" },
          { label: "Cash Collected", value: formatCurrency(cashTotal), icon: "💵", color: "#f59e0b" },
          { label: "Online Collected", value: formatCurrency(onlineTotal), icon: "📲", color: "#6366f1" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "var(--admin-muted)", fontSize: "0.78rem", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {s.label}
                </p>
                <p className="font-display" style={{ color: s.color, fontSize: "2rem", fontWeight: "700", marginTop: "0.5rem" }}>
                  {loading ? "..." : s.value}
                </p>
              </div>
              <span style={{ fontSize: "1.75rem", opacity: 0.7 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Invoice List */}
      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 className="font-display" style={{ color: "var(--admin-text)", fontSize: "1.2rem", fontWeight: "700" }}>
            All Invoices
          </h2>
          <button onClick={fetchInvoices} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--admin-border)", color: "var(--admin-muted)", padding: "0.4rem 0.9rem", borderRadius: "0.625rem", fontSize: "0.82rem", cursor: "pointer" }}>
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--admin-muted)" }}>Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💳</p>
            <p style={{ color: "var(--admin-muted)" }}>No paid orders yet. Mark orders as Paid to generate invoices.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "0.875rem" }}>
            {invoices.map((inv) => (
              <div
                key={inv._id}
                className="admin-card-hover"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--admin-border)", borderRadius: "1rem", padding: "1.25rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
                    <span style={{ color: "var(--amber-light)", fontWeight: "700", fontSize: "0.85rem" }}>
                      INV-{inv._id.slice(-6).toUpperCase()}
                    </span>
                    <span style={{ padding: "0.15rem 0.6rem", borderRadius: "999px", background: inv.paymentMode === "Cash" ? "rgba(245,158,11,0.12)" : "rgba(99,102,241,0.12)", color: inv.paymentMode === "Cash" ? "#f59e0b" : "#818cf8", border: `1px solid ${inv.paymentMode === "Cash" ? "rgba(245,158,11,0.3)" : "rgba(99,102,241,0.3)"}`, fontSize: "0.75rem", fontWeight: "600" }}>
                      {inv.paymentMode}
                    </span>
                  </div>
                  <p style={{ color: "var(--admin-text)", fontWeight: "600" }}>Table {inv.tableNumber}</p>
                  <p style={{ color: "var(--admin-muted)", fontSize: "0.82rem", marginTop: "0.15rem" }}>
                    📱 {inv.customerWhatsApp} · {inv.items.length} items
                  </p>
                  <p style={{ color: "var(--admin-muted)", fontSize: "0.78rem", marginTop: "0.1rem" }}>
                    🕐 {new Date(inv.paidAt).toLocaleString("en-IN")}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "#10b981", fontWeight: "800", fontSize: "1.5rem" }}>
                    {formatCurrency(inv.totalAmount)}
                  </p>
                  <p style={{ color: "var(--admin-muted)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                    {inv.items.map((i) => i.name).join(", ").slice(0, 35)}...
                  </p>
                  <button
                    onClick={() => handleSendWhatsApp(inv._id)}
                    disabled={sendingId === inv._id}
                    style={{
                      marginTop: "0.75rem",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(34,197,94,0.3)",
                      background: "rgba(34,197,94,0.1)",
                      color: "#16a34a",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      fontWeight: "600",
                      opacity: sendingId === inv._id ? 0.6 : 1,
                    }}
                  >
                    {sendingId === inv._id ? "📤 Sending..." : "📱 Send WhatsApp"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BillingPage;