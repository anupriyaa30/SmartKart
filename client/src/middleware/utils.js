import { useEffect } from "react";
import url from '../urls.json';

const server = url.node_server

export async function checkLogin() {
  const response = await fetch(`${server}/checkLogin`, {
    method: "GET",
    credentials: "include"
  })
  const res = await response.json();
  if (res.ok) {
    return res.message
  }
  else {
    return null
  }
}