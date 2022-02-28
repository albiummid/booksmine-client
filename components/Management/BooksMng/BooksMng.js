/* eslint-disable react/jsx-no-target-blank */
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  DeleteTwoTone,
  EditTwoTone,
  PlusOutlined,
} from '@ant-design/icons'
import { Button, Drawer, Form, Input, Select, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import API from '../../../API/API'
import { bookSelector, fetchBooks } from '../../../redux/slices/bookSlice'
import AddBooks from './AddBooks'

const BooksMng = ({ isAcademic }) => {
  const { books } = useSelector(bookSelector)
  const [booksList, setBookList] = useState([])
  const [tableData, setTableData] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeDrawer, setActiveDrawer] = useState(false)
  const [drawerFor, setDrawerFor] = useState(null)
  const [refetch, setRefetch] = useState(false)
  const [edit, setEdit] = useState({})
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchBooks())
  }, [refetch, dispatch])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log('refetchingData!')
  //     setRefetch(!refetch)
  //   }, 60000)
  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [])

  useEffect(() => {
    if (isAcademic) {
      const academicBooks = books.filter((item) => item.category === 'academic')
      setBookList(academicBooks)
      console.log('done from academic')
      return //return means this funcio=
    }
    const nonAcademicBooks = books.filter(
      (item) => item.category !== 'academic'
    )
    setBookList(nonAcademicBooks)
    console.log('done From non academic')
  }, [books, isAcademic])
  useEffect(() => {
    setTableData(booksList)
  }, [booksList])

  useEffect(() => {
    if (edit._id) {
      form.setFieldsValue({
        ...edit,
      })
    }
  }, [edit, form])

  useEffect(() => {
    // d?.[`${activeFilter}`] //for dynamic filter by changing activeFilterState

    if (filter.length) {
      let fData = booksList?.filter(
        (item) =>
          item.title
            .toString()
            .toLowerCase()
            .includes(filter.toLocaleLowerCase()) ||
          item.author
            .toString()
            .toLowerCase()
            .includes(filter.toLocaleLowerCase())
            .includes(filter.toLocaleLowerCase()) ||
          item.originalPrice
            .toString()
            .toLowerCase()
            .includes(filter.toLocaleLowerCase())
            .includes(filter.toLocaleLowerCase()) ||
          item.category
            .toString()
            .toLowerCase()
            .includes(filter.toLocaleLowerCase())
            .includes(filter.toLocaleLowerCase()) ||
          item?.courseCode
            .toString()
            .toLowerCase()
            .includes(filter.toLocaleLowerCase())
      )
      setTableData(fData)
    }
    if (filter.length === 0) {
      setTableData(tableData)
    }
  }, [filter, tableData, books])

  const onReset = () => {
    setEdit({})
    form.resetFields()
  }
  const refetcher = (a) => {
    setRefetch(!refetch)
    setLoading(false)
    if (a) {
      setActiveDrawer(false)
      onReset(true)
    }
  }

  const deleteHandler = (id) => {
    setLoading(true)
    API.delete(`${'/book/' + id}`)
      .then((res) => {
        refetcher()
      })
      .catch((err) => {
        refetcher()
        console.log(err)
      })
  }

  const tableColums = [
    {
      key: 'No',
      title: 'No.',
      width: '50px',
      fixed: 'left',
      height: '100px',
      render: (row) => tableData.indexOf(row) + 1,
      responsive: ['sm'],
    },
    {
      key: 'title',
      title: 'Book Title',
      dataIndex: 'title',
      fixed: 'left',
      sorter: (a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
      //   key:'title'
    },

    {
      key: 'author',
      title: 'Author',
      dataIndex: 'author',
      responsive: ['xl'],
      sorter: (a, b) =>
        a.author.toLowerCase().localeCompare(b.author.toLowerCase()),
      align: 'center',
      //   key:'title'
    },
    {
      title: 'Price',
      key: 'Price',
      dataIndex: 'originalPrice',
      align: 'right',
      width: 100,
      sorter: (a, b) => a.price - b.price,
      render: (text) => <p>{text} ৳ </p>,
      //   key:'title'
    },
    {
      key: 'Discount',
      title: 'Discount',
      dataIndex: 'discount',
      sorter: (a, b) => a.discount - b.discount,
      render: (value, rowData) => (
        <span>
          {value}% =
          {Number(rowData.price) - (Number(rowData.price) * value) / 100} Tk.
        </span>
      ),
      align: 'center',
      responsive: ['lg'],
    },
    {
      key: 'CourseCode',
      title: 'CourseCode',
      dataIndex: 'courseCode',
      //   key:'title'
    },

    {
      key: '._id',
      title: 'inStock',
      dataIndex: 'inStock',
      align: 'center',
      responsive: ['lg'],
      sorter: (a, b) => Number(a.inStock) - Number(b.inStock),
      render: (text, record) =>
        record.inStock === true ? (
          <CheckCircleTwoTone
            style={{ fontSize: '20px' }}
            twoToneColor='#69f0ae'
          />
        ) : (
          <CloseCircleTwoTone
            style={{ fontSize: '20px' }}
            twoToneColor='#d32f2f'
          />
        ),
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
              setEdit(record)
              setActiveDrawer(true)
            }}
            style={{ border: 'none' }}
          >
            <EditTwoTone style={{ fontSize: '20px' }} />
          </Button>
          <Button
            onClick={() => deleteHandler(record._id)}
            style={{ border: 'none' }}
          >
            <DeleteTwoTone style={{ fontSize: '20px' }} twoToneColor='red' />
          </Button>
        </Space>
      ),
    },
  ]
  const { Option } = Select

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
        Books
      </h2>
      <span
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Input
          allowClear
          name='name'
          placeholder={`Search`}
          onChange={(e) => {
            setFilter(e.target.value)
          }}
          style={{ margin: '0px 22px 0 8px', width: '200px' }}
        />
      </span>
      <Button
        onClick={() => {
          setActiveDrawer(true)
          setDrawerFor('add')
          onReset()
        }}
        type='primary'
      >
        <PlusOutlined /> Add New Book
      </Button>
    </div>
  )
  return (
    <>
      <div>
        <Drawer
          title={<h2>{drawerFor === 'add' ? 'Add Book ' : 'Update Book '}</h2>}
          placement='right'
          width={500}
          onClose={() => {
            setActiveDrawer(false)
            setDrawerFor(null)
          }}
          visible={activeDrawer}
        >
          <AddBooks
            form={form}
            editId={edit?._id}
            refetcher={refetcher}
            isAcademic={isAcademic}
          />
        </Drawer>
        <Table
          dataSource={tableData}
          columns={tableColums}
          loading={loading}
          size='small'
          pagination={{
            position: ['bottomRight'],
          }}
          title={tableHeader}
          bordered='true'
          scroll={{ x: '500px' }}
        />
      </div>
    </>
  )
}

export default BooksMng
