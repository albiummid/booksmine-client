import { Tabs } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import API from '../../../../API/API'
import DashboardLayout from '../../../../components/Layout/DashboardLayout'
import BooksMng from '../../../../components/Management/BooksMng/BooksMng'

export default function NonAcademic() {
  const router = useRouter()
  const { typeId } = router.query
  console.log(typeId)
  const [deptData, setDeptData] = useState([])
  const [refetch, setRefetch] = useState(false)

  useEffect(() => {
    API.get('/department/all').then(({ data }) => {
      const { departments } = data
      setDeptData(departments)
    })
  }, [refetch])

  const ProductPageContainer = styled.div`
    padding: 0px;
  `
  const { TabPane } = Tabs
  return (
    <DashboardLayout>
      <>
        <BooksMng isAcademic={false} />
      </>
    </DashboardLayout>
  )
}
