import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTables = useCallback(async () => {
    try {
      const { data: tablesData, error: tablesError } = await supabase.from('tables').select('*');
      if (tablesError) throw tablesError;
      const { data: ordersData } = await supabase.from('orders').select('*').neq('status', 'Paid');

      const formattedTables = (tablesData || []).map(t => {
        const activeOrder = (ordersData || []).find(o => o.table_number === String(t.table_number));
        return {
          tableNumber: t.table_number,
          isOccupied: !!activeOrder,
          orderStatus: activeOrder ? activeOrder.status : null,
          totalAmount: activeOrder ? activeOrder.total : null,
        };
      });
      formattedTables.sort((a, b) => parseInt(a.tableNumber) - parseInt(b.tableNumber));
      setTables(formattedTables);
    } catch {
      toast.error("Failed to fetch table status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 20000);
    return () => clearInterval(interval);
  }, [fetchTables]);

  const occupied = tables.filter((t) => t.isOccupied).length;
  const free = tables.filter((t) => !t.isOccupied).length;

  const statusColorMap = {
    Pending: { text: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
    Preparing: { text: "#3b82f6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)" },
    Served: { text: "#22c55e", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)" },
    free: { text: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
  };

  return (
    <AdminLayout title="Tables" subtitle={`${occupied} occupied · ${free} free · Auto-refreshes every 20s`}>
      {/* Summary */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
        <div className="stat-card" style={{ flex: "1", minWidth: "160px" }}>
          <p style={{ color: "var(--admin-muted)", fontSize: "0.78rem", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase" }}>Occupied</p>
          <p className="font-display" style={{ color: "#f59e0b", fontSize: "2.5rem", fontWeight: "800", marginTop: "0.35rem" }}>{occupied}</p>
        </div>
        <div className="stat-card" style={{ flex: "1", minWidth: "160px" }}>
          <p style={{ color: "var(--admin-muted)", fontSize: "0.78rem", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase" }}>Available</p>
          <p className="font-display" style={{ color: "#10b981", fontSize: "2.5rem", fontWeight: "800", marginTop: "0.35rem" }}>{free}</p>
        </div>
        <button
          onClick={fetchTables}
          style={{ alignSelf: "center", padding: "0.6rem 1.1rem", borderRadius: "0.625rem", border: "1px solid var(--admin-border)", background: "rgba(255,255,255,0.04)", color: "var(--admin-muted)", fontSize: "0.85rem", cursor: "pointer" }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Table Cards */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--admin-muted)" }}>Loading table status...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
          {tables.map((table) => {
            const sc = table.isOccupied ? (statusColorMap[table.orderStatus] || statusColorMap.Pending) : statusColorMap.free;
            return (
              <div
                key={table.tableNumber}
                className="admin-card admin-card-hover"
                style={{ border: `1px solid ${sc.border}`, background: sc.bg, position: "relative", overflow: "hidden" }}
              >
                {/* Status indicator */}
                {table.isOccupied && (
                  <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
                    <span className="live-dot" style={{ background: sc.text }} />
                  </div>
                )}

                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
                  {table.isOccupied ? "👥" : "🪑"}
                </div>

                <h3 className="font-display" style={{ color: "var(--admin-text)", fontSize: "1.5rem", fontWeight: "700" }}>
                  Table {table.tableNumber}
                </h3>

                <p style={{ marginTop: "0.35rem", fontWeight: "700", fontSize: "0.85rem", color: sc.text }}>
                  {table.isOccupied ? `● ${table.orderStatus}` : "● Available"}
                </p>

                {table.isOccupied && table.totalAmount && (
                  <p style={{ color: "var(--admin-muted)", fontSize: "0.82rem", marginTop: "0.4rem" }}>
                    Order: <strong style={{ color: "#10b981" }}>₹{table.totalAmount}</strong>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
};

export default TablesPage;