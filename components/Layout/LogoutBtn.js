import { Button } from 'antd'
import { getAuth, signOut as logout } from 'firebase/auth'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'

export default function LogoutBtn() {
  const router = useRouter()
  const auth = getAuth()
  let from = router.query.from || '/'
  const handleLogout = () => {
    signOut({ callbackUrl: from })
    logout(auth)
  }
  return <Button onClick={handleLogout}>Logout</Button>
}
