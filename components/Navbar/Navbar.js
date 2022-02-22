import { async } from '@firebase/util'
import { Button } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import {
  getBooks,
  bookSelector,
  fetchBooks,
} from '../../redux/slices/bookSlice'
import LoginToggleBtn from '../Layout/LoginToggleBtn'

export default function Navbar() {
  const dispatch = useDispatch()
  const { books, loading, error } = useSelector(bookSelector)

  useEffect(() => {
    dispatch(fetchBooks())
  }, [dispatch])

  return (
    <div className='flex items-center justify-between px-5'>
      <Link href={'/'} passHref>
        <Image
          className='cursor-pointer'
          src={'/images/booksmines.png'}
          width={200}
          height={50}
          alt={'booksmines'}
        />
      </Link>
      <p>We got {books.length} books</p>
      <Button onClick={() => dispatch(getBooks())}>Run get Book</Button>
      <LoginToggleBtn />
    </div>
  )
}
