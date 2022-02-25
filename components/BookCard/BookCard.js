import {
  HeartFilled,
  HeartOutlined,
  ShoppingFilled,
  ShoppingOutlined,
} from '@ant-design/icons/lib/icons'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addToCart,
  cartSelector,
  removeFromCart,
} from '../../redux/slices/cartSlice'
import {
  doFavorite,
  favoriteSelector,
  undoFavorite,
} from '../../redux/slices/favoriteSlice'

export default function BookCard({ book }) {
  const dispatch = useDispatch()
  const { favorites } = useSelector(favoriteSelector)
  const { cart } = useSelector(cartSelector)
  const [isFavorite, setIsFavorite] = useState(null)
  const [isCarted, setIsCarted] = useState(null)
  const {
    _id,
    title,
    author,
    imgUrl,
    ratings,
    originalPrice,
    isStock,
    inStock,
    category,
    price,
    discount,
  } = book

  // Checking isFavorite
  useEffect(() => {
    if (favorites.length) {
      const index = favorites.findIndex((item) => item === _id)
      if (index >= 0) {
        setIsFavorite(true)
      } else {
        setIsFavorite(false)
      }
    } else {
      setIsFavorite(false)
    }
  }, [favorites, _id])

  // Checking isCarted
  useEffect(() => {
    if (cart.length) {
      const index = cart.findIndex((item) => item._id === _id)
      if (index >= 0) {
        setIsCarted(true)
      } else {
        setIsCarted(false)
      }
    } else {
      setIsCarted(false)
    }
  }, [cart, _id])

  if (isFavorite === null || isCarted === null) null
  return (
    <div
      className='book__container rounded-xl shadow-md shadow-gray-500 w-[120px] md:w-[180px] '
      key={_id}
    >
      <div className='image__container'>
        <Image
          className='rounded-t-xl'
          src={imgUrl}
          width={180}
          height={220}
          alt={title}
        />
      </div>
      <div className='info__container mx-2'>
        <p className='text-[.65rem] md:text-xs font-medium truncate ...'>
          {title}
        </p>
        <p className='text-[.65rem] md:text-xs text-gray-400  truncate ...'>
          By - {author}
        </p>
      </div>
      <div className='action__container flex justify-between items-center mx-1 md:mx-3 py-1 rounded-b-xl'>
        <>
          <p className='font-bold text-xs md:text-xl text-red-400'>
            ৳{price}
            <sup>
              <del className='text-[.65rem] md:text-xs font-medium text-gray-500'>
                ৳{originalPrice}
              </del>
            </sup>
          </p>
        </>
        <div className='action flex justify-center items-center gap-2 md:gap-2'>
          <div className='favorite'>
            {isFavorite ? (
              <HeartFilled
                onClick={() => dispatch(undoFavorite(_id))}
                twoToneColor='#eb2f96'
                className='text-sm md:text-[20px] hover:opacity-70 text-red-400 '
              />
            ) : (
              <HeartOutlined
                onClick={() => dispatch(doFavorite(_id))}
                twoToneColor='#eb2f96'
                className='text-sm md:text-[20px] hover:opacity-70 text-gray-400 '
              />
            )}
          </div>
          <div>
            {isCarted ? (
              <ShoppingFilled
                onClick={() => dispatch(removeFromCart(book))}
                className='text-sm md:text-[20px] hover:opacity-70 text-orange-400'
              />
            ) : (
              <ShoppingOutlined
                onClick={() => dispatch(addToCart(book))}
                className='text-sm md:text-[20px] hover:opacity-70 text-orange-400'
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
