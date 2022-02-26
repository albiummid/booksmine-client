/* eslint-disable @next/next/no-img-element */
import { DownOutlined } from '@ant-design/icons/lib/icons'
import { Button, Dropdown, Menu } from 'antd'
import { getAuth, signOut as logout } from 'firebase/auth'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import app from '../../config/firebase'
import Authorize from '../../utils/Authorize'

export default function LoginToggleBtn() {
  const initApp = app
  const { data, status } = useSession()
  const router = useRouter()
  const auth = getAuth()
  let from = router.query.from || '/'
  const handleLogout = () => {
    signOut({ callbackUrl: from })
    logout(auth)
  }

  const menuItems = (
    <Menu>
      <Authorize roleFor={['admin', 'editor', 'developer']}>
        <Menu.Item key={0}>
          <Link href={'/dashboard'}>Dashboard</Link>
        </Menu.Item>
      </Authorize>
      <Menu.Item key={1}>
        <Link href='/profile/'>My Profile</Link>
      </Menu.Item>
      <Menu.Item key={2}>
        <Link href='/profile/cart'>Cart Items</Link>
      </Menu.Item>
      <Menu.Item key={3}>
        <Link href='/profile/orders'>Order List</Link>
      </Menu.Item>

      <Menu.Item key={4}>
        <Link href={'/profile/favorite'}>Favorite Books</Link>
      </Menu.Item>

      <Menu.Item key={6} onClick={handleLogout} danger>
        Logout
      </Menu.Item>
    </Menu>
  )
  if (status === 'loading') return null
  return (
    <div>
      {data ? (
        <Dropdown overlay={menuItems}>
          <div className='flex justify-center items-center gap-1 border-dotted border-gray-200 px-1.5 py-1 rounded'>
            <img
              className='rounded-full w-8'
              src={data.user.image}
              alt={data.user.name}
            />
            <p className='text-sm'>{data.user.name}</p>
            <DownOutlined />
          </div>
        </Dropdown>
      ) : (
        <Link className=' text-white text-ellipse' href={'/login'} passHref>
          <Button style={{ borderRadius: '10px' }}>Log In</Button>
        </Link>
      )}
    </div>
  )
}
