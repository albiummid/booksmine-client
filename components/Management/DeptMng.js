import {
  CheckOutlined,
  CloseOutlined,
  DeleteTwoTone,
  EditTwoTone,
  PlusOutlined,
} from '@ant-design/icons'
import {
  Button,
  Drawer,
  Form,
  Input,
  notification,
  Space,
  Switch,
  Table,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import API from '../../API/API'
import { InputText } from '../Layout/Elements.styles'

export default function DeptMng({ data }) {
  const { deptData, setDeptData } = data
  const [tableData, setTableData] = useState([...deptData])
  const [loading, setLoading] = useState(false)
  const [openDrawer, setDrawerOpen] = useState(false)
  const [edit, setEdit] = useState({})
  const [stayOpen, setStayOpen] = useState(false)
  const [isNew, setIsNew] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [form] = Form.useForm()

  const For = 'Department'

  // Table Functionality =>{}
  const searchHandler = async (e) => {
    const search = e.target.value
    const unfiltered = deptData
    if (search?.length > 0) {
      let filtered = await deptData.filter(
        (d) =>
          d?.name
            .toString()
            .toLowerCase()
            .includes(search.toLocaleLowerCase()) ||
          d?.departmentCode
            ?.toString()
            .toLowerCase()
            .includes(search.toLocaleLowerCase())
      )
      setTableData(filtered)
    } else {
      setTableData(unfiltered)
    }
  }

  // Table Columns //
  const tableColumns = [
    {
      title: 'No.',
      width: '50px',
      fixed: 'left',
      height: '100px',
      render: (row) => tableData?.indexOf(row) + 1,
      responsive: ['sm'],
    },
    {
      title: 'Title',
      key: 'title',
      dataIndex: 'name',
      //   key:'title'
    },
    {
      title: 'Department Code',
      key: 'departmentCode',
      dataIndex: 'departmentCode',
      //   key:'title'
    },
    {
      title: 'ID',
      key: '_id',
      dataIndex: '_id',
      responsive: ['sm'],
    },

    {
      title: 'Action',
      key: 'action',
      align: 'center',
      fixed: 'right',
      render: (text, record, index) => (
        <Space size='middle'>
          <Button
            onClick={() => {
              setDrawerOpen(true)
              setIsNew(false)
              setEdit({
                _id: record._id,
                name: record.name,
                departmentCode: record.departmentCode,
              })
            }}
            style={{ border: 'none' }}
          >
            <EditTwoTone style={{ fontSize: '20px' }} />
          </Button>
          <Button
            onClick={() => handleDelete(record._id)}
            style={{ border: 'none' }}
          >
            <DeleteTwoTone style={{ fontSize: '20px' }} twoToneColor='red' />
          </Button>
        </Space>
      ),
    },
  ]

  // TableHeader //
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
        {For}
      </h2>

      <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Input
          allowClear
          placeholder={`Search Department`}
          onChange={searchHandler}
          style={{ margin: '0px 22px 0 8px', width: '200px' }}
        />
      </span>

      <Button
        onClick={() => {
          setIsNew(true)
          setDrawerOpen(true)
        }}
        type='primary'
      >
        <PlusOutlined /> Add {For}
      </Button>
    </div>
  )

  // Functions => {   All the functions  }

  const handleFinish = (value) => {
    console.log(value)
    setLoading(true)
    if (isNew) {
      API.post('/department/add', value)
        .then(({ data }) => {
          console.log(data.departments)
          toast.success(data.msg)
          setDeptData(data.departments)
          closeDrawer()
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => setLoading(false))
    } else {
      API.put(`${'/department/update/' + edit?._id}`, value)
        .then(({ data }) => {
          console.log(data)
          toast.success(data.msg)
          setDeptData(data.departments)
          setTableData(data.departments)
          closeDrawer()
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => setLoading(false))
    }
  }

  // For giving value in update field;
  useEffect(() => {
    if (isNew) {
      form.setFieldsValue({
        _id: '',
        name: '',
        departmentCode: '',
      })
    } else {
      if (edit) {
        form.setFieldsValue({
          _id: edit?._id,
          name: edit?.name,
          departmentCode: edit?.departmentCode,
        })
      }
    }
  }, [isNew, edit, form])

  //

  const handleDelete = (id) => {
    setLoading(true)
    API.delete(`${'/department/delete/' + id}`)
      .then(({ data }) => {
        notification.success(data.msg)
        setDeptData(data.departments)
        setTableData(data.departments)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoading(false))
  }
  const closeDrawer = (isClose = true) => {
    if (isClose && !stayOpen) {
      setDrawerOpen(false)
      setIsNew(true)
      form.resetFields()
    } else {
      setDrawerOpen(true)
    }
  }

  return (
    <>
      <Drawer
        title={
          <>
            <h2>{isNew ? 'Add New ' + For : 'Update ' + For}</h2>
            <div>
              <span>Stay Open :</span>{' '}
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked={stayOpen}
                onChange={() => setStayOpen(!stayOpen)}
              />
            </div>
          </>
        }
        placement='right'
        width={'500px'}
        onClose={() => {
          closeDrawer()
        }}
        visible={openDrawer}
      >
        <Form
          onFinish={handleFinish}
          form={form}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            margin: '0 auto',
          }}
        >
          <div>
            <h3>{For} Name:</h3>
            <Form.Item
              name='name'
              rules={[
                {
                  required: true,
                  validateTrigger: 'onSubmit',
                },
              ]}
            >
              <InputText
                style={{ width: '300px' }}
                placeholder={'Department Name exp. Mathematics'}
              />
            </Form.Item>
            {!isNew && (
              <p>
                <span style={{ color: 'red', fontWeight: 'bold' }}>
                  Previous Title :
                </span>{' '}
                {edit?.name}
              </p>
            )}
          </div>

          <div>
            <h3>Department Code :</h3>
            <Form.Item
              name='departmentCode'
              required={true}
              requiredMark={true}
              rules={[
                {
                  required: true,
                  message: 'Department code is required for this action !',
                },
              ]}
            >
              <InputText
                style={{ width: '300px' }}
                placeholder={'Department Code exp. MATH'}
              />
            </Form.Item>
            {!isNew && (
              <p>
                <span style={{ color: 'red', fontWeight: 'bold' }}>
                  Previous DepartmentCode :
                </span>{' '}
                {edit?.departmentCode}
              </p>
            )}
          </div>
          {!isNew && (
            <div>
              <h3>{For} Id:</h3>
              <Form.Item
                name='_id'
                rules={[
                  {
                    required: true,
                    message: 'Department name is required for this action !',
                    validateTrigger: 'onSubmit',
                  },
                ]}
              >
                <InputText style={{ width: '300px' }} disabled={true} />
              </Form.Item>
            </div>
          )}
          <Button
            loading={loading}
            style={{ width: '200px', margin: '100px auto  ' }}
            size='large'
            type='dashed'
            htmlType='submit'
          >
            {isNew ? 'Add' : 'Update'}
          </Button>
        </Form>
      </Drawer>
      <Table
        style={{ fontSize: '5px !important' }}
        dataSource={tableData}
        columns={tableColumns}
        loading={loading}
        size='small'
        pagination={{
          position: ['none', 'bottomLeft'],
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        title={tableHeader}
        bordered='true'
        //   scroll={{ x: "calc(100vh - 600px)" }}
      />
    </>
  )
}
