import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Table,
} from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import API from '../../API/API'
import DashboardLayout from '../../components/Layout/DashboardLayout'

const Transactions = () => {
  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = useState(true)
  const [trxData, setTrxData] = useState([])
  const [tableData, setTableData] = useState(trxData)
  const [editingKey, setEditingKey] = useState('')
  const focusRef = useRef(null)

  const isEditing = (record) => record?._id === editingKey

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/transaction/all')
        setTableData(data.transactions)
        setTrxData(data.transactions)
        setIsLoading(false)
      } catch (err) {
        setIsLoading(false)
        console.log(err)
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    if (editingKey?.length) {
      focusRef.current.focus()
    }
  }, [editingKey])

  useEffect(() => {
    setTableData(trxData)
  }, [trxData])

  // All Functions //

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    })
    setEditingKey(record._id)
  }

  const cancelEdit = () => {
    setTableData(trxData)
    setEditingKey('')
  }

  const save = async () => {
    try {
      const updatedRow = await form.validateFields()
      const index = trxData.findIndex((item) => item._id === editingKey)
      if (index >= 0) {
        const { data } = await API.put('/transaction/' + editingKey, {
          ...updatedRow,
        })
        cancelEdit()
        setTrxData(data.transactions)
        return
      }
      const { data } = await API.post('/transaction/', { ...updatedRow })
      cancelEdit()
      setTrxData([data.transaction, ...trxData])
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }
  const deleteTrx = async (id) => {
    try {
      const { data } = await API.delete('/transaction/' + id)
      toast.success('Deleted !')
      setTrxData(data.transactions)
    } catch (err) {
      console.log(err)
    }
  }

  const handleSearch = async (e) => {
    const text = e.target.value
    if (text.length) {
      const searched = trxData.filter(
        (item) =>
          item.trxId.toLowerCase().includes(text.toLowerCase()) ||
          item.trxBalance
            .toString()
            .toLowerCase()
            .includes(text.toLowerCase()) ||
          item.phone.toLowerCase().includes(text.toLowerCase())
      )
      return setTableData(searched)
    }
    setTableData(trxData)
  }

  // Table Stuffs

  const columns = [
    {
      title: 'Trx Id',
      dataIndex: 'trxId',
      width: 200,
      editable: true,
    },
    {
      title: 'Trx Balance',
      dataIndex: 'trxBalance',
      width: 50,
      editable: true,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      width: 100,
      editable: true,
      filterSearch: true,
    },
    {
      title: 'Is Valid',
      dataIndex: 'isValid',
      width: 50,
      editable: true,
      align: 'center',
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      width: 100,
      align: 'center',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span className='flex  gap-2'>
            <Popconfirm title='Are you sure to save?' onConfirm={save}>
              <Button>
                <CheckOutlined />
              </Button>
            </Popconfirm>
            <Button onClick={cancelEdit}>
              <CloseOutlined />
            </Button>
          </span>
        ) : (
          <div className='flex gap-2'>
            <Button
              className='text-blue-400 hover:border-blue-400'
              disabled={editingKey !== ''}
              onClick={() => {
                edit(record)
              }}
            >
              <EditOutlined />
            </Button>
            <Button
              className='text-red-400 hover:border-red-400'
              onClick={() => deleteTrx(record._id)}
            >
              <DeleteOutlined />
            </Button>
          </div>
        )
      },
    },
  ]
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      render: (tableData, rowData) => (
        <>
          {isEditing(rowData) ? (
            <>
              <Form.Item
                name={col.dataIndex}
                rules={[
                  { required: true, message: ` ${col.title} is required !` },
                ]}
              >
                {col.dataIndex === 'trxBalance' ? (
                  <InputNumber min={0} />
                ) : col.dataIndex === 'isValid' ? (
                  <Select value={tableData} style={{ width: '100px' }}>
                    <Select.Option value={true} key={1}>
                      True
                    </Select.Option>
                    <Select.Option value={false} key={2}>
                      False
                    </Select.Option>
                  </Select>
                ) : col.dataIndex === 'trxId' ? (
                  <Input ref={focusRef} />
                ) : (
                  <Input />
                )}
              </Form.Item>
            </>
          ) : (
            <div>
              {col.dataIndex === 'isValid' ? (
                <p>
                  {tableData ? (
                    <CheckCircleOutlined className='text-2xl text-green-400' />
                  ) : (
                    <CloseCircleOutlined className='text-2xl text-red-400' />
                  )}
                </p>
              ) : (
                <p>{tableData}</p>
              )}
            </div>
          )}
        </>
      ),
    }
  })
  const tableHeader = () => (
    <div className='flex justify-between mx-4'>
      <h2>Transactions</h2>
      <div className='flex justify-center gap-2'>
        <Input
          allowClear
          placeholder='Search'
          onChange={handleSearch}
          style={{ width: '200px' }}
        />
        <Button
          icon={<PlusOutlined />}
          disabled={editingKey !== ''}
          onClick={() => {
            const newRecord = {
              _id: (Math.random() * 1000).toString(),
              trxId: '',
              trxBalance: 0,
              isValid: true,
              phone: '',
            }
            const preD = tableData || []
            setTableData([newRecord, ...preD])
            edit(newRecord)
          }}
        >
          Add
        </Button>
      </div>
    </div>
  )

  return (
    <DashboardLayout>
      <Form form={form}>
        <Table
          loading={isLoading}
          title={tableHeader}
          bordered
          dataSource={tableData}
          columns={mergedColumns}
        />
      </Form>
    </DashboardLayout>
  )
}

export default Transactions
