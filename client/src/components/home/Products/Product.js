import React, { useEffect, useState } from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { GiReturnArrow } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import Image from "../../designLayouts/Image";
import Badge from "./Badge";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import url from '../../../urls.json'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const server = url.node_server

const Product = (props) => {
  const [liked, setLiked] = useState(false)
  const dispatch = useDispatch();
  const _id = props.productFullName;
  const product_id = props.id
  const idString = (_id) => {
    return String(_id).toLowerCase().split(" ").join("");
  };
  const rootId = idString(_id);

  const navigate = useNavigate();
  const productItem = props;

  const handleProductDetails = async () => {
    let response = await fetch(`${server}/productClicked`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ product: product_id })
    })
    response = await response.json()

    if (response.ok) {
      navigate(`/product/${rootId}`, {
        state: {
          item: productItem,
        },
      });
    }
    else {
      toast.error('Server error occurred', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      })
    }
  }
  const like = async () => {
    let response = await fetch(`${server}/like`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ product: product_id })
    })
    response = await response.json()
    if (response.ok) {
      setLiked(true)
    }
    else {
      setLiked(false)
      // toast.error('Server error occurred', {
      //   position: toast.POSITION.TOP_RIGHT,
      //   autoClose: 2000
      // })
    }
  }
  const isLiked = async () => {
    let response = await fetch(`${server}/liked`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ product: product_id })
    })
    
    // if (response.status === 401) {
    //   setLiked(false)
    // }
    response = await response.json()
    if (response.ok) {
      setLiked(true)
    }
    else {
      setLiked(false)
    }
  }
  useEffect(() => {
    isLiked()
  }, [])

  return (
    <div className="w-full relative group">
      <div className="max-w-80 max-h-80 relative overflow-y-hidden ">
        <div>
          <Image className="w-full h-full" imgSrc={props.img} />
        </div>
        <div className="absolute top-6 left-8">
          {props.badge && <Badge text="New" />}
        </div>
        <div className="w-full h-32 absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
          <ul className="w-full h-full flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-l border-r">

            <li
              onClick={handleProductDetails}
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
            >
              View Details
              <span className="text-lg">
                <MdOutlineLabelImportant />
              </span>
            </li>
            <li className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full" onClick={like}>
              Like
              <span>
                {liked ? <BsSuitHeartFill style={{ color: 'red' }}/> : <BsSuitHeartFill />}
              </span>
            </li>
            <li>
              Product ID: {product_id}
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-80 py-6 flex flex-col gap-1 border-[1px] border-t-0 px-4">
        <div className="flex items-center justify-between font-titleFont">
          <h2 className="text-lg text-primeColor font-bold">
            {props.productName}
          </h2>
          <p className="text-[#767676] text-[14px]">Rs.{props.price}</p>
        </div>
        <div>
          <p className="text-[#767676] text-[14px]">{props.color}</p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Product;
