import React from 'react'
import { ToastContainer } from 'react-toastify'
import Navbar from '../Navbar/Navbar'

export default function Layout({ children }) {
  return (
    <div className='height-screen '>
      <div>
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
      </div>
      <>
        <Navbar />
      </>
      <div>{children}</div>
      <div className='mt-auto'>
        <p>Footer</p>
      </div>
    </div>
  )
}
