import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { LandingPage } from './pages/LandingPage';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Notifications from './pages/Notification';
import Messages from './pages/Messages';
import Profile from './pages/Profile';

export default App;

function App() {
  const [displaySignup, setDisplaySignup] = useState(false);
  const [displaySignin, setDisplaySignin] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMessage, setErrorMsg] = useState('');
  const [errorClass, setErrorClass] = useState('login-error-in');

  function handleCreateAccount() {
    setDisplaySignup((state) => !state);
    setSuccessMsg('');
  }

  function handleSignin(e) {
    setDisplaySignin((state) => !state);
  }

  useEffect(function () {
    const timer = setTimeout(() => {
      setErrorClass('login-error-out');
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <main className="main-container">
      {/* {errorMessage !== 'User not found' && (
        <p className={errorClass}>
          <span>{errorMessage}</span>
        </p>
      )} */}
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                onCreateAccount={handleCreateAccount}
                onCreateSignin={handleSignin}
                displaySignup={displaySignup}
                displaySignin={displaySignin}
                successMsg={successMsg}
                setSuccessMsg={setSuccessMsg}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <LandingPage
                onCreateAccount={handleCreateAccount}
                onCreateSignin={handleSignin}
                displaySignup={displaySignup}
                displaySignin={displaySignin}
                successMsg={successMsg}
                setSuccessMsg={setSuccessMsg}
              />
            }
          />
          <Route
            path="/signin"
            element={
              <LandingPage
                onCreateAccount={handleCreateAccount}
                onCreateSignin={handleSignin}
                displaySignup={displaySignup}
                displaySignin={displaySignin}
                successMsg={successMsg}
                setSuccessMsg={setSuccessMsg}
              />
            }
          />
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/:username" element={<Profile setErrorMsg={setErrorMsg} />} />
          <Route path="/profile/posts" element={<Profile />} />
          <Route path="/profile/replies" element={<Profile />} />
          <Route path="/profile/:postID/photo/:index" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}
