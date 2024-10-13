// import React from 'react';
// import './LandingPage.css';
// import { Link, Outlet, useLocation } from 'react-router-dom';
// import techImage from '../images/tech.webp';
// function LandingPage() {
//   const location = useLocation();

//   return (
//     <>
//       <nav>
//         <ul>
//           <li className={location.pathname === '/studlogin' ? 'active' : ''}>
//             <Link to="/student/login">Student Login</Link>
//           </li>
//           <li className={location.pathname === '/stafflogin' ? 'active' : ''}>
//             <Link to="/staff/login">Staff Login</Link>
//           </li>
//         </ul>
//       </nav>
//       <img src={techImage} alt="tech image"
//             style={{ 
//               width:1500, 
//               height: 'auto', 
//               borderRadius: '10px', 
//               alignItems:'center',
//             }}  />
//       <div className="outlet-container">
//         <Outlet />
//       </div>
//     </>
//   );
// }

// export default LandingPage;
import React from 'react';
import './LandingPage.css';
import { Link, Outlet, useLocation } from 'react-router-dom';
import techImage from '../images/tech.webp';

function LandingPage() {
  const location = useLocation();

  return (
    <div className="landing-wrapper">
      <div className="landing-container">
        <div className="image-section">
          <img src={techImage} alt="tech" className="landing-image" />
        </div>
        <div className="content-section">
          <h1 className="landing-title">Welcome to the Portal</h1>
          <p className="landing-description">
            Please choose your role to login:
          </p>
          <div className="button-group">
            <Link 
              to="/student/login" 
              className={`login-button ${location.pathname === '/student/login' ? 'active' : ''}`}
            >
              Student Login
            </Link>
            <Link 
              to="/staff/login" 
              className={`login-button ${location.pathname === '/staff/login' ? 'active' : ''}`}
            >
              Staff Login
            </Link>
          </div>
        </div>
      </div>
      <div className="outlet-section">
        <Outlet />
      </div>
    </div>
  );
}

export default LandingPage;
