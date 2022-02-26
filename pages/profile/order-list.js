import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons/lib/icons'
import { Button, Modal, Result, Select, Table, Tooltip } from 'antd'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { local } from '../../API/API'
import { fetchOrders, userSelector } from '../../redux/slices/userSlice'

export default function OrderList() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { data } = useSession()
  let orderId = router.query.orderId
  const { orders, loading } = useSelector(userSelector)
  const [tableData, setTableData] = useState([])
  const [filter, setFilter] = useState('Filter By')
  const lastOrder = orders?.find((item) => item._id === orderId)

  useEffect(() => {
    setTableData(orders)
  }, [orders])
  useEffect(() => {
    dispatch(fetchOrders(data?.user?.email))
  }, [dispatch, data])

  if (orderId?.length)
    return (
      <Result
        status='success'
        title={`You have successfully order ${lastOrder.orders.length} books with different quantities.`}
        subTitle={`Order number: "${lastOrder._id}", total bill was ${lastOrder.totalBill}Tk. and transactionID was "${lastOrder.trxId} ".Your order now on pending due to verify payment,takes 1-5 minutes...`}
        extra={[
          <Button
            onClick={() => router.push('/profile/order-list')}
            type='primary'
            key='orderList'
          >
            View Order List
          </Button>,
          <Button key='buy' onClick={() => router.push('/')}>
            Buy Again
          </Button>,
        ]}
      />
    )

  // Table Funtionality
  const tableHeader = () => (
    <div className='min-h-[40px] flex flex-wrap justify-evenly'>
      <h2 className='text-center w-[80%]'>Order List</h2>
      <Select
        className='ml-auto'
        onChange={filterHandler}
        value={filter}
        style={{ width: 100 }}
      >
        <Option value={'done'}>Done</Option>
        <Option value={'pending'}>Pending</Option>
        <Option value={'processing'}>Processing</Option>
      </Select>
    </div>
  )
  const { Option } = Select

  const tableColumns = [
    {
      key: 'No',
      title: 'No.',
      width: '50px',
      fixed: 'left',
      height: '100px',
      render: (row) => tableData.indexOf(row) + 1,
      responsive: ['md'],
    },

    {
      key: 'books',
      title: 'Book Name',
      dataIndex: 'books',
      render: (books) => (
        <div>
          {books.map((book, i) => (
            <Link key={i} href={'/book/' + book._id} passHref>
              <p className='even:text-gray-400 cursor-pointer' key={book._id}>
                {i + 1}. {book.title} x {book.quantity}pcs.
              </p>
            </Link>
          ))}
        </div>
      ),
    },
    {
      key: 'bill',
      title: 'Total Bill',
      dataIndex: 'totalBill',
      width: 80,
      render: (bill) => <p>{bill}</p>,
    },
    {
      key: 'status',
      title: 'Status',
      width: 100,
      dataIndex: 'status',
      render: (status) => <p>{status}</p>,
    },
    {
      key: 'action',
      title: 'Action',
      dataIndex: '_id',
      width: 80,
      align: 'center',
      render: (id, record) => (
        <>
          {record.status !== 'pending' ? (
            <Tooltip title={`order_id:${record._id}`}>
              <InfoCircleOutlined className='text-2xl' />
            </Tooltip>
          ) : (
            <DeleteOutlined
              onClick={() => getApprove(id)}
              className='text-red-400 text-2xl'
            />
          )}
        </>
      ),
    },
  ]
  const { confirm } = Modal

  const handleDeleteOrder = async (id) => {
    try {
      const { data } = await local.delete('/order/' + id)
      toast.success(data.msg)
      setTableData(data.orders)
    } catch (err) {
      console.log(err)
    }
  }

  const getApprove = (id) => {
    confirm({
      title: 'Are you sure delete this order?',
      icon: <ExclamationCircleOutlined />,
      content: 'You have to claim for money refund!',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDeleteOrder(id)
      },
      onCancel() {},
    })
  }

  // filter Handler
  const filterHandler = (value) => {
    setFilter(value)
    const filteredData = orders.filter((item) => item.status === value)
    setTableData(filteredData)
  }

  return (
    <div className='p-2'>
      <Table
        className='no-scrollbar'
        dataSource={tableData}
        columns={tableColumns}
        loading={loading}
        size='small'
        title={tableHeader}
        bordered='true'
        scroll={{ x: '600px' }}
      />
    </div>
  )
}
