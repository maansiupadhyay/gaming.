import React, { useState } from 'react';
import Logo from '../assets/logo.png';
import '../App.css';
import { Link, useLocation } from 'react-router-dom';

const MainNav = () => {
  const [activeTab, setActiveTab] = useState('');
  const location = useLocation();

  React.useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const tabs = [
    { name: "Home", path: "/" },
    { name: "Ask Question", path: "/askquestion" },
    { name: "Questions", path: "/question" },
    { name: "Users", path: "/profile" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <div className="main-nav">
      <div className="logo">
        <img src={Logo} alt='Logo-img' style={{ height: 65, overflow: 'hidden', scale: '1.5' }} />
      </div>
      <ul className="nav-list">
        {tabs.map((tab, index) => (
          <Link 
            to={tab.path} 
            key={index} 
            role="button" 
            className={`nav-item ${activeTab === tab.path ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.path)}

          >
            <li
              className='nav-list-item'
              style={{
                padding: 10,
                borderRadius: 2,
                fontSize: 17,
                backgroundColor: activeTab === tab.path ? '#131d52' : 'transparent',
                color: activeTab === tab.path ? 'white' : 'black',
              }}
            >
              {tab.name}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default MainNav;
