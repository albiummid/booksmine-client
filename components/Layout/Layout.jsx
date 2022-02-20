import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import Navbar from '../Navbar/Navbar'

export default function Layout({ children }) {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(
    router.route === '/login' ? true : false
  )
  return (
    <div className='height-screen '>
      <>
        <ToastContainer
          position='top-right'
          theme='colored'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </>
      {!isLogin && (
        <>
          <Navbar />
        </>
      )}

      <>{children}</>
      {!isLogin && (
        <>
          <p>Footer</p>
        </>
      )}
    </div>
  )
}
