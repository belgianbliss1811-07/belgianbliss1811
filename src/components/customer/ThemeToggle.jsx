import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        background: theme === "light" ? "#1a0800" : "#fdf8f0",
        color: theme === "light" ? "#fdf8f0" : "#1a0800",
        border: "none",
        fontSize: "1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 50,
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1) rotate(15deg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1) rotate(0deg)";
      }}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
};

export default ThemeToggle;
