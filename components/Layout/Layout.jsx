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
    <div className='max-w-7xl mx-auto'>
      <>
        <ToastContainer
          position='top-center'
          theme='light'
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          limit={0}
          rtl={false}
          // pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </>
      {router.route !== '/login' && (
        <Affix>
          <Navbar />
        </Affix>
      )}

      <div className='min-h-[80vh]'>{children}</div>
      {router.route !== '/login' && (
        <>
          <Footer />
        </>
      )}
    </div>
  )
}
