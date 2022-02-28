import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons/lib/icons'
import { Button, Modal, Select, Table, Tooltip } from 'antd'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import API from '../../API/API'
import { fetchOrders, userSelector } from '../../redux/slices/userSlice'

export default function OrderList() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { data } = useSession()
  let orderId = router.query?.orderId
  const { orders, loading } = useSelector(userSelector)
  const [tableData, setTableData] = useState([])
  const [filter, setFilter] = useState('Filter By')
  const lastOrder = orders?.find((item) => item._id === orderId)

  useEffect(() => {
    setTableData(orders)
  }, [orders])

  useEffect(() => {
    dispatch(fetchOrders(data.user.email))
  }, [dispatch, data])

  // if (lastOrder)
  //   return (
  //     <Result
  //       status='success te'
  //       title={`You have successfully order ${lastOrder?.orders?.length} books with different quantities.`}
  //       subTitle={`Order number: "${lastOrder._id}", total bill was ${lastOrder.totalBill}Tk. and transactionID was "${lastOrder.trxId} ".Your order now on pending due to verify payment,takes 1-5 minutes...`}
  //       extra={[
  //         <Button
  //           onClick={() => router.push('/profile/order-list')}
  //           type='primary'
  //           key='orderList'
  //         >
  //           View Order List
  //         </Button>,
  //         <Button key='buy' onClick={() => router.push('/')}>
  //           Buy Again
  //         </Button>,
  //       ]}
  //     />
  //   )

  // Table Funtionality
  const tableHeader = () => (
    <div className='min-h-[40px] flex flex-wrap justify-evenly'>
      <h2 className='text-center w-[60%]'>Order List</h2>
      <div className='flex gap-2'>
        <Select
          className='ml-auto'
          onChange={filterHandler}
          value={filter}
          style={{ width: 110 }}
        >
          <Option value={'done'}>Done</Option>
          <Option value={'pending'}>Pending</Option>
          <Option value={'processing'}>Processing</Option>
          <Option value={'delivered'}>Delivered</Option>
        </Select>
        <Button
          onClick={() => {
            setFilter('Filter By')
            setTableData(orders)
          }}
        >
          Clear Filter
        </Button>
      </div>
    </div>
  )
  const { Option } = Select

  const tableColumns = [
    {
      key: 'No',
      title: 'No.',
      width: '50px',
      fixed: 'left',
      align: 'center',
      height: '100px',
      render: (row) => tableData.indexOf(row) + 1,
      width: 50,
    },

    {
      key: 'books',
      title: 'Book Name',
      dataIndex: 'books',
      render: (bookList) => (
        <div>
          {bookList.map((book, i) => (
            <div key={i} className='flex gap-5 items-center p-2'>
              <p>#{i + 1}</p>
              <div>
                <p>
                  <span className='font-bold'>Name :</span> {book.title}
                </p>
                <p>
                  <span className='font-bold'>Author:</span> {book.author}
                </p>
                <p>
                  <span className='font-bold'>Total bill = </span>
                  {book.price}Tk. x {book.quantity} ={' '}
                  {book.price * book.quantity}Tk.
                </p>
              </div>
            </div>
          ))}
        </div>
      ),
      width: 300,
    },
    {
      key: 'bill',
      title: 'Total Bill',
      dataIndex: 'totalBill',
      width: 80,
      render: (bill) => <p>{bill}</p>,
      width: 80,
      align: 'center',
    },
    {
      key: 'status',
      title: 'Status',
      width: 100,
      dataIndex: 'status',
      render: (status) => <p className='capitalize'>{status}</p>,
      width: 80,
      align: 'center',
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
      const { data } = await API.delete('/order/' + id)
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
