import { PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Table,
  Typography,
} from 'antd'
import React, { useState } from 'react'
const originData = []

for (let i = 0; i < 6; i++) {
  originData.push({
    key: i.toString(),
    trxId: `TrzID ${i}`,
    trxBalance: 32 * i,
    phone: `London Park no. ${i}`,
    isValid: i % 2 == 0 ? true : false,
  })
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = (
    <>
      {dataIndex === 'trxBalance' ? (
        <InputNumber />
      ) : dataIndex === 'isValid' ? (
        <Select style={{ width: '100px' }}>
          <Select.Option key={1}>True</Select.Option>
          <Select.Option key={2}>False</Select.Option>
        </Select>
      ) : (
        <Input />
      )}
    </>
  )
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const EditableTable = () => {
  const [form] = Form.useForm()
  const [data, setData] = useState(originData)
  const [editingKey, setEditingKey] = useState('')

  const isEditing = (record) => record.key === editingKey

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    })
    setEditingKey(record.key)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (key) => {
    try {
      const row = await form.validateFields()
      const newData = [...data]
      const index = newData.findIndex((item) => key === item.key)

      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, { ...item, ...row })
        setData(newData)
        setEditingKey('')
      } else {
        newData.push(row)
        setData(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

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
      editable: false,
      render: (data, record) =>
        isEditing(record) ? (
          <Select style={{ width: '100px' }}>
            <Select.Option>True</Select.Option>
            <Select.Option>False</Select.Option>
          </Select>
        ) : data ? (
          <p>True</p>
        ) : (
          <p>False</p>
        ),
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title='Sure to cancel?' onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <div>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
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
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  const tableHeader = () => (
    <div className='flex justify-between mx-4'>
      <h2>Transaction</h2>
      <div className='flex justify-center gap-2'>
        <Input placeholder='Search' style={{ width: '200px' }} />
        <Button
          icon={<PlusOutlined />}
          disabled={editingKey !== ''}
          onClick={() => {
            const newRecord = {
              id: Math.random(),
              trxId: '',
              trxBalance: 0,
              isValid: true,
              phone: '',
            }
            setData([newRecord, ...data])
            edit(newRecord)
          }}
        >
          Add
        </Button>
      </div>
    </div>
  )
  return (
    <Form form={form}  component={false}>
      <Table
        title={tableHeader}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName='editable-row'
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  )
}

export default EditableTable
