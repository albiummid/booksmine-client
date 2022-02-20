import { Button } from 'antd'
import { getAuth, signOut as sOut } from 'firebase/auth'
import { signOut as logout, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import app from '../../config/firebase'

import React from 'react'
import LogoutBtn from '../Layout/LogoutBtn'
import Link from 'next/link'

export default function Navbar() {
  const router = useRouter()
  const { data: session } = useSession()
  return (
    <div className='flex item-center justify-between p-1'>
      <h1>Booksmine</h1>
      <Button onClick={() => router.push('/profile')}>Profile</Button>
      {session ? (
        <LogoutBtn />
      ) : (
        <Link href={'/login'}>
          <Button onClick={() => router.push('/login')}>Login</Button>
        </Link>
      )}
    </div>
  )
}
