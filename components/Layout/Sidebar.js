import {
  BankOutlined,
  MoneyCollectOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Menu, Tooltip } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'
const MenuCard = ({ title, link = '/', icon, menu }) => {
  const router = useRouter()
  let isActive = router.asPath === link
  return (
    <div onClick={() => router.push(link)} className='md:w-[200px] '>
      <Menu
        className={
          isActive
            ? 'text-red-400 bg-red-100 flex justify-center md:justify-start w-[50px] md:w-full hover:bg-red-100  cursor-pointer  border-l-0 border-b-4  md:border-l-0 md:border-r-4 border-red-400  border-r-0 border-t-0 md:border-b-0  border-solid '
            : ' hover:bg-red-100  flex justify-center md:justify-start w-[50px] md:w-full border-none  cursor-pointer '
        }
      >
        <div
          className={
            'flex  justify-start items-center px-2 py-1 gap-2  rounded-lg transition-all ease-out delay-100 '
          }
        >
          <Tooltip title={title} placement='bottom'>
            <p className='text-xl md:hidden '>{icon}</p>
          </Tooltip>
          <p className='text-xl hidden md:block '>{icon}</p>
          <p className={'hidden md:block text-lg'}>{title}</p>
        </div>
      </Menu>
    </div>
  )
}
const items = [
  {
    title: 'Overview',
    link: '/dashboard',
    icon: <SettingOutlined />,
  },
  {
    title: 'Profile',
    link: '/profile',
    icon: <UserOutlined />,
  },
  {
    title: 'Academic',
    link: '/dashboard/products/academic/book',
    icon: <BankOutlined />,
  },
  {
    title: 'NonAcademic',
    link: '/dashboard/products/nonAcademic',
    icon: <ShopOutlined />,
  },
  {
    title: 'Manage Orders',
    link: '/dashboard/manageOrders',
    icon: <ShoppingOutlined />,
  },
  {
    title: 'Role Manage',
    link: '/dashboard/manageRoles',
    icon: <UserAddOutlined />,
  },
  {
    title: 'Transactions',
    link: '/dashboard/transactions',
    icon: <MoneyCollectOutlined />,
  },
  {
    title: 'BuyingList',
    link: '/dashboard/buyingList',
    icon: <ShoppingCartOutlined />,
  },
]

export default function Sidebar() {
  return (
    <>
      <div className={'md:w-[200px] m-2 md:mx-2 md:my-4 bg-white'}>
        <p className='hidden md:block first-letter:text-red-400 font-bold text-3xl bg-green-200 p-2 '>
          Dashboard
        </p>
        <div
          className={
            ' flex md:flex-col justify-center   gap-3 md:gap-1 md:my-4'
          }
        >
          {items.map((item, idx) => (
            <MenuCard
              key={idx}
              title={item.title}
              link={item.link}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </>
  )
}
