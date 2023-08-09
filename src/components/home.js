import React from 'react';
import './Login.css';
import logo from './images/logo.png';
import GoogleButton from 'react-google-button';

function Login() {
  return (
    <div className='login'>
      <div className='login_background'>
        <img className='login_logo' src={logo} alt='Logo' />
        <div className='login_gradient' />
      </div>
      <div className='login_body'>
        <h1>Smart Cart, Shopping Redefined Here!</h1>
        <h3>
          Discover a world of shopping at your fingertips. Explore endless options, from electronics to fashion, and experience the convenience of online commerce.
        </h3>
        <GoogleButton className='login_button' onClick={() => { console.log('Google button clicked') }} />
        <p className='join_us'>Join us today and start shopping smarter!</p>
      </div>
    </div>
  );
}

export default Login;
