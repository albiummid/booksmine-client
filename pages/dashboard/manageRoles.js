import { Input, Select, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import API from '../../API/API'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import Authorize from '../../utils/Authorize'

export default function ManageRole() {
  const [allUserData, setAllUserData] = useState([])
  const [allRoles, setAllRoles] = useState([])
  const [tableData, setTableData] = useState([...allUserData])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Filter By')
  useEffect(() => {
    API.get('/user/all')
      .then(({ data }) => {
        setAllUserData(data.users)
        setTableData(data.users)
      })
      .catch(({ data }) => {
        console.log(data?.msg)
        toast.error(data?.msg)
      })
      .finally(() => setLoading(false))
    API.get('/role/all')
      .then(({ data }) => {
        setAllRoles(data.roles)
      })
      .catch(({ data }) => {
        console.log(data?.msg)
        toast.error(data?.msg)
      })
      .finally(() => setLoading(false))
  }, [])

  // handle Search
  const searchHandler = async (e) => {
    const search = e.target.value
    if (search?.length > 0) {
      let filtered = await tableData.filter(
        (d) =>
          d?.name
            .toString()
            .toLowerCase()
            .includes(search.toLocaleLowerCase()) ||
          d?.email
            ?.toString()
            .toLowerCase()
            .includes(search.toLocaleLowerCase())
      )
      await setTableData(filtered)
    } else {
      setTableData(allUserData)
      setFilter('Filter By')
    }
  }
  // filter Handler
  const filterHandler = (value) => {
    setFilter(value)
    const filteredData = allUserData.filter((item) => item.role === value)
    setTableData(filteredData)
  }

  // table Header
  const tableHeader = () => (
    <div
      className='header'
      style={{
        minHeight: '40px',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}
    >
      <h2 className='text-center' style={{ margin: '0 auto' }}>
        User Management
      </h2>
      <span
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '15px',
        }}
      >
        <Select onChange={filterHandler} value={filter} style={{ width: 150 }}>
          <Option value={'admin'}>Admin</Option>
          <Option value={'editor'}>Editor</Option>
          <Option value={'user'}>User</Option>
          <Option value={'developer'}>Developer</Option>
        </Select>
        <Input
          allowClear
          name='name'
          placeholder={'Search name or email '}
          onChange={searchHandler}
          style={{ margin: '0px 22px 0 8px', width: '200px' }}
        />
      </span>
    </div>
  )

  //tableColumns
  const tableColumns = [
    {
      key: 'No',
      title: 'No.',
      width: '50px',
      fixed: 'left',
      height: '100px',
      render: (row) => tableData.indexOf(row) + 1,
    },

    {
      key: 'User',
      title: 'User Name',
      dataIndex: 'name',
      sorter: (a, b) =>
        a.userName.toLowerCase().localeCompare(b.userName.toLowerCase()),
      width: 200,
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) =>
        a.email.toLowerCase().localeCompare(b.email.toLowerCase()),
      align: 'center',
      width: 300,
    },
    {
      key: 'role',
      title: 'Active Role',
      dataIndex: 'role',
      sorter: (a, b) =>
        a.imgUrl.toLowerCase().localeCompare(b.imgUrl.toLowerCase()),
      width: 130,
      render: (value, record) => (
        <>
          <Select
            loading={loading}
            value={record.role}
            onChange={(v) => handleRole(record._id, v)}
            style={{ width: '110px' }}
          >
            <Option key={'user'} value='user'>
              User
            </Option>
            <Option key={'admin'} value='admin'>
              Admin
            </Option>
            <Option key={'editor'} value='editor'>
              Editor
            </Option>
            <Option key={'developer'} value='developer'>
              Developer
            </Option>
          </Select>
        </>
      ),
    },
  ]

  const handleRole = (_id, value) => {
    setLoading(true)
    API.patch('/user/update?_id=' + _id, { role: value })
      .then(({ data }) => {
        setTableData(data.users)
      })
      .catch((err) => console.log(err))
      .finally(setLoading(false))
  }
  const { Option } = Select
  return (
    <DashboardLayout>
      <Authorize roleFor={['admin']}>
        <Table
          dataSource={tableData}
          columns={tableColumns}
          loading={loading}
          size='small'
          title={tableHeader}
          bordered='true'
          scroll={{ x: '500px' }}
        />
      </Authorize>
    </DashboardLayout>
  )
}
