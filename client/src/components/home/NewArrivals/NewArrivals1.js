import React from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import {
  newArrOne,
  newArrTwo,
  newArrThree,
  newArrFour,
} from "../../../assets/images/index";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";

const Similar = ({ data }) => {
  data.image = data.image.replace(/W\/IMAGERENDERING_521856-T1\/images\//, '');
  data.image = data.image.replace(/W\/IMAGERENDERING_521856-T2\/images\//, '');
  return (
    <div className="px-2">
      <Product
        id={data.id}
        img={data.image}
        productName={data.name.length > 20
          ? data.name.substring(0, 20) + "..."
          : data.name}
        productFullName={data.name}
        price={data.discount_price}
        ratings={data.ratings}
        main_category={data.main_category}
        sub_category={data.sub_category}
      // color="Black"
      // badge={false}
      // des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
      />
    </div>
  )
}

const NewArrivals = ({ products }) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  function show() {
    return products.map(p => {
      return <Similar data={p} />
    })
  }
  return (
    <div className="w-full p-10">
      {products.length > 0 ? <Heading heading="People also viewed" /> : <></>}
      <Slider {...settings}>
        {show()}
      </Slider>
    </div>
  );
};

export default NewArrivals;
