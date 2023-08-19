import React, { useEffect, useState } from 'react'
import Footer from '../Footer/Footer'
import FooterBottom from '../Footer/FooterBottom'
import BestSellers from '../BestSellers/BestSellers1'
import Header from '../Header/Header'
import HeaderBottom from '../Header/HeaderBottom'
import url from '../../../urls.json'
import { useLocation } from 'react-router-dom'
import Product from "../Products/Product"

const server = url.python_server

const Search = () => {
  const [top_products, setTopProducts] = useState({})
  const [products, setProducts] = useState([])
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const query_searched = queryParams.get('query')
  const category_searched = queryParams.get('category')

  console.log(category_searched)

  if (!query_searched && !category_searched) {
    window.location.href = '/'
  }

  async function loadProducts() {
    const response = await fetch(`${server}/search?query=${query_searched}`, {
      method: "GET"
    });
    const fetched_products = await response.json();
    fetched_products.message.map(p => {
      p.image = p.image.replace(/W\/IMAGERENDERING_521856-T1\/images\//, '');
      p.image = p.image.replace(/W\/IMAGERENDERING_521856-T2\/images\//, '');
    });
    setProducts(fetched_products.message);
  }

  async function fetchTopProducts() {
    const response = await fetch(`${server}/top_products`, {
      method: "GET"
    });
    const res = await response.json();
    const list = res.message[category_searched]
    list.splice(100)
    list.map(p => {
      p[4] = p[4].replace(/W\/IMAGERENDERING_521856-T1\/images\//, '');
      p[4] = p[4].replace(/W\/IMAGERENDERING_521856-T2\/images\//, '');
    });
    setProducts(list)
  }

  useEffect(() => {
    async function fetchData() {
      if (category_searched) {
        await fetchTopProducts();
      }
      if (query_searched) {
        await loadProducts();
      }
      console.log(products);
    }
    fetchData();

  }, [category_searched, query_searched]);

  function show1() {
    return products.map(p => {
      return <Product
        id={p[0]}
        productName={p[1].length > 20
          ? p[1].substring(0, 20) + "..."
          : p[1]}
        img={p[4]}
        productFullName={p[1]}
        price={p[8]}
        main_category={p[2]}
        sub_category={p[3]}
      />
    })
  }

  function show2() {
    return products.map(p => {
      return <Product
        id={p.id}
        productName={p.name.length > 20
          ? p.name.substring(0, 20) + "..."
          : p.name}
        img={p.image}
        productFullName={p.name}
        price={p.discount_price}
        main_category={p.main_category}
        sub_category={p.sub_category}
      />
    })
  }


  return (
    <>
      <Header />
      <HeaderBottom />
      <div className="w-full p-10">
        {products.length ? <>Showing {products.length} results<br /><br /> </> : <></>}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
          {category_searched ? show1() : show2()}
        </div>
      </div>
      <Footer />
      <FooterBottom />
    </>
  )
}

export default Search