import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import url from '../../../urls.json'

const server = url.node_server

const ProductInfo = ({ productInfo }) => {
  console.log(productInfo.ratings)
  const dispatch = useDispatch()
  const order = async () => {
    let response = await fetch(`${server}/order`, {
      method: "POST",
      credentials: 'include',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({product: productInfo.id})
    })
    response = await response.json()
    alert(response.message)
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold">{productInfo.productFullName}</h2>
      <p className="text-xl font-semibold">Rs.{productInfo.price}</p>
      <p className="text-base text-gray-600">{productInfo.des}</p>
      <p className="text-sm">Be the first to leave a review.</p>
      <p className="font-medium text-lg">
        {/* <span className="font-normal">Colors:</span> {productInfo.color} */}
      </p>
      <button
        onClick={order}
        className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-titleFont"
      >
        Buy Now
      </button>

      <button
        onClick={() =>
          dispatch(
            addToCart({
              _id: productInfo.id,
              name: productInfo.productName,
              quantity: 1,
              image: productInfo.img,
              // badge: productInfo.badge,
              price: productInfo.price
              // colors: productInfo.color,
            })
          )
        }
        className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-titleFont"
      >
        Add to Cart
      </button>
      <p className="font-normal text-sm">
        <span className="text-base font-medium"> Categories:</span> {productInfo.sub_category}, {productInfo.main_category}
      </p>
    </div>
  );
};

export default ProductInfo;
