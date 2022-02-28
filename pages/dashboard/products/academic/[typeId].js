import { Tabs } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import API from '../../../../API/API'
import DashboardLayout from '../../../../components/Layout/DashboardLayout'
import BooksMng from '../../../../components/Management/BooksMng/BooksMng'
import CourseMng from '../../../../components/Management/CourseMng'
import DeptMng from '../../../../components/Management/DeptMng'
import SemesterMng from '../../../../components/Management/SemesterMng'

export default function Academic() {
  const router = useRouter()
  const { typeId } = router.query
  const [deptData, setDeptData] = useState([])
  const [refetch, setRefetch] = useState(false)

  useEffect(() => {
    API.get('/department/all').then(({ data }) => {
      const { departments } = data
      setDeptData(departments)
    })
  }, [refetch])

  const { TabPane } = Tabs
  console.log(typeId)
  return (
    <DashboardLayout>
      <Tabs
        activeKey={typeId}
        onChange={(value) =>
          router.push('/dashboard/products/academic/' + value)
        }
        type='card'
        size={'large'}
      >
        <TabPane tab='Books' key='book'>
          <>
            <BooksMng isAcademic={true} />
          </>
        </TabPane>
        <TabPane tab='Departments' key='department'>
          <>
            <DeptMng data={{ deptData, setDeptData }} />
          </>
        </TabPane>
        <TabPane tab='Semesters' key='semester'>
          <>
            <SemesterMng data={{ deptData, setDeptData }} />
          </>
        </TabPane>

        <TabPane tab='Course' key='course'>
          <>
            <CourseMng data={{ deptData, setDeptData, setRefetch }} />
          </>
        </TabPane>
      </Tabs>
    </DashboardLayout>
  )
}
