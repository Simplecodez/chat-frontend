import { House, MagnifyingGlass, Bell, EnvelopeSimple, User, DotsThreeCircle } from '@phosphor-icons/react';

import Logo from '../components/Logo';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function HomeNav({ username }) {
  const location = useLocation();
  const [active, setActive] = useState(''); // Initialize active state

  useEffect(() => {
    const { pathname } = location;

    // Determine which button should be active based on the pathname
    if (pathname === '/home') {
      setActive('home');
    } else if (pathname === '/explore') {
      setActive('explore');
    } else if (pathname === '/notifications') {
      setActive('notifications');
    } else if (pathname === '/messages') {
      setActive('messages');
    } else if (pathname === `/${username}`) {
      setActive('profile');
    } else {
      setActive(''); // Clear active state for other routes
    }
  }, [location, username]);
  return (
    <aside className="left">
      <nav className="aside-nav">
        <Link to="/home" className="home-logo">
          <Logo width={32} height={32} />
        </Link>
        <Link to="/home" className="home-link">
          <House size={32} color="white" weight={active === 'home' ? 'fill' : 'bold'} />
          <p className={active === 'home' ? 'bolden' : ''}> Home</p>
        </Link>
        <Link to="/explore" className="home-link">
          <MagnifyingGlass size={32} color="white" weight={active === 'explore' ? 'fill' : 'bold'} />
          <p className={active === 'explore' ? 'bolden' : ''}>Explore</p>
        </Link>
        <Link to="/notifications" className="home-link">
          <Bell size={32} color="white" weight={active === 'notifications' ? 'fill' : 'bold'} />
          <p className={active === 'notifications' ? 'bolden' : ''}>Notifications</p>
        </Link>
        <Link to="/messages" className="home-link">
          <EnvelopeSimple size={32} color="white" weight={active === 'messages' ? 'fill' : 'bold'} />
          <p className={active === 'messages' ? 'bolden' : ''}>Messages</p>
        </Link>
        <Link to={`/${username}`} className="home-link">
          <User size={32} color="white" weight={active === 'profile' ? 'fill' : 'bold'} />
          <p className={active === 'profile' ? 'bolden' : ''}>Profile</p>
        </Link>
        <div>
          <DotsThreeCircle size={32} color="white" weight="bold" />
          <p>More</p>
        </div>
      </nav>
    </aside>
  );
}

export default HomeNav;
