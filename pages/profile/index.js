import { Button } from 'antd'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { fetchUser, userSelector } from '../../redux/slices/userSlice'

export default function Profile() {
  const { data } = useSession()
  const dispatch = useDispatch()
  const { user, loading } = useSelector(userSelector)
  useEffect(() => {
    dispatch(fetchUser(data.user.email))
  }, [data, dispatch])

  if (loading) return <LoadingSpinner />
  return (
    <DashboardLayout>
      <section className='flex m-5'>
        <h1>Profile</h1>
        <div className='m-auto flex flex-col place-items-center  border-2 border-gray-200 border-dashed p-5 rounded-lg'>
          <Image
            src={user.image}
            alt={user.name}
            height={100}
            width={100}
            className='rounded-full mx-auto'
          />
          <div className='info_section py-5'>
            <p>
              <b>Name:</b> {user.name}{' '}
            </p>
            <p>
              <b>Email:</b> {user.email}
            </p>
          </div>
          <Button
            onClick={() => {
              toast.info('This feature coming soon...')
            }}
            className='bg-orange-400 text-gray-100 rounded-lg border-orange-400 '
          >
            Update Data
          </Button>
        </div>
      </section>
    </DashboardLayout>
  )
}

Profile.auth = true
