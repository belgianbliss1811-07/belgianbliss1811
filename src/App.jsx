import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fffaf3",
            color: "#3b1f0e",
            borderRadius: "12px",
            border: "1px solid #e8d5bc",
            fontFamily: "Inter, sans-serif",
            fontWeight: "500",
            boxShadow: "0 8px 24px rgba(111,78,55,0.15)",
          },
          success: {
            iconTheme: { primary: "#6f4e37", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />
    </>
  );
}

export default App;