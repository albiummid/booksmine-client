import { Affix } from 'antd'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import Navbar from '../Navbar/Navbar'

export default function Layout({ children }) {
  const router = useRouter()

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
      {router.route !== '/login' && (
        <Affix>
          <Navbar />
        </Affix>
      )}

      <>{children}</>
      {router.route !== '/login' && (
        <>
          <p>Footer</p>
        </>
      )}
    </div>
  )
}
