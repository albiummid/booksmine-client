import { useRouter } from 'next/router'
import React from 'react'

function Cart() {
  const router = useRouter()
  console.log(router)
  return <div>cart</div>
}

export default Cart
