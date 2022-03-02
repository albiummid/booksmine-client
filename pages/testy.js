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
import API from '../API/API'

const EditableTable = () => {
  const [form] = Form.useForm()
  const [trxData, setTrxData] = useState([])
  const [tableData, setTableData] = useState(trxData)
  const [editingKey, setEditingKey] = useState('')
  const focusRef = useRef(null)

  const isEditing = (record) => record.key === editingKey

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/transaction/all')
        setTableData(data.transactions)
        setTrxData(data.transactions)
      } catch (err) {
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

  // All Functions //

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    })
    setEditingKey(record.key)
  }

  const cancel = () => {
    const previousData = tableData.filter((item) => item.key !== editingKey)
    setTableData(previousData)
    setEditingKey('')
  }

  const save = async () => {
    try {
      const updatedRow = await form.validateFields()
      console.log(updatedRow)
      const index = tableData.findIndex((item) => item.key === editingKey)
      const { _id } = tableData[index]

      if (_id?.length) {
        console.log('updating')
        const { data } = await API.patch('/transaction/' + _id)
        setTableData(data.transactions)
        setEditingKey('')

        // const item = newData[index]
        // newData.splice(index, 1, { ...item, ...updatedRow })
        //here we assign item because,, item contains some value that updatedRow don't...as id so.. after assigning updatedRow it will replace the changed value of that object.
        return
      }
      console.log('creating New')
      const { data } = await API.post('/transaction/', { updatedRow })
      setTableData([data.transaction, ...tableData])
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }
  const deleteTrx = async (id) => {
    try {
      const { data } = await API.delete('/transaction/' + id)
      toast.success('Deleted !')
      setTableData(data.transactions)
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
      width: '25%',
      editable: true,
    },
    {
      title: 'Trx Balance',
      dataIndex: 'trxBalance',
      width: '15%',
      editable: true,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      width: '40%',
      editable: true,
      filterSearch: true,
    },
    {
      title: 'Is Valid',
      dataIndex: 'isValid',
      width: '40%',
      editable: true,
      align: 'center',
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span className='flex  gap-2'>
            <Popconfirm title='Are you sure to save?' onConfirm={save}>
              <Button>
                <CheckOutlined />
              </Button>
            </Popconfirm>
            <Button onClick={cancel}>
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
              onClick={() => deleteTrx(record.id)}
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
              key: (Math.random() * 1000).toString(),
              trxId: '',
              trxBalance: 0,
              isValid: true,
              phone: '',
            }
            setTableData([newRecord, ...tableData])
            edit(newRecord)
          }}
        >
          Add
        </Button>
      </div>
    </div>
  )

  return (
    <Form form={form}>
      <Table
        title={tableHeader}
        bordered
        dataSource={tableData}
        columns={mergedColumns}
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  )
}

export default EditableTable
