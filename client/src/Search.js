import { useEffect, useState } from "react"
import Products from "./Products/Products"
import products from "./db/data"
import Card from "./components/Card"
import "./Search.css"
import { useLocation } from 'react-router-dom'
import url from './urls.json'
import Header from "./components/home/Header/Header"

const server = url.python_server

function App() {
  const [products, setProducts] = useState([])

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const query_searched = queryParams.get('query')

  if (!query_searched) {
    window.location.href = '/'
  }

  useEffect(() => {
    async function loadProducts() {
      const response = await fetch(`${server}/search?query=${query_searched}`, {
        method: "GET"
      })
      const fetched_products = await response.json()
      const filteredProducts = []
      fetched_products.message.map(p => {
        p.image = p.image.replace(/W\/IMAGERENDERING_521856-T1\/images\//, '')
        p.image = p.image.replace(/W\/IMAGERENDERING_521856-T2\/images\//, '')
      })
      setProducts(fetched_products.message)
      console.log(fetched_products.message.length)
    }

    if (query_searched) loadProducts()
  }, [])

  async function isImageAccessible(imageUrl) {
    try {
      const response = await fetch(imageUrl);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  function show() {
    return products.map(
      ({ image, name, ratings, discount_price, actual_price }) => (
        <Card
          key={Math.random()}
          img={image}
          title={name}
          // star={ratings}
          // reviews={reviews}
          prevPrice={`Rs.${actual_price}`}
          newPrice={`Rs.${discount_price}`}
        />
      )
    );
  }

  const result = show()
  return (
    <>
      <Header />
      <Products result={result} />
    </>
  );
}

export default App;
