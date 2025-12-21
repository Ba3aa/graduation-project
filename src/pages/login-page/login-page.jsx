import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login-page.css";
import {
  EyeOpenIcon,
  EyeClosedIcon,
  ThemeToggleIcon,
} from "../../components/common/icons.jsx";

function LoginPage({ currentTheme, onToggleTheme }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [validation, setValidation] = useState({
    length: false,
    capital: false,
    number: false,
    symbol: false,
    nonempty: false,
  });

  // استرجاع الإيميل المحفوظ
  useEffect(() => {
    const storedData = localStorage.getItem("rememberedUser");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.email) {
          setEmail(parsedData.email);
          setRememberMe(true);
        }
      } catch (e) {
        console.error("Failed to parse stored user data", e);
      }
    }
  }, []);

  const validatePassword = (value) => {
    const newValidation = {
      length: value.length >= 8 && value.length <= 32,
      capital: /[A-Z]/.test(value),
      number: /\d/.test(value),
      symbol: /[!@#$%^&*]/.test(value),
      nonempty: /\S/.test(value),
    };
    setValidation(newValidation);
    return newValidation;
  };

  const getPasswordError = (validation) => {
    if (!validation.nonempty) return "Please enter your password.";
    if (!validation.length)
      return "Your password must contain at least 8 characters.";
    if (!validation.capital)
      return "Your password must include at least one uppercase letter.";
    if (!validation.number)
      return "Your password must include at least one number.";
    if (!validation.symbol)
      return "Your password must include at least one special character.";
    return null;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
    if (error) setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const currentValidation = validatePassword(password);
    const allValid = Object.values(currentValidation).every(Boolean);

    if (!allValid) {
      setError(getPasswordError(currentValidation));
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // إرسال الطلب للباك إند
      const response = await axios.post(
        "http://localhost:5000/api/FLogin/login",
        {
          email,
          password,
        }
      );

      // في حالة النجاح
      localStorage.setItem("token", response.data.token); // تخزين التوكن الحقيقي

      if (rememberMe) {
        localStorage.setItem(
          "rememberedUser",
          JSON.stringify({ email: email.trim() })
        );
      } else {
        localStorage.removeItem("rememberedUser");
      }

      navigate("/home");
    } catch (err) {
      // Axios يضع رسالة الخطأ القادمة من السيرفر داخل err.response.data
      const errorMessage =
        err.response?.data?.message ||
        "Email or password incorrect or server error.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 300);
  };

  return (
    <div className="login-container">
      <button onClick={onToggleTheme} className="theme-toggle-button">
        <ThemeToggleIcon />
      </button>

      <form
        className="login-form"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="on"
      >
        <h2>Login</h2>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* الحقل الوهمي */}
        <input
          type="password"
          name="password_fake_break"
          tabIndex="-1"
          autoComplete="new-password"
          style={{
            position: "absolute",
            opacity: 0,
            height: 0,
            width: 0,
            zIndex: -1,
            pointerEvents: "none",
          }}
        />

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <span
            onClick={togglePasswordVisibility}
            className={`password-toggle-icon ${isBlinking ? "blinking" : ""}`}
          >
            {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </span>
        </div>

        <div className="options-group">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="remember-me-checkbox"
            />
            <span className={`slider ${rememberMe ? "checked" : ""}`}></span>
            Remember me
          </label>

          <a href="#" className="forgot-password">
            Forgot password?
          </a>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Checking..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
