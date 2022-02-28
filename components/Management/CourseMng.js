import {
  CheckOutlined,
  CloseOutlined,
  DeleteTwoTone,
  DownOutlined,
  EditTwoTone,
  PlusOutlined,
} from '@ant-design/icons'
import {
  Button,
  Drawer,
  Dropdown,
  Form,
  Input,
  Menu,
  Space,
  Switch,
  Table,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import API from '../../API/API'
import { InputText } from '../Layout/Elements.styles'

export default function CourseMng({ data }) {
  // States
  const { deptData, setRefetch } = data
  const [currentDept, setCurrentDept] = useState(deptData?.[0])
  const [semData, setSemData] = useState(currentDept?.semesters)
  const [currentSem, setCurrentSem] = useState(semData?.[0])
  const [courseData, setCourseData] = useState(currentSem?.courses)
  const [activeSem, setActiveSem] = useState()
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDrawer, setDrawerOpen] = useState(false)
  const [edit, setEdit] = useState({})
  const [stayOpen, setStayOpen] = useState(false)
  const [isNew, setIsNew] = useState(true)
  const [form] = Form.useForm()

  const For = 'Course'

  useEffect(() => {
    if (currentDept) {
      setSemData(currentDept.semesters)
    }
    if (currentSem?.courses) {
      setCourseData(currentSem.courses)
      setTableData(currentSem.courses)
    }
  }, [currentDept, currentSem])

  // Search  Functions //
  const searchHandler = async (e) => {
    const search = e.target.value
    if (search?.length > 0) {
      let filtered = await courseData.filter(
        (d) =>
          d?.title
            .toString()
            .toLowerCase()
            .includes(search.toLocaleLowerCase()) ||
          d?.courseCode
            ?.toString()
            .toLowerCase()
            .includes(search.toLocaleLowerCase())
      )
      await setTableData(filtered)
    } else {
      setTableData(courseData)
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
      dataIndex: 'title',
      //   key:'title'
    },
    {
      title: 'Course Code',
      key: 'courseCode',
      dataIndex: 'courseCode',
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
              const prevData = {
                _id: record._id,
                title: record.title,
                courseCode: record.courseCode,
              }
              form.setFieldsValue(prevData)
              setEdit(prevData)
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

      <span
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <>
          {currentDept && (
            <Dropdown
              style={{ width: '300px' }}
              overlay={
                <Menu>
                  {deptData?.map((item) => (
                    <Menu.Item
                      onClick={() => {
                        setTableData([])
                        setCurrentDept(item)
                        setCurrentSem(item?.semesters?.[0])
                      }}
                      key={item._id}
                    >
                      {item.name}
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <Button icon={<DownOutlined />}>
                {currentDept ? currentDept.name : 'Please Select Department'}
              </Button>
            </Dropdown>
          )}
        </>

        <Dropdown
          disabled={!currentSem?.title}
          overlay={
            <Menu>
              {semData?.map((item) => (
                <Menu.Item
                  onClick={() => {
                    setCurrentSem(item)
                  }}
                  key={item._id}
                >
                  {item.title}
                </Menu.Item>
              ))}
            </Menu>
          }
        >
          <Button icon={<DownOutlined />}>
            {currentSem?.title || 'No semester found in department'}
          </Button>
        </Dropdown>

        <Input
          allowClear
          placeholder={`Search ${For}`}
          onChange={searchHandler}
          style={{ margin: '0px 22px 0 8px', width: '200px' }}
        />
      </span>

      <Button
        disabled={!currentSem?.title}
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
    setLoading(true)
    if (isNew) {
      API.post(
        `/course/add?deptId=${currentDept._id}&semId=${currentSem._id}`,
        value
      )
        .then(({ data }) => {
          toast.success(data.msg)
          setTableData(data.courseData)
          closeDrawer()
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => setLoading(false))
    } else {
      API.patch(
        `/course/update?deptId=${currentDept._id}&semId=${currentSem._id}`,
        {
          ...value,
          _id: edit._id,
        }
      )
        .then(({ data }) => {
          toast.success(data.msg)
          setTableData(data.courseData)
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => setLoading(false))
    }
  }

  //

  const handleDelete = (id) => {
    setLoading(true)
    API.delete(
      `/course/delete?deptId=${currentDept._id}&semId=${currentSem._id}&_id=${id}`
    )
      .then(({ data }) => {
        toast.success(data.msg)
        setTableData(data.courseData)
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
            <h3>{For} Title:</h3>
            <Form.Item
              name='title'
              rules={[
                {
                  required: true,
                  validateTrigger: 'onSubmit',
                },
              ]}
            >
              <InputText
                style={{ width: '300px' }}
                placeholder={'Course Title exp. Basic Statistics'}
              />
            </Form.Item>
            {!isNew && (
              <p>
                <span style={{ color: 'red', fontWeight: 'bold' }}>
                  Previous Title :
                </span>{' '}
                {edit?.title}
              </p>
            )}
          </div>

          <div>
            <h3>{For} Code :</h3>
            <Form.Item
              name='courseCode'
              required={true}
              requiredMark={true}
              rules={[
                {
                  required: true,
                  message: 'Courser code is required for this action !',
                },
              ]}
            >
              <InputText
                style={{ width: '300px' }}
                placeholder={'Course Code exp. MATH'}
              />
            </Form.Item>
            {!isNew && (
              <p>
                <span style={{ color: 'red', fontWeight: 'bold' }}>
                  Previous {For} Code :
                </span>{' '}
                {edit?.semesterCode}
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
