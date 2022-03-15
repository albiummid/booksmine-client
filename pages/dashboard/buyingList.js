import { DownloadOutlined } from '@ant-design/icons'
import { Button, Input, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { CSVLink } from 'react-csv'
import API from '../../API/API'
import DashboardLayout from '../../components/Layout/DashboardLayout'

const OrderedBooks = () => {
  const [buyingList, setBuyingList] = useState([])
  const [tableData, setTableData] = useState([])
  const [csvData, setCsvData] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState('title')
  const [totalCost, setTotalCost] = useState(0)
  const [buyingOrders, setBuyingOrders] = useState([])
  const [fetch, setFetch] = useState(true)

  useEffect(() => {
    setLoading(true)
    API.get('/order/buyingList')
      .then(({ data }) => {
        setTotalCost(data.totalCost)
        setBuyingList(data.buyingList)
        setTableData(data.buyingList)
        setBuyingOrders(data.buyingOrders)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [fetch])

  const reFetch = () => {
    setFetch(!fetch)
  }

  useEffect(() => {
    if (buyingList.length) {
      const temp = buyingList?.map((d) => {
        return {
          Title: d.title,
          Author: d.author,
          Quantity: d.quantity,
          Price: d.price,
          TotalCost: d.price * d.quantity,
        }
      })
      setCsvData(temp)
    }
  }, [buyingList])

  useEffect(() => {
    if (filter.length > 0) {
      const temp = buyingList.filter(
        (item) =>
          item.title.toLowerCase().includes(filter.toLowerCase()) ||
          item.author.toLowerCase().includes(filter.toLowerCase())
      )
      setTableData(temp)
    } else {
      setTableData(buyingList)
    }
  }, [filter, activeFilter])

  const confirmBuy = async (orders) => {
    try {
      const { data } = await API.put('/order/updateOrders/', {
        orders,
      })
      reFetch()
    } catch (err) {
      console.log(err)
    }
  }

  const tableColumns = [
    {
      key: 'No',
      title: 'No.',
      width: 10,
      align: 'center',
      render: (row) => tableData.indexOf(row) + 1,
    },
    {
      key: 'title',
      title: 'Book Title',
      dataIndex: 'title',
      width: 200,
      sorter: (a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
    },

    {
      key: 'author',
      title: 'Author',
      dataIndex: 'author',
      width: 100,
      sorter: (a, b) =>
        a.author.toLowerCase().localeCompare(b.author.toLowerCase()),
      align: 'left',
    },
    {
      title: 'Price',
      key: 'Price',
      dataIndex: 'price',
      align: 'left',
      width: 80,
      sorter: (a, b) => a.price - b.price,
      render: (value, record) => (
        <p className='flex gap-2'>
          <span>
            {value} x {record.quantity} =
          </span>
          <span> {value * record.quantity} ৳ </span>
        </p>
      ),
      //   key:'title'
    },
    {
      key: 'quantity',
      title: 'Quantity',
      dataIndex: 'quantity',
      align: 'center',
      width: 30,
      sorter: (a, b) =>
        a.quanity?.toLowerCase().localeCompare(b.quantity.toLowerCase()),
      render: (text, record) => <b>{text}</b>,
    },
  ]

  const tableHeader = () => (
    <div className='flex flex-wrap justify-between mx-3'>
      <h2 className='text-center' style={{ margin: '0 auto' }}>
        Books Buying List
      </h2>
      <span className='flex justify-center gap-2'>
        <Input
          allowClear
          name='name'
          placeholder={`Search By ${activeFilter.toUpperCase()}`}
          onChange={(e) => {
            setFilter(e.target.value)
          }}
          style={{ margin: '0px 22px 0 8px', width: '200px' }}
        />
        <CSVLink filename={'Book Order List.csv'} data={csvData}>
          <Button type='primary'>
            <DownloadOutlined />
            Excel Sheet
          </Button>
        </CSVLink>

        <Button type='primary' onClick={reFetch}>
          Refresh
        </Button>
      </span>
    </div>
  )
  return (
    <DashboardLayout>
      <Table
        id='capture'
        dataSource={tableData}
        columns={tableColumns}
        loading={loading}
        size='small'
        pagination={{
          position: ['bottomRight'],
        }}
        title={tableHeader}
        bordered='true'
        footer={() => (
          <div
            className='flex justify-between items-center'
            style={{ width: '100%' }}
          >
            <p style={{ textAlign: 'center' }}>
              Total Book Buying Cost = {totalCost} Tk.
            </p>
            <Button
              disabled={!buyingList.length}
              onClick={() => confirmBuy(buyingOrders)}
            >
              Confirm Buy
            </Button>
          </div>
        )}
        scroll={{ x: '500px' }}
      />
    </DashboardLayout>
  )
}

export default OrderedBooks
