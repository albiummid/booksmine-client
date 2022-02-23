import { Button, Dropdown, Menu, Typography } from 'antd'
import { getAuth, signOut as logout } from 'firebase/auth'
import { getSession, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import app from '../../config/firebase'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { DownOutlined } from '@ant-design/icons/lib/icons'

export default function LoginToggleBtn() {
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
      <Menu.Item key='1'>
        <Link href='/profile/'>My Profile</Link>
      </Menu.Item>
      <Menu.Item key='2'>
        <Link href='/profile/orders'>Order List</Link>
      </Menu.Item>
      <Menu.Item key='3'>
        <Link href='/profile/cart'>Cart Items</Link>
      </Menu.Item>
      {/* <Menu.Item key="3">
                <Link to='/dashboard/whiteList'>
                    My White List
                </Link>
            </Menu.Item>
            <Menu.Item key="4">
                <Link to='/dashboard/review'>
                    My Ratings and Review
                </Link>
            </Menu.Item> */}

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
          <div className='flex justify-center items-center gap-2 border-dotted border-gray-200 px-2 py-1 rounded'>
            <Image
              className='rounded-full'
              src={data.user.image}
              height={30}
              width={30}
              alt={data.user.name}
            />
            <Typography>{data.user.name}</Typography>
            <DownOutlined />
          </div>
        </Dropdown>
      ) : (
        <Link className='text-white text-ellipse' href={'/login'} passHref>
          <Button style={{ borderRadius: '10px' }}>Log In</Button>
        </Link>
      )}
    </div>
  )
}
