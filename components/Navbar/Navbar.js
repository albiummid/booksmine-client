/* eslint-disable @next/next/no-img-element */
import { SettingOutlined } from '@ant-design/icons/lib/icons'
import {
  AutoComplete,
  Badge,
  Button,
  Dropdown,
  Input,
  Menu,
  Tooltip,
} from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { bookSelector, fetchBooks } from '../../redux/slices/bookSlice'
import {
  departmentSelector,
  fetchDepartments,
} from '../../redux/slices/departmentSlice'
import Authorize from '../../utils/Authorize'
import LoginToggleBtn from '../Layout/LoginToggleBtn'

export default function Navbar(props) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [searchKey, setSearchKey] = useState('')
  const [searchData, setSearchData] = useState([])
  const {
    departments,
    loading: bookLD,
    error: bookERR,
  } = useSelector(departmentSelector)
  const { books, loading: dLD, error: dERR } = useSelector(bookSelector)

  useEffect(() => {
    dispatch(fetchBooks())
    dispatch(fetchDepartments())
  }, [dispatch])

  useEffect(() => {
    setLoading(true)
    if (searchKey.length >= 3) {
      const filteredData = books?.filter((d) =>
        d.title.toLowerCase().includes(searchKey?.toLowerCase())
      )
      setSearchData(filteredData)
      setLoading(false)
    }
    if (searchKey.length === 0) {
      setSearchData([])
      setLoading(false)
    }
  }, [searchKey, books])

  const OptionCard = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 15px;
    .titleBox {
      display: flex;
      gap: 15px;
      img {
        width: 30px;
        height: 42px;
      }
      .textBox {
        p {
          margin: 0;
        }
      }
    }
    .priceBox {
      display: flex;
      align-items: center;
      gap: 5px;
      justify-content: center;
      span {
        color: red;
      }
    }
  `

  const renderItem = ({ title, author, imgUrl, price, discount, _id }) => ({
    key: _id,
    value: title,
    label: (
      <OptionCard key={_id} onClick={() => router.push(`${'/book/' + _id}`)}>
        <div className='titleBox'>
          <Image src={imgUrl} alt={title} height={80} width={50} />
          <div className='textBox'>
            <p className='title'>{title}</p>
            <p className='author'>{author}</p>
          </div>
        </div>
        <div className='priceBox'>
          <span>({discount}% off)</span>
          <div className='price'>{price} Tk.</div>
        </div>
      </OptionCard>
    ),
  })

  const category = (
    <Menu>
      <Menu.SubMenu title='Departmental'>
        {departments?.map((dept) => (
          <Menu.SubMenu title={dept?.name} key={dept._id}>
            {dept?.semesters?.map((semester) => (
              <Menu.Item
                onClick={() =>
                  router.push(
                    `/category/${dept?.departmentCode}-${semester?.semesterCode}`
                  )
                }
                key={semester._id}
              >
                {semester.title}
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu title='Non_Departmental'>
        <Menu.Item>coming soon...</Menu.Item>
      </Menu.SubMenu>
    </Menu>
  )

  return (
    <div className=''>
      <nav className='flex px-1 py-2 gap-1 place-items-center flex-wrap space-x-5 justify-between bg-slate-50 md:justify-evenly'>
        <>
          <Link href={'/'} passHref>
            <img
              className='cursor-pointer w-[150px] md:w-[200px] '
              src={'/images/booksmines.png'}
              alt={'booksmines'}
            />
          </Link>
        </>
        <div className='action_container flex place-items-center gap-2 xl:order-3 md:gap-4 cursor-pointer '>
          <Authorize roleFor={['admin', 'developer', 'editor']}>
            <Link href={'/dashboard'} passHref>
              <Tooltip title={'Dashboard'}>
                <SettingOutlined className='text-xl mt-2 md:text-2xl hidden sm:block' />
              </Tooltip>
            </Link>
          </Authorize>
          <Link href={'/profile/cart'} passHref>
            <Tooltip title={'Cart'}>
              <Badge count={5} showZero={false}>
                <img
                  className='hover:opacity-60 w-5 md:w-6'
                  src={'/images/icons/shopping-bag.svg'}
                  alt={'shopingBag'}
                />
              </Badge>
            </Tooltip>
          </Link>
          <LoginToggleBtn />
        </div>

        <div className='search flex gap-1 w-[100%] md:w-[60%] '>
          <Dropdown
            loading={dLD}
            disabled={dLD}
            overlay={category}
            placement='bottomLeft'
            arrow
          >
            <Button size='medium'>Categories</Button>
          </Dropdown>
          <AutoComplete
            dropdownClassName='certain-category-search-dropdown'
            dropdownMatchSelectWidth={500}
            style={{ width: '100%', textAlign: 'center' }}
            options={searchData?.map((d) => renderItem(d))}
          >
            <Input.Search
              onSearch={(value) =>
                value.length > 0 && router.push(`${'/search/' + value}`)
              }
              allowClear
              style={{ textAlign: 'center', width: '90%' }}
              onChange={(e) => setSearchKey(e.target.value)}
              size='medium'
              placeholder='Write a books title or author name..'
              required={true}
            />
          </AutoComplete>
        </div>
      </nav>
    </div>
  )
}
