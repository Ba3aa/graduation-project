import React, { useState } from 'react';
import './LoginPage.css'; 

function LoginPage({ onToggleTheme }) {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
  });

  const validatePassword = (value) => {
    const newValidation = {
      length: value.length >= 8 && value.length <= 32,
      capital: /[A-Z]/.test(value),
      number: /\d/.test(value),
      symbol: /[!@#$%^&*]/.test(value),
    };
    setValidation(newValidation);
    return newValidation;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
    if (error) {
      setError(null);
    }
  };

  const handleFetchLogin = (loginEmail, loginPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (loginEmail === 'bahaa@test.com' && loginPassword === 'Baha123!!') {
          resolve({ success: true, user: { name: 'Bahaa' }, token: 'mock-jwt-token-12345' });
        } else {
          reject(new Error('Invalid email or password.'));
        }
      }, 1500);
    });
  };  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentValidation = validatePassword(password);
    const allValid = Object.values(currentValidation).every(Boolean);

    if (!allValid) {
      if (!currentValidation.length) setError('Password must be 8 characters at least.');
      else if (!currentValidation.capital) setError('Password must contain at least one uppercase letter.');
      else if (!currentValidation.number) setError('Password must contain at least one number.');
      else if (!currentValidation.symbol) setError('Password must contain at least one special character.');
      return;
    }

    try {
      setError(null); 
      setIsLoading(true); 
      
      const response = await handleFetchLogin(email, password);
      
      console.log('Login successful:', response.user);
      alert('Login successful! (Redirecting to dashboard...)');

    } catch (err) {
      setError(err.message); 
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setIsBlinking(true);
    setTimeout(() => {
      setIsBlinking(false);
    }, 300);
  };
  
  const EyeOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3" className="eye-pupil"></circle>
    </svg>
  );
  const EyeClosedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07l-5.06-5.06M22 22l-5.06-5.06"></path>
    </svg>
  );
  const ThemeToggleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="theme-icon">
      <path className="sun" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
      <path className="moon" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      <circle className="sun" cx="12" cy="12" r="5"></circle>
    </svg>
  );

  return (
    <div className="login-container"> 
      
      <button onClick={onToggleTheme} className="theme-toggle-button">
        <ThemeToggleIcon />
      </button>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h2>Login</h2>
        
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input 
            type={showPassword ? "text" : "password"} 
            id="password" 
            placeholder='Enter your password'
            value={password}
            onChange={handlePasswordChange}
            required 
          />
          <span 
            onClick={togglePasswordVisibility} 
            className={`password-toggle-icon ${isBlinking ? 'blinking' : ''}`}
          >
            {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </span>
        </div>

        <ul className="password-criteria">
          <li className={validation.length ? 'valid' : 'invalid'}>
            8 characters
          </li>
          <li className={validation.capital ? 'valid' : 'invalid'}>
            uppercase letter
          </li>
          <li className={validation.number ? 'valid' : 'invalid'}>
            number
          </li>
          <li className={validation.symbol ? 'valid' : 'invalid'}>
            special character
          </li>
        </ul>

        <div className="options-group">
          <label className="remember-me">
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="slider"></span>
            Remember me
          </label>

          <a href="#" className="forgot-password">
            Forgot password?
          </a>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Checking...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;