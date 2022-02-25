import { Affix } from 'antd'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import Footer from '../Footer/Footer'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import Navbar from '../Navbar/Navbar'

export default function Layout({ children }) {
  const router = useRouter()
  const { data, status } = useSession()
  if (status === 'loading') return <LoadingSpinner />

  return (
    <div className='md:container'>
      <>
        <ToastContainer
          position='top-right'
          theme='colored'
          autoClose={1500}
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
          <Footer />
        </>
      )}
    </div>
  )
}
