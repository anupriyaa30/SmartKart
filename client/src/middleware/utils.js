import { useEffect } from "react";
import url from '../urls.json';

const server = url.server

export async function checkLogin() {
  const response = await fetch(`${server}/checkLogin`, {
    method: "GET",
    credentials: "include"
  })
  const res = await response.json();
  if (res === 0) {
    return true
  }
  else {
    return false
  }
}