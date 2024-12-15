// import React from 'react'

import { useEffect, useState } from "react";
import { request } from "../../utils/helper";

export default function HomePage() {
  const [home, setHome] = useState([])
  useEffect(() => {
    getList()
  }, [])


  const getList = async () => {
    const res = await request("author", "get");
    if (res) {
      setHome(res.data)
    }
  }

  return (
    <div>
      <h1>{home.length > 0 && home[0].auth_name}</h1>
    </div>
  )
}
