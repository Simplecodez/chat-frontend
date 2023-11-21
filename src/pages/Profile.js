import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation, useParams } from 'react-router-dom';
import HomeNav from '../components/HomeNav';
import { ArrowLeft, Calendar, DotsThreeCircle, EnvelopeSimple } from '@phosphor-icons/react';
import banner from '../banner.png';
import Posts from '../components/Posts';
import ModalContainer from '../components/ModalContainer';
import { Spinner } from '../components/Spinner';

function Profile() {
  const [bannerHolder, setBannerHolder] = useState('jhjh');
  const [url, setUrl] = useState(null);
  const [imageUrlArray, setImageUrlArray] = useState([]);
  const [postID, setPostID] = useState(null);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
  const [statusCode, setStatusCode] = useState(0);
  const [isloading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});

  const dateObj = new Date(loggedInUserDetails?.createdAt);

  const day = dateObj.getUTCDate(); // Get day (1-31)
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const monthIndex = dateObj.getUTCMonth();
  const monthName = months[monthIndex];
  const year = dateObj.getUTCFullYear();

  const navigate = useNavigate();
  const location = useLocation();
  const { username } = useParams();
  const [active, setActive] = useState(); // Initialize active state
  console.log(user);
  useEffect(() => {
    const { pathname } = location;
    setStatusCode(0);
    // Determine which button should be active based on the pathname
    if (pathname === '/profile') {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [location]);

  useEffect(
    function () {
      const abortController = new AbortController();
      setIsLoading(true);
      async function checkIfUserIsLoggedIn() {
        try {
          const options = {
            method: 'GET',
            credentials: 'include',
            signal: abortController.signal
          };
          const response = await fetch(`http://localhost:5000/api/v1/users/checkifloggedin/${username}`, options);
          if (!response.ok) {
            if (response.status >= 400 && response.status < 409) {
              // Handle 401 Unauthorized error, you can access the response message
              const errorData = await response.json(); // If the server sends an error message in the response body
              const errorMessage = errorData.message; // Access the error message User not found
              setUser(errorData.user);
              if (errorMessage === 'User not found') {
                setStatusCode(404);
              }
              setIsLoading(false);
              return;
            } else {
              console.log('error');
              throw new Error(`Server error!!!, Error code: ${response.status}`);
            }
          }
          const feedback = await response.json();
          if (feedback.status === 'success') {
            setIsLoading(false);
            setLoggedInUserDetails(feedback.newUser);

            setUser(feedback.user);
          }
        } catch (err) {
          if (err instanceof TypeError || err instanceof DOMException) {
            if (err.name !== 'AbortError') {
              navigate('/');
              return;
            }
          }
        }
      }

      checkIfUserIsLoggedIn();
      return () => {
        abortController.abort();
      };
    },
    [navigate, username]
  );

  function handleShowImage(url, imageUrlArray, postID) {
    setUrl(url);
    setImageUrlArray(imageUrlArray);
    setPostID(postID);
  }

  function handleCloseImageModal() {
    setUrl(null);
    setImageUrlArray([]);
    setPostID(null);
  }

  return (
    <div className="home-container">
      <HomeNav username={user.username} />
      <div className="center">
        {isloading ? (
          <Spinner size="5x" className="homeLoader" />
        ) : statusCode === 404 ? (
          <>
            <div className="profile-header">
              <div style={{ marginBottom: '10px' }} className="profile-header-content">
                <ArrowLeft size={24} />
                <div>
                  <h3>Profile</h3>
                </div>
              </div>
            </div>
            <div className="banner">
              {bannerHolder ? (
                <img src={banner} className="banner-img" alt="" />
              ) : (
                <div className="banner-placeholder"></div>
              )}
              <div className="profile-image-holder displayFull"></div>
            </div>
            <section>
              <h3 style={{ marginTop: '120px', marginLeft: '30px', color: 'white' }}>@{username}</h3>
              <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '18px' }}>
                <h4>This account doesn't exist</h4>
                <p>Try searching for another.</p>
              </div>
            </section>
          </>
        ) : (
          <>
            <div className="profile-header">
              <div className="profile-header-content">
                <ArrowLeft size={24} />
                <div>
                  <h3>{loggedInUserDetails.name}</h3>
                  <p>{loggedInUserDetails.postsCount} posts</p>
                </div>
              </div>
            </div>
            <div className="banner">
              {bannerHolder ? (
                <img src={banner} className="banner-img" alt="" />
              ) : (
                <div className="banner-placeholder"></div>
              )}
              <div className="profile-image-holder">
                <img
                  src="http://localhost:5000/profile/default.jpg"
                  alt="user DP"
                  width="100"
                  height="100"
                  className="profile-image"
                />
              </div>
            </div>
            <section className="user-details">
              {username === loggedInUserDetails.username ? (
                <Link className="edit home-link">Edit Profile</Link>
              ) : (
                <div>
                  <EnvelopeSimple size={32} color="white" weight="bold" />
                  <DotsThreeCircle size={32} color="white" weight="bold" />
                </div>
              )}
              <div className="other-details">
                <div>
                  <p className="user-id-name">{loggedInUserDetails.name}</p>
                  <p className="user-username">@{loggedInUserDetails.username}</p>
                </div>
                <div className="joined">
                  <Calendar size={24} color="rgba(252, 250, 250, 0.363)" />
                  <p>
                    Joined {monthName} {year}
                  </p>
                </div>
                <p className="followings">
                  <span>{loggedInUserDetails.followingsCount} </span> Followings &nbsp;&nbsp;&nbsp;&nbsp;{' '}
                  <span>{loggedInUserDetails.followersCount} </span> Followers
                </p>
                <div className="profile-nav">
                  <NavLink to="/profile/posts" className={`home-link ${active ? 'active' : ''}`}>
                    Posts
                  </NavLink>
                  <NavLink to="/profile/replies" className="home-link">
                    Replies
                  </NavLink>
                  <NavLink to="/profile/highlights" className="home-link">
                    Highlights
                  </NavLink>
                  <NavLink to="/profile/media" className="home-link">
                    Media
                  </NavLink>
                  <NavLink to="/profile/likes" className="home-link">
                    Likes
                  </NavLink>
                </div>
              </div>
            </section>
            <section className="content">
              <Posts onShowImage={handleShowImage} username={username} />
            </section>
          </>
        )}
      </div>
      <div className="right"></div>
      {url && (
        <ModalContainer
          imageUrl={url}
          imageUrlArray={imageUrlArray}
          postID={postID}
          isOpen={url ? true : false}
          onRequestClose={handleCloseImageModal}
        />
      )}
    </div>
  );
}

export default Profile;
