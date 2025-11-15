import React, { useState, useEffect } from "react";
import LoginPage from "./pages/loginpage";

function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="App">
      <LoginPage onToggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
