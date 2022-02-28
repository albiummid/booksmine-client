import { Select } from 'antd'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'
import { localAPI, serverAPI } from '../../API/API'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { getUserSettings, userSelector } from '../../redux/slices/userSlice'

function Dashboard() {
  const dispatch = useDispatch()
  const { data: session } = useSession()
  const router = useRouter()
  const { user, userSettings, loading } = useSelector(userSelector)

  console.log(session)
  const changeAPI = async (value) => {
    const serverData = { isServer: true, base: serverAPI }
    const localData = { isServer: false, base: localAPI }
    try {
      const { data } = await axios.patch(
        serverAPI + '/user/updateUserSettings?email=' + session.user.email,
        value === 'local' ? localData : serverData
      )
      localStorage.setItem('userSettings', JSON.stringify(data.userSettings))
      dispatch(getUserSettings(data.userSettings))
      router.reload(window.location.pathname)
    } catch (err) {
      console.log(err)
    }
  }

  // if (loading) return <LoadingSpinner />

  return (
    <>
      <DashboardLayout>
        <div className='h-[300px] rounded-md p-4 ring-1'>
          <h1>Status Board</h1>
          <p>
            <span className='font-bold'>Active API: </span>
            {userSettings.base}
          </p>
          <Select
            onChange={(v) => changeAPI(v)}
            className='w-[100px]'
            value={
              JSON.parse(localStorage.getItem('userSettings')).isServer
                ? 'server'
                : 'local'
            }
          >
            <Select.Option value={'local'}>Local</Select.Option>
            <Select.Option value={'server'}>Server</Select.Option>
          </Select>
        </div>
      </DashboardLayout>
    </>
  )
}

Dashboard.auth = {
  roleFor: ['admin', 'developer', 'editor', 'user'],
  unAuthorized: '/unAuthorized',
}

export default Dashboard
