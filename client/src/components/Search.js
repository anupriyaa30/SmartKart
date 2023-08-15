import { useEffect, useState } from "react";

const Card = ({ data }) => {
  console.log(data)
  return (
    <>
      <div>
        <img src={data.image} />
        <p></p>
        <a href={data.link} target="_blank">Link</a>
      </div>
    </>
  )
}

const Search = () => {
  const [search, setSearch] = useState("")
  const [products, setProducts] = useState([])
  const [no_of_products, setCount] = useState(null)

  function handle(e) {
    let data = { ...search }
    data = e.target.value
    setSearch(data)
  }
  async function submit() {
    const res = await fetch('http://localhost:5000/search', {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ query: search })
    })

    const result = await res.json()
    let data = []
    result.message.map(p => {
      data.push(p);
    })
    setCount(data.length)
    data.splice(100)
    setProducts(data)
  }

  function show() {
    return products.map(p => {
      return <Card data={p} />
    })
  }
  return (
    <>
      <input type='text' name="text" placeholder="Search" onChange={(e) => handle(e)} />
      <input type="button" value="Click" onClick={submit} />
      <div>
        {no_of_products !== null ? <>Fetched {no_of_products} Products</> : <></> }
      </div>
      {products.map(p => {
        return <Card data={p} />
      })}
    </>
  )
}

export default Search;