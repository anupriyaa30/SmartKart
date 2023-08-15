import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiShoppingCart2Fill } from "react-icons/ri"
import { FcGoogle } from "react-icons/fc"
import { useSelector } from "react-redux"
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google'
import url from '../../urls.json';
import { checkLogin } from '../../middleware/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const server = url.node_server

const SpecialCase = () => {
  const products = useSelector((state) => state.orebiReducer.products);
  const [user, setUser] = useState(null)
  useEffect(() => {
    async function check() {
      const res = await checkLogin()
      setUser(res)
    }
    check();
  }, [user])

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
        window.location.reload()
      })
      .catch((err) => {
        console.log(err)
        alert("Error logging in")
      });
  }

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => fetchUser(codeResponse),
    onError: (error) => errorMessage(error)
  });
  const errorMessage = (error) => {
    console.log(error);
    alert("Error logging in")
  }

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
  }

  return (
    <div className="fixed top-52 right-2 z-20 hidden md:flex flex-col gap-2">
      {!user ? <div onClick={login} className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer">
        <div className="flex justify-center items-center">
          <FcGoogle className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />

          <FcGoogle className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
        </div>
        <p className="text-xs font-semibold font-titleFont">Login</p>
      </div>
        : <>
          <div onClick={handleLogout} className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer relative">
            <FontAwesomeIcon icon={faRightFromBracket} height="20px" />
            <p className="text-xs font-semibold font-titleFont">Logout</p>
          </div>
          <Link to="/cart">
            <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer relative">
              <div className="flex justify-center items-center">
                <RiShoppingCart2Fill className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />

                <RiShoppingCart2Fill className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
              </div>
              <p className="text-xs font-semibold font-titleFont">Buy Now</p>
              {products.length > 0 && (
                <p className="absolute top-1 right-2 bg-primeColor text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                  {products.length}
                </p>
              )}
            </div>
          </Link>
        </>}
    </div>
  );
};

export default SpecialCase;
