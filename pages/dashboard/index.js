import { Button } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { fetchUser } from '../../redux/slices/userSlice'

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={() => toast.error(' Sorry you are not allowed!')}>
        ERROR
      </Button>
      <Button onClick={() => toast.success(' Hurray You won the prize !')}>
        SUCCESS
      </Button>
      <Button
        onClick={() => toast.info(' You will be lost by going through it. ')}
      >
        INFO
      </Button>
      <Button onClick={() => toast.warn(' CAUTION: You will be die ')}>
        WARNING
      </Button>
    </div>
  )
}

Dashboard.auth = {
  roleFor: ['admin', 'developer', 'editor'],
  unAuthorized: '/unAuthorized',
}

export default Dashboard
