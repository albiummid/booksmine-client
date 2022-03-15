// Import Swiper styles
import { Splide, SplideSlide } from '@splidejs/react-splide'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import BookCard from '../components/BookCard/BookCard'
import { bookSelector, fetchBooks } from '../redux/slices/bookSlice'
import MetaData from '../utils/MetaData'

function Home() {
  const { books, loading } = useSelector(bookSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchBooks())
  }, [dispatch])
  // if (loading) return <LoadingSpinner />
  return (
    <>
      <MetaData title={'BooksMine'} />
      <div className='border-green-500 border-dashed text-center cursor-pointer '>
        <h1>BooksMine</h1>

        <h4>On development</h4>

        <div className='mx-auto py-3 flex gap-5 overflow-scroll no-scrollbar'>
          <Splide
            options={{
              type: 'loop',
              autoplay: 'pause',
              rewind: true,
              width: '100%',
              gap: '1rem',
              perPage: 4,
            }}
          >
            {books.length &&
              books.slice(0, 15).map((book) => (
                <SplideSlide key={book._id}>
                  <BookCard book={book} key={book._id} />
                </SplideSlide>
              ))}
          </Splide>
        </div>
      </div>
    </>
  )
}

export default Home
