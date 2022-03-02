import { Button, Checkbox, Input, Select, Table } from 'antd'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import API from '../../../API/API'
import DashboardLayout from '../../../components/Layout/DashboardLayout'

const ManageOrders = () => {
  const [refetch, setRefetch] = useState(false)
  const refetcher = () => {
    setRefetch(!refetch)
  }
  const [emailHidden, setEmailHidden] = useState(true)
  const [phoneHidden, setPhoneHidden] = useState(true)
  const [trxIdHidden, setTrxIdHidden] = useState(true)
  const [orders, setOrders] = useState([])
  const [tableData, setTableData] = useState([])
  const [activeFilter, setActiveFilter] = useState('verifying')
  const [trxBalance, setTrxBalance] = useState([
    { trxId: 'albiummid', balance: 1000 },
    { trxId: 'adham', balance: 2000 },
    { trxId: 'rasel', balance: 3000 },
    { trxId: 'asif', balance: 4000 },
  ])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(false)

  const handleOrderStatus = (status, id, title) => {
    setLoading(true)
    API.put('/order/' + id, { status })
      .then((res) => {
        refetcher()
      })
      .catch((err) => {
        toast.error('Got an error !')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!tableData?.length) {
      setActiveFilter('all')
    }
  }, [])

  // Fetching Data
  useEffect(() => {
    setLoading(true)
    const fetchOrderTable = async () => {
      const { data: orderData } =
        activeFilter === 'all'
          ? await API.get('/order/all')
          : await API.get('/order/status/' + activeFilter)
      const { data: trxData } = await API.get('/transaction/all')
      const orderList = orderData.orders
      const trxList = trxData.transactions

      console.log(orderList, trxList)

      //next time this will be on backend
      //on Every trxAdded to the server,It will add the trxBalance to the order Item...

      const mutatedList = orderList?.map((item) => {
        let trxBalance = 0
        trxList.forEach((trx) => {
          if (trx.trxId === item.trxId) {
            trxBalance += trx.trxBalance
          }
        })
        const newItem = {
          ...item,
          trxBalance,
        }
        return newItem
      })

      setOrders(mutatedList)
      setTableData(mutatedList)
      setLoading(false)
    }
    fetchOrderTable()
  }, [refetch, activeFilter])

  // Search Handler
  useEffect(() => {
    if (filter.length > 0) {
      const filtered = orders.filter(
        (item) =>
          item.user.name.toLowerCase().includes(filter.toLocaleLowerCase()) ||
          item.user.email.toLowerCase().includes(filter.toLocaleLowerCase()) ||
          item.user.phone.toLowerCase().includes(filter.toLocaleLowerCase())
      )
      setTableData(filtered)
    } else {
      setTableData(orders)
    }
  }, [filter])

  const tableColumns = [
    {
      key: 'No',
      title: 'No.',
      width: '50px',
      fixed: 'left',
      render: (row) => tableData.indexOf(row) + 1,
      align: 'center',
    },
    {
      key: 'Books List',
      title: 'Books List',
      dataIndex: 'books',
      width: 400,

      render: (bookList) => (
        <div>
          {bookList.map((book, i) => (
            <div key={i} className='flex gap-5 items-center p-2 truncate '>
              <p>#{i + 1}</p>
              <div className=''>
                <p>
                  <span className='font-bold'>Name :</span> {book.title}
                </p>
                <p>
                  <span className='font-bold'>Author:</span> {book.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      ),
    },

    {
      key: 'user',
      title: 'User Name',
      dataIndex: 'user',
      align: 'center',
      render: (user) => <p>{user.name}</p>,
      align: 'center',
      width: 120,
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'user',
      responsive: ['xl'],
      align: 'center',
      width: 250,
      render: (user) => <p>{user.email}</p>,
      hidden: emailHidden,
    },
    {
      key: 'phone',
      title: 'Phone',
      dataIndex: 'user',
      align: 'center',
      render: (user) => <p>{user.phone}</p>,
      hidden: phoneHidden,
      width: 150,
    },
    {
      key: 'TrxId',
      title: 'TrxId',
      dataIndex: 'trxId',
      render: (value) => <span>{value}</span>,
      hidden: trxIdHidden,
      width: 100,
    },
    {
      key: 'Trx balance',
      title: 'Transaction Balance',
      dataIndex: 'trxBalance',
      sorter: (a, b) => a.ratings - b.ratings,
      render: (value) => (value ? <span>{value} ৳ </span> : <span>00 ৳</span>),
      width: 100,
      align: 'center',
    },
    {
      key: 'Bill',
      title: 'Total Bill',
      dataIndex: 'totalBill',
      render: (value) => <span>{value} ৳ </span>,
      width: 100,
      align: 'center',
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      align: 'center',
      render: (value, record) => (
        <>
          <Select
            loading={loading}
            value={
              record.status === 'processing' ? 'Processing' : record.status
            }
            disabled={value === 'delivered' || value === 'pending'}
            onChange={(v) => handleOrderStatus(v, record._id, record.title)}
          >
            {value === 'verifying' && (
              <>
                <Option key={'verifying'}>Verifying</Option>
                <Option key={'pending'}>Pending</Option>
              </>
            )}
            {value === 'pending' && <Option key={'pending'}>Pending</Option>}

            {(value === 'packing' ||
              value === 'processing' ||
              value === 'delivered') && (
              <>
                <Option key={'packing'}>Packing</Option>
                <Option key={'delivered'}>Delivered</Option>
              </>
            )}
          </Select>
        </>
      ),
    },
  ].filter((item) => !item.hidden)
  const { Option } = Select

  useEffect(() => {
    console.log(activeFilter)
    if (activeFilter == 'all') {
      setTableData(orders)
    } else {
      const filtered = orders?.filter((item) => item.status === activeFilter)
      setTableData(filtered)
    }
  }, [activeFilter, orders])

  const tableHeader = () => (
    <div className='flex justify-between'>
      <div>
        <h2 className='text-center'>
          Users Order - ({' '}
          <span className='capitalize text-green-400'>{activeFilter} </span>)
        </h2>
        <div className='flex'>
          <Checkbox
            onChange={() => setEmailHidden(!emailHidden)}
            checked={!emailHidden}
          >
            Email
          </Checkbox>
          <Checkbox
            onChange={() => setPhoneHidden(!phoneHidden)}
            checked={!phoneHidden}
          >
            Phone
          </Checkbox>
          <Checkbox
            onChange={() => setTrxIdHidden(!trxIdHidden)}
            checked={!trxIdHidden}
          >
            TrxId
          </Checkbox>
        </div>
      </div>

      <span
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '15px',
        }}
      >
        <Input
          allowClear
          placeholder={`Search name, email or phone`}
          onChange={(e) => {
            setFilter(e.target.value)
          }}
          style={{ margin: '0px 22px 0 8px', width: '200px' }}
        />
        <Select
          style={{ width: 150 }}
          value={activeFilter}
          onChange={(value) => setActiveFilter(value)}
        >
          <Option key='1' value='verifying'>
            Verifying
          </Option>
          <Option key='1' value='pending'>
            Pending
          </Option>
          <Option key='2' value='processing'>
            Processing
          </Option>
          <Option key='3' value='packing'>
            Packing
          </Option>
          <Option key='5' value='delivered'>
            Delivered
          </Option>
          <Option key={'4'} value='all'>
            All Orders
          </Option>
        </Select>

        <Button type='primary' onClick={refetcher}>
          Refresh
        </Button>
      </span>
    </div>
  )

  return (
    <DashboardLayout>
      <Table
        dataSource={tableData}
        columns={tableColumns}
        size='small'
        loading={loading}
        title={tableHeader}
        bordered='true'
        scroll={{ x: '500px' }}
      />
    </DashboardLayout>
  )
}

export default ManageOrders
