import { Badge } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BookCard from '../components/BookCard/BookCard'
import { bookSelector, fetchBooks } from '../redux/slices/bookSlice'
function Home() {
  const { books, loading } = useSelector(bookSelector)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchBooks())
  }, [])
  if (loading) return null
  return (
    <div className='border-green-500 border-dashed text-center cursor-pointer '>
      <h1>Booksmine</h1>
      <h4>On development</h4>
      <div className='mx-auto py-3 flex gap-5 overflow-scroll no-scrollbar'>
        {books.length &&
          books.slice(0, 20).map((book) =>
            book.discount > 0 ? (
              <Badge.Ribbon
                color={'volcano'}
                key={book._id}
                text={`${book.discount}% off !`}
              >
                <BookCard book={book} key={book._id} />
              </Badge.Ribbon>
            ) : (
              <BookCard book={book} key={book._id} />
            )
          )}
      </div>
    </div>
  )
}

export default Home
