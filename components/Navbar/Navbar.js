import { Button } from 'antd'
import { getAuth, signOut as sOut } from 'firebase/auth'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import app from '../../config/firebase'

import React from 'react'

export default function Navbar() {
  const auth = getAuth()
  const { data: session } = useSession()
  const router = useRouter()

  const LogOut = () => {
    sOut(auth)
    signOut()
  }
  return (
    <div className='flex item-center justify-between p-1'>
      <h1>Booksmine</h1>
      {session ? (
        <Button onClick={LogOut}>SignOut</Button>
      ) : (
        <Button onClick={() => router.push('/login')}>Login</Button>
      )}
    </div>
  )
}
