import { Button } from 'antd'
import { getAuth, signOut as logout } from 'firebase/auth'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import app from '../../config/firebase'
import React from 'react'
import Link from 'next/link'

export default function LoginToggleBtn() {
  const { data } = useSession()
  const router = useRouter()
  const auth = getAuth()
  let from = router.query.from || '/'
  const handleLogout = () => {
    signOut({ callbackUrl: from })
    logout(auth)
  }
  return (
    <div>
      {data ? (
        <Button onClick={handleLogout}>Logout</Button>
      ) : (
        <Button style={{ borderRadius: '10px' }}>
          <Link className='text-white text-ellipse' href={'/login'}>
            Log In
          </Link>
        </Button>
      )}
    </div>
  )
}
