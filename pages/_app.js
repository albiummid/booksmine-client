import '../styles/globals.css'
import 'antd/dist/antd.css'
import 'react-toastify/dist/ReactToastify.css'
import { SessionProvider } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import Layout from '../components/Layout/Layout'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth auth={Component.auth}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Auth>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </SessionProvider>
  )
}

function Auth({ children, auth, roles }) {
  const [isRun, setIsRun] = useState(auth?.roleFor ? true : false)
  const [isAllowed, setIsAllowed] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push(`/login?from=${router.pathname}`)
    },
  })

  useEffect(() => {
    if (session?.user?.email && isRun) {
      axios
        .get(
          `https://booksmine-server.herokuapp.com/api/v1/user/getUserRoleBy?email=${session?.user?.email}`
        )
        .then(({ data }) => {
          const userRole = data.role
          const index = auth?.roleFor?.findIndex((item) => item === userRole)
          console.log(index)
          if (index >= 0) {
            setIsAllowed(true)
          } else {
            setIsAllowed(false)
          }
        })
        .catch((err) => {
          const userRole = 'user'
          const index = auth?.roleFor?.findIndex((item) => item === userRole)
          if (index > -1) {
            setIsAllowed(true)
          } else {
            setIsAllowed(false)
          }
        })
        .finally(() => setLoading(false))
    }
  }, [auth, session])

  const isUser = !!session?.user && !loading

  if (isUser) {
    if (!auth?.roleFor) {
      console.log(isAllowed)
      //role not exist?
      if (isUser) {
        return children
      }
    } else {
      if (isAllowed) {
        return children
      } else {
        return <div>You are not allowed</div>
      }
    }
  }
  return <LoadingSpinner full={true} />
}
