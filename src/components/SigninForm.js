import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Spinner } from './Spinner';

export function SigninForm({ onSignin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [displayPassword, setDisplayPassword] = useState(false);
  const [createAccFeedback, setCreateAccFeedback] = useState('');

  const abortController = new AbortController();
  const { signal } = abortController;

  useEffect(() => {
    // Abort the request when the component unmounts
    return () => {
      abortController.abort();
      console.log('aborted');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      email,
      password
    };
    const options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json' // Set the content type to JSON
      },
      body: JSON.stringify(data), // Convert the data object to JSON and set it as the request body
      signal
    };
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/v1/users/signin', options);
      if (!response.ok) {
        if (response.status >= 400 && response.status < 409) {
          // Handle 401 Unauthorized error, you can access the response message
          const errorData = await response.json(); // If the server sends an error message in the response body
          const errorMessage = errorData.message; // Access the error message
          setCreateAccFeedback(errorMessage);
          setIsLoading(false);
          return;
        } else {
          throw new Error(`Server error!!!, Error code: ${response.status}`);
        }
      }
      const feedback = await response.json();
      if (!abortController.signal.aborted) {
        if (feedback.status === 'success') {
          setCreateAccFeedback(feedback.message);
        } else {
        }
        setIsLoading(false);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.log(error);
        setCreateAccFeedback('Network error: Unable to fetch data. Please check your internet connection.');
      }
      setIsLoading(false);
    }
  }

  function handleDisplayPassword() {
    setDisplayPassword((state) => !state);
  }

  return (
    <form>
      <Link to="/" className="close-signup" onClick={() => onSignin('close')}>
        &times;
      </Link>
      <div className="signup-hero">
        <h1>Welcome back, sign in</h1>
      </div>
      {/* {##########################################################################################################3333} */}
      <div className="username">
        <label htmlFor="fullname-register" className={email ? 'deam' : ''}>
          Email/Username
        </label>

        <input type="text" placeholder="Enter Email/Username" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      {/* {##########################################################################################################3333} */}
      <div className="password">
        <label htmlFor="fullname-register" className={password ? 'deam' : ''}>
          Password
        </label>
        <input
          type={displayPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          // onBlur={handleConfirmPassword}
          autoComplete="false"
        />

        {displayPassword ? (
          <FontAwesomeIcon icon={faEye} size="2x" color="rgba(155, 47, 47, 0.575)" onClick={handleDisplayPassword} />
        ) : (
          <FontAwesomeIcon icon={faEyeSlash} size="2x" color="rgba(155, 47, 47, 0.575)" onClick={handleDisplayPassword} />
        )}
      </div>

      <button
        onClick={(e) => {
          handleSubmit(e);
        }}
        className={!email || !password ? 'sign-up-button' : ''}
        disabled={!email || !password}
      >
        {isLoading ? <Spinner /> : 'Sign in'}
      </button>
      {createAccFeedback ? <p className="sign-error-message">{createAccFeedback}</p> : ''}
    </form>
  );
}
