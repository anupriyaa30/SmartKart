import React, { useEffect, useState } from 'react';
import './styles/Login.css';
import logo from './images/logo.png';
import { useGoogleLogin } from '@react-oauth/google';
import GoogleButton from 'react-google-button';
import axios from 'axios';
import url from '../urls.json';
import { checkLogin } from '../middleware/utils';
import LogoutButton from './LogoutButton';

const server = url.server

function Login() {
  const [user, setUser] = useState();
  useEffect(() => {
    async function check() {
      const res = await checkLogin();
      setUser(res);
    }
    check();
  })
  const fetchUser = (response) => {
    axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.access_token}`, {
        headers: {
          Authorization: `Bearer ${response.access_token}`,
          Accept: 'application/json'
        }
      })
      .then(async (res) => {
        const response = await fetch(`${server}/login`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify(res.data),
        })
        const data = await response.json()
        console.log(data)
        alert("Logged In")
        window.location.reload()
      })
      .catch((err) => {
        console.log(err)
        alert("Error logging in")
      });
  };
  const errorMessage = (error) => {
    console.log(error);
    alert("Error logging in")
  };
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => fetchUser(codeResponse),
    onError: (error) => errorMessage(error)
  });

  const handleLogout = async () => {
    let res = await fetch(`${server}/logout`, {
      method: "GET",
      credentials: "include"
    })
    res = await res.json()
    if (!res) {
      alert("Error logging out")
    }
    else {
      window.location.reload()
    }
  };

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
        {user ?
          <> <LogoutButton onClick={handleLogout} /> </>
          : <GoogleButton className='login_button' onClick={() => login()} />
        }
        <p className='join_us'>Join us today and start shopping smarter!</p>
      </div>
    </div>
  );
}

export default Login;
