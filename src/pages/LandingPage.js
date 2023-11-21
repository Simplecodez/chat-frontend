import Logo from '../components/Logo';
import Modal from '../components/Modal';
import { SigninForm } from '../components/SigninForm';
import { SignupForm } from '../components/SignupForm';
import { Link } from 'react-router-dom';

export function LandingPage({
  onCreateAccount,
  onCreateSignin,
  displaySignup,
  displaySignin,
  successMsg,
  setSuccessMsg
}) {
  return (
    <section className="signup-section">
      {displaySignup ? (
        <Modal display={displaySignup}>
          {!successMsg ? (
            <SignupForm setSuccessMsg={setSuccessMsg} onCreateAccount={onCreateAccount} />
          ) : (
            <div className="sign-success-message">
              <Link to="/" className="close-signup" onClick={() => onCreateAccount()}>
                &times;
              </Link>
              <svg
                className="checkmark-svg"
                width="124"
                height="123"
                viewBox="0 0 124 123"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M123.5 61.5C123.5 95.4655 95.9655 123 62 123C28.0345 123 0.5 95.4655 0.5 61.5C0.5 27.5345 28.0345 0 62 0C95.9655 0 123.5 27.5345 123.5 61.5ZM6.25046 61.5C6.25046 92.2896 31.2104 117.25 62 117.25C92.7896 117.25 117.75 92.2896 117.75 61.5C117.75 30.7104 92.7896 5.75046 62 5.75046C31.2104 5.75046 6.25046 30.7104 6.25046 61.5Z"
                  fill="#141d26"
                />
                <path d="M91.5058 41.1926L53.3793 79.319L36.0491 61.9888" className="checkmark-path" />
              </svg>

              <p className="checkmark-path-circle">{successMsg}</p>
            </div>
          )}
        </Modal>
      ) : displaySignin ? (
        <Modal display={displaySignin}>
          <SigninForm onSignin={onCreateSignin} />
        </Modal>
      ) : (
        ''
      )}
      <div>
        <Logo />
      </div>

      <div>
        <aside className="sign-up">
          <h2>Happening now</h2>
          <h3>Join us today.</h3>
          <a href="#google" className="home-link">
            Sign in with Google
          </a>
          <a href="#apple" className="home-link">
            Sign in with Apple
          </a>
          <a href="#facebook" className="home-link">
            Sign in with Facebook
          </a>
          <div className="demacate">
            <div className="line"></div>
            <p className="or">Or</p>
            <div className="line"></div>
          </div>
          <Link className="home-link" to="/signup" onClick={() => onCreateAccount()}>
            Create an account
          </Link>
          <p>By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.</p>
          <br />
          <br />
          <h4>Already have an account?</h4>
          <Link className="home-link" to="/signin" onClick={() => onCreateSignin()}>
            Sign in
          </Link>
        </aside>
      </div>
    </section>
  );
}
