import {
  AreaChartOutlined,
  PoundCircleOutlined,
  ReconciliationOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons/lib/icons'
import { Menu } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'
import Authorize from '../../utils/Authorize'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const handleMenu = (e) => {
    router.push(e.key)
  }
  return (
    <div className=' m-4  '>
      <>
        <Authorize roleFor={['admin', 'editor', 'user']} className=''>
          <p className='bg-green-400 p-3 text-xl text-white font-bold rounded-lg'>
            Dashboard
          </p>
          <Menu
            defaultSelectedKeys={[router.pathname]}
            // defaultOpenKeys={['sub1', 'sub2']}
            mode={'horizontal'}
            theme={'light'}
            className='w-full'
            style={{ width: '200px' }}
            onSelect={handleMenu}
          >
            <Menu.Item key='/dashboard' icon={<AreaChartOutlined />}>
              Overview
            </Menu.Item>
            <Menu.Item key='/profile' icon={<UserOutlined />}>
              Profile
            </Menu.Item>

            <Menu.SubMenu
              title={'Academic'}
              key={'/dashboard/products/academic'}
            >
              <Menu.Item key={'/dashboard/products/academic/book'}>
                Books
              </Menu.Item>
              <Menu.Item key={'/dashboard/products/academic/departments'}>
                Department
              </Menu.Item>
              <Menu.Item key={'/dashboard/products/academic/semester'}>
                Semester
              </Menu.Item>
              <Menu.Item key={'/dashboard/products/academic/course'}>
                course
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.Item
              key='/dashboard/products/nonAcademic/'
              title='Non Academic'
            >
              Non Academic
            </Menu.Item>
            <Menu.Item key='/dashboard/manageRoles' icon={<TeamOutlined />}>
              Manage Roles
            </Menu.Item>
            <Menu.Item
              key='/dashboard/manageOrders'
              icon={<ReconciliationOutlined />}
            >
              Manage Order
            </Menu.Item>
            <Menu.Item
              key='/dashboard/transactions'
              icon={<PoundCircleOutlined />}
            >
              Transactions
            </Menu.Item>
            <Menu.Item
              key='/dashboard/buyingList'
              icon={<PoundCircleOutlined />}
            >
              BuyingList
            </Menu.Item>
          </Menu>
        </Authorize>
      </>
      <div className=' mx-auto'>{children}</div>
    </div>
  )
}
