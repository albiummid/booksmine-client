import React from 'react'
import Authorize from '../../utils/Authorize'
import Sidebar from './Sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className='md:flex '>
      <>
        <Authorize roleFor={['admin', 'editor', 'user']}>
          <Sidebar />
        </Authorize>
      </>
      <div className='mx-auto max-h-full'>{children}</div>
    </div>
  )
}
