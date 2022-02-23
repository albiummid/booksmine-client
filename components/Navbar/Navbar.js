import { SettingOutlined, SettingTwoTone } from '@ant-design/icons/lib/icons'
import { async } from '@firebase/util'
import {
  AutoComplete,
  Badge,
  Button,
  Dropdown,
  Input,
  Menu,
  Tooltip,
} from 'antd'
import { getSession, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { bookSelector, fetchBooks } from '../../redux/slices/bookSlice'
import {
  fetchDepartments,
  departmentSelector,
} from '../../redux/slices/departmentSlice'
import Authorize from '../Authorize/Authorize'
import LoginToggleBtn from '../Layout/LoginToggleBtn'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

export default function Navbar(props) {
  const dispatch = useDispatch()
  const router = useRouter()
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
    if (searchKey.length >= 3) {
      const filteredData = books?.filter((d) =>
        d.title.toLowerCase().includes(searchKey?.toLowerCase())
      )
      setSearchData(filteredData)
    }
    if (searchKey.length === 0) {
      setSearchData([])
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
    <nav className='flex px-3 py-3 items-center justify-evenly  flex-wrap lg:justify-between bg-gray-50'>
      <>
        <Link href={'/'} passHref>
          <Image
            className='cursor-pointer '
            src={'/images/booksmines.png'}
            width={200}
            height={50}
            alt={'booksmines'}
          />
        </Link>
      </>
      <div className='action_container flex items-center gap-4 md:order-3 cursor-pointer '>
        <Authorize roleFor={['admin', 'developer', 'editor']}>
          <Link href={'/dashboard'} passHref>
            <Tooltip title={'Dashboard'}>
              <SettingOutlined style={{ fontSize: '22px' }} />
            </Tooltip>
          </Link>
        </Authorize>
        <Link href={'/profile/cart'} passHref>
          <Tooltip title={'Cart'}>
            <Badge count={5} showZero={false}>
              <Image
                className='hover:opacity-60'
                src={'/images/icons/shopping-bag.svg'}
                alt={'shopingBag'}
                height={30}
                width={25}
              />
            </Badge>
          </Tooltip>
        </Link>
        <LoginToggleBtn />
      </div>

      <div className='search flex gap-3  '>
        <Dropdown
          loading={dLD}
          disabled={dLD}
          overlay={category}
          placement='bottomLeft'
          arrow
        >
          <Button size='large'>Categories</Button>
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
            style={{ textAlign: 'center' }}
            onChange={(e) => setSearchKey(e.target.value)}
            size='large'
            placeholder='Write a books title or author name..'
            required={true}
          />
        </AutoComplete>
      </div>
    </nav>
  )
}
