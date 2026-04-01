import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { placeOrder } from "../../services/orderService";
import { formatCurrency, roundCurrency } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, selectedTable, getCartTotal, setCustomerWhatsApp, setOrderId, clearCart } = useCart();

  const [whatsapp, setWhatsapp] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [loading, setLoading] = useState(false);
  const [showUPIModal, setShowUPIModal] = useState(false);

  const processOrderToBackend = async () => {
    setLoading(true);
    try {
      const orderData = {
        tableNumber: Number(selectedTable),
        customerWhatsApp: whatsapp.trim(),
        items: cartItems.map(({ id, name, category, price, quantity }) => ({ id, name, category, price, quantity })),
        totalAmount: getCartTotal(),
        paymentMode,
      };

      const res = await placeOrder(orderData);
      const newOrderId = res.data?._id || res.data?.data?._id || new Date().getTime(); 

      setCustomerWhatsApp(whatsapp.trim());
      setOrderId(newOrderId);
      clearCart();

      toast.success("Order placed successfully! 🎉");
      navigate("/success");
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!whatsapp.trim() || whatsapp.length < 10) {
      toast.error("Please enter a valid WhatsApp number");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (paymentMode === "Online") {
      // Trigger UPI Mock Modal
      setShowUPIModal(true);
    } else {
      // Process Cash Order Immediately
      processOrderToBackend();
    }
  };

  const simulateOnlinePayment = () => {
    setLoading(true);
    // Simulate gateway delay
    setTimeout(() => {
      setLoading(false);
      setShowUPIModal(false);
      toast.success("Payment successful via UPI Gateway ✅");
      processOrderToBackend();
    }, 1500);
  };

  return (
    <div className="bg-customer transition-colors" style={{ minHeight: "100vh", padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "520px", width: "100%", position: "relative", zIndex: 10 }} className="animate-fade-in">
        <button
          onClick={() => navigate("/cart")}
          className="btn-ghost"
          style={{ padding: "0.5rem 0.875rem", fontSize: "0.9rem", cursor: "pointer", fontWeight: "600", marginBottom: "1.5rem" }}
        >
          ← Back to Cart
        </button>

        <div className="customer-card" style={{ padding: "2.25rem" }}>
          <h1 className="font-display text-customer-title" style={{ fontSize: "1.75rem", fontWeight: "800", marginBottom: "0.35rem" }}>
            Checkout 💳
          </h1>
          <p className="text-customer-subtitle" style={{ fontSize: "0.88rem", marginBottom: "2rem" }}>
            Table {selectedTable} · {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
          </p>

          <form onSubmit={handleCheckout}>
            {/* WhatsApp */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label className="text-customer-title" style={{ display: "block", fontWeight: "600", fontSize: "0.88rem", marginBottom: "0.5rem" }}>
                WhatsApp Number *
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. 9876543210"
                required
                className="input-field"
              />
            </div>

            {/* Payment Mode */}
            <div style={{ marginBottom: "1.75rem" }}>
              <label className="text-customer-title" style={{ display: "block", fontWeight: "600", fontSize: "0.88rem", marginBottom: "0.75rem" }}>
                Payment Mode
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {["Cash", "Online"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    style={{
                      padding: "0.875rem",
                      borderRadius: "0.875rem",
                      border: paymentMode === mode ? "2px solid var(--brand-primary)" : "1.5px solid var(--customer-card-border)",
                      background: paymentMode === mode ? "rgba(111,78,55,0.08)" : "transparent",
                      color: paymentMode === mode ? "var(--brand-primary)" : "var(--customer-subtitle)",
                      fontWeight: "700",
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {mode === "Cash" ? "💵" : "📲"} {mode === "Cash" ? "Pay at Counter" : "UPI / Card"}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ background: "rgba(111,78,55,0.06)", borderRadius: "1rem", padding: "1rem 1.25rem", marginBottom: "1.5rem", border: "1px solid var(--customer-card-border)" }}>
              <p className="text-customer-title" style={{ fontWeight: "700", marginBottom: "0.75rem", fontSize: "0.9rem" }}>Order Summary</p>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem", fontSize: "0.85rem" }}>
                  <span className="text-customer-subtitle">{item.name} ×{item.quantity}</span>
                  <span className="text-customer-title" style={{ fontWeight: "600" }}>
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid var(--customer-card-border)", marginTop: "0.75rem", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between" }}>
                <span className="text-customer-title" style={{ fontWeight: "800", fontSize: "1rem" }}>Total</span>
                <span style={{ fontWeight: "800", color: "var(--brand-primary)", fontSize: "1.2rem" }}>
                  {formatCurrency(getCartTotal())}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%", opacity: loading ? 0.75 : 1 }}
            >
              {loading ? "Processing..." : paymentMode === "Online" ? "Proceed to Pay" : "✅ Confirm Order"}
            </button>
          </form>
        </div>
      </div>

      {/* UPI / ONLINE PAYMENT MOCK MODAL */}
      {showUPIModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 9999 }}>
          <div className="animate-slide-in" style={{ width: "100%", maxWidth: "520px", background: "var(--customer-card-bg)", backdropFilter: "blur(20px)", borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem", padding: "2.5rem 2rem", position: "relative", borderTop: "1.5px solid var(--brand-primary)", boxShadow: "0 -10px 40px rgba(0,0,0,0.2)" }}>
            
            <button
              onClick={() => !loading && setShowUPIModal(false)}
              style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "rgba(111,78,55,0.1)", border: "none", width: "32px", height: "32px", borderRadius: "50%", color: "var(--customer-text)", fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ✕
            </button>

            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a", padding: "0.5rem 1rem", borderRadius: "999px", display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: "700", marginBottom: "1rem" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#16a34a" }} /> Secure Gateway
              </div>
              <h2 className="font-display text-customer-title" style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "0.5rem" }}>
                {formatCurrency(getCartTotal())}
              </h2>
              <p className="text-customer-subtitle" style={{ fontSize: "0.9rem" }}>Belgian Bliss • Table {selectedTable}</p>
            </div>

            <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
              <button
                onClick={simulateOnlinePayment}
                disabled={loading}
                style={{ padding: "1.1rem", borderRadius: "1rem", border: "1.5px solid var(--customer-card-border)", background: "transparent", color: "var(--customer-text)", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: loading ? "not-allowed" : "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>📱</span> PhonePe / GPay / Paytm
                </div>
                <span>→</span>
              </button>
              
              <button
                onClick={simulateOnlinePayment}
                disabled={loading}
                style={{ padding: "1.1rem", borderRadius: "1rem", border: "1.5px solid var(--customer-card-border)", background: "transparent", color: "var(--customer-text)", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: loading ? "not-allowed" : "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>💳</span> Credit / Debit Card
                </div>
                <span>→</span>
              </button>
            </div>

            {loading && (
              <div style={{ textAlign: "center", color: "var(--brand-primary)", fontWeight: "600", fontSize: "0.9rem", marginTop: "-0.5rem", marginBottom: "1rem" }}>
                Mocking Payment Handshake... ⏳
              </div>
            )}

            <p style={{ textAlign: "center", color: "var(--customer-subtitle)", fontSize: "0.75rem" }}>
              🔒 Protected by Belgian Bliss Secure Pay API
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;