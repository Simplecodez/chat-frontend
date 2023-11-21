import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from './Spinner';
import { Link } from 'react-router-dom';

export function SignupForm({ setSuccessMsg, onCreateAccount }) {
  const [isloading, setIsLoading] = useState(false);
  const [name, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [displayPassword, setDisplayPassword] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [createAccFeedback, setCreateAccFeedback] = useState('');
  const fieldRef = useRef('');
  const element = useRef(null);
  const timeOut = useRef(0);

  function validate(field, notValid, message) {
    setFeedback((feedbacks) => feedbacks.filter((feedback) => feedback.field !== field));
    if (notValid) {
      timeOut.current = setTimeout(() => {
        setFeedback((feedbacks) => [...feedbacks, { field, message }]);
      }, 800);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    //Help clear the timer if it's been set
    if (timeOut.current) {
      clearTimeout(timeOut.current);
      console.log(timeOut.current, 'This is the value');
      timeOut.current = 0;
    }
    // ####################################### NAME VALIDATION ##########################################################
    if (fieldRef.current === 'name' && name) {
      const isValid = !/^[a-zA-Z\s'-]{5,50}$/.test(name);
      validate('name', isValid, 'Name can contain only letters and spaces and must be 5 characters or more long.');
      return;
    }
    // ####################################### USERNAME VALIDATION ##########################################################
    if (fieldRef.current === 'username' && username) {
      const notValid = !/^[a-zA-Z0-9_-]{3,20}$/.test(username);
      validate('username', notValid, 'Must be atleast 3 characters long and contain only letters, numbers, "_", and "-"');
      if (notValid) return;
    }
    // ####################################### DISPLAYNAME VALIDATION #######################################################
    if (fieldRef.current === 'displayname' && displayName) {
      const isValid = !/^[a-zA-Z0-9\s-_.,]{2,40}$/.test(displayName);
      validate('displayname', isValid, 'Must contain only letters, numbers, "_", "-", "." and ","');
      return;
    }
    // ###################################### EMAIL VALIDATION ##############################################################
    if (fieldRef.current === 'email' && email) {
      const notValid = !/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email);
      validate('email', notValid, 'Please provide a valid email');
      if (notValid) return;
    }
    // ####################################### PASSWORD VALIDATION ##########################################################
    if (fieldRef.current === 'password' && password) {
      const isValid = !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=*!])(?!.*[ ])[A-Za-z\d@#$%^&+=*!]{8,}$/.test(password);
      validate('password', isValid, 'Password must be 8 characters long and contain atleast 1 of these: A-Z, a-z, 0-9 and @, #, $, %, ^, &, !');
      return;
    }
    // ######################################################################################################################
    async function checkIfExist() {
      const data = {};
      if (fieldRef.current === 'username' || fieldRef.current === 'email') {
        data[fieldRef.current] = fieldRef.current === 'username' ? username : email; // Updates are done
      }
      const options = {
        method: 'POST', // HTTP method
        headers: {
          'Content-Type': 'application/json' // Set the content type to JSON
        },
        body: JSON.stringify(data), // Convert the data object to JSON and set it as the request body
        signal: controller.signal
      };
      setIsChecking(true);
      try {
        const res = await fetch('http://localhost:5000/api/v1/users/verify', options);
        if (!res.ok) throw new Error('Please check your network connectivity!');
        const feedbackRes = await res.json();
        console.log(feedbackRes);
        setFeedback([{ field: fieldRef.current, message: feedbackRes.message }]);
        setIsChecking(false);
      } catch (err) {
        if (err.name !== 'AbortError') setFeedback([{ field: fieldRef.current, message: 'Please check your network connection!' }]);
        setIsChecking(false);
      }
    }
    if ((fieldRef.current === 'username' && username.length >= 3) || fieldRef.current === 'email') checkIfExist();
    return () => {
      if (timeOut.current) clearTimeout(timeOut.current);
      controller.abort();
    };
  }, [name, displayName, username, email, password]);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      name,
      username,
      displayName,
      email,
      password
    };
    const options = {
      method: 'POST', // HTTP method
      headers: {
        'Content-Type': 'application/json' // Set the content type to JSON
      },
      body: JSON.stringify(data) // Convert the data object to JSON and set it as the request body
    };
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/users/signup', options);
      if (!res.ok) {
        if (res.status >= 400 && res.status < 409) {
          // Handle 401 Unauthorized error, you can access the response message
          const errorData = await res.json(); // If the server sends an error message in the response body
          const errorMessage = errorData.message; // Access the error message
          setCreateAccFeedback(errorMessage);
          setIsLoading(false);
          return;
        } else {
          throw new Error(`Server error!!!, Error code: ${res.status}`);
        }
      }
      const signupFeedback = await res.json();
      if (signupFeedback.status === 'success') {
        setSuccessMsg('Great, your account was created successfully, kindly check your email to activate.');
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setCreateAccFeedback('Please check your network connection and try again later!');
      console.log('dskdksokdslklasksl jsdlfkjsl');
      setIsLoading(false);
    }
  }

  function handleOnfocus(field) {
    fieldRef.current = field;
  }

  function handleOnblur() {
    if (feedback.find((el) => el.message.includes('is available'))) setFeedback([]);
  }

  const clicked = useRef('');

  function handleDisplayPassword() {
    clicked.current = 'clicked';
    setDisplayPassword((state) => !state);
  }

  return (
    <form>
      <Link to="/" className="close-signup" onClick={() => onCreateAccount()}>
        &times;
      </Link>
      <div className="signup-hero">
        <h1>Welcome to Zenfluence</h1>
        <p>Join the fast growing community and connect!</p>
      </div>
      {/* {##########################################################################################################3333} */}
      <div className="name">
        <label htmlFor="fullname-register" className={name ? 'deam' : ''}>
          Full Name
        </label>
        <p className={`liveValidateMessage ${feedback.find((el) => el.field === 'name') ? 'liveValidateMessage--visible' : ''}`}>
          {feedback.find((el) => el.field === 'name') && feedback.find((el) => el.field === 'name').message}
        </p>

        <input
          type="text"
          placeholder="Enter your full Name"
          value={name}
          onChange={(e) => setFullname(e.target.value)}
          onFocus={() => {
            handleOnfocus('name');
          }}
          onBlur={handleOnblur}
        />
      </div>
      {/* {##########################################################################################################3333} */}
      <div className="username">
        <label htmlFor="fullname-register" className={username ? 'deam' : ''}>
          Username
        </label>
        <p
          className={`liveValidateMessage ${feedback.find((el) => el.field === 'username') ? 'liveValidateMessage--visible' : ''} ${
            feedback.find((el) => el && el.message && el.message.includes('is available')) ? 'success-color' : ''
          }`}
        >
          {feedback.find((el) => el.field === 'username') && feedback.find((el) => el.field === 'username').message}
        </p>
        <input
          type="text"
          placeholder="Enter Username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onFocus={() => {
            handleOnfocus('username');
          }}
          onBlur={handleOnblur}
        />
        {isChecking && fieldRef.current === 'username' ? <Spinner className="username-spinner" /> : ''}
      </div>
      {/* {##########################################################################################################3333} */}
      <div className="display-name">
        <label htmlFor="fullname-register" className={displayName ? 'deam' : ''}>
          Display Name
        </label>
        <p className={`liveValidateMessage ${feedback.find((el) => el.field === 'displayname') ? 'liveValidateMessage--visible' : ''}`}>
          {feedback.find((el) => el.field === 'displayname') && feedback.find((el) => el.field === 'displayname').message}
        </p>
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayname(e.target.value)}
          onFocus={() => {
            handleOnfocus('displayname');
          }}
          onBlur={handleOnblur}
        />
      </div>
      {/* {##########################################################################################################3333} */}
      <div className="email">
        <label htmlFor="fullname-register" className={email ? 'deam' : ''}>
          Email Address
        </label>
        <p
          className={`liveValidateMessage ${feedback.find((el) => el.field === 'email') ? 'liveValidateMessage--visible' : ''} ${
            feedback.find((el) => el && el.message && el.message.includes('is available')) ? 'success-color' : ''
          }`}
        >
          {feedback.find((el) => el.field === 'email') && feedback.find((el) => el.field === 'email').message}
        </p>
        <input
          type="email"
          placeholder="Email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => {
            handleOnfocus('email');
          }}
          onBlur={handleOnblur}
        />
        {isChecking && fieldRef.current === 'email' && <Spinner className="username-spinner" />}
      </div>
      {/* {##########################################################################################################3333} */}
      <div className="password">
        <label htmlFor="fullname-register" className={password ? 'deam' : ''}>
          Password
        </label>
        <p className={`liveValidateMessage ${feedback.find((el) => el.field === 'password') ? 'liveValidateMessage--visible' : ''}`}>
          {feedback.find((el) => el.field === 'password') && feedback.find((el) => el.field === 'password').message}
        </p>
        <input
          type={displayPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          // onBlur={handleConfirmPassword}
          autoComplete="false"
          onFocus={() => {
            handleOnfocus('password');
          }}
          onBlur={handleOnblur}
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
        className={feedback.length !== 0 || !username || !email || !name || !displayName || !password || !clicked.current ? 'sign-up-button' : ''}
        ref={element}
        disabled={feedback.length !== 0 || !username || !email || !name || !displayName || !password || !clicked.current}
      >
        {isloading ? <Spinner /> : 'Create account'}
      </button>
      {createAccFeedback ? <p className="sign-error-message">{createAccFeedback}</p> : ''}
    </form>
  );
}
