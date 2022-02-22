import '../styles/globals.css'
import 'antd/dist/antd.css'
import 'react-toastify/dist/ReactToastify.css'
import { SessionProvider } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import Layout from '../components/Layout/Layout'
import { Provider } from 'react-redux'
import store from '../redux/store'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <Provider store={store}>
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
    </Provider>
  )
}

function Auth({ children, auth }) {
  const [isAllowed, setIsAllowed] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push(`/login?from=${router.pathname}`)
    },
  })
  useEffect(() => {
    const roleFor = auth.roleFor
    if (session && roleFor) {
      const role = session.user.role
      setIsAllowed(roleFor.includes(role))
    }
  }, [session, auth])

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
  return <LoadingSpinner />
}
