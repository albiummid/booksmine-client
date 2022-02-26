/* eslint-disable @next/next/no-img-element */
import { CloseOutlined } from '@ant-design/icons/lib/icons'
import React from 'react'
import { useDispatch } from 'react-redux'
import {
  quantityDecrement,
  quantityIncrement,
  removeFromCart,
} from '../../redux/slices/cartSlice'
import { MinusBtn, PlusBtn } from '../Layout/QuantityBtns'

export default function CartCard({ book }) {
  const dispatch = useDispatch()
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
    quantity,
  } = book
  return (
    <>
      <div className='cart__container flex  items-center justify-center gap-2 shadow-md shadow-gray-200 my-3 min-w-[350px] max-w-[400px] '>
        <div className='img__container '>
          <img className='w-[50px]' src={imgUrl} alt={imgUrl} />
        </div>
        <div className='info__container w-[60%]'>
          <p className='font-bold truncate'>{title}</p>
          <p className='text-gray-400'>{author}</p>
          <p className='font-bold text-orange-400'>
            {price} Tk.{' '}
            <sup>
              <del className='text-red-400'>{originalPrice}tk.</del>
            </sup>
          </p>
        </div>
        <div className='action__container flex flex-col my-2 gap-10 '>
          <CloseOutlined
            onClick={() => dispatch(removeFromCart(book))}
            className='text-red-400 ml-auto '
          />
          <div className='quantity_container flex gap-2'>
            <MinusBtn onClick={() => dispatch(quantityDecrement(book))} />
            <p className='font-bold'>0{quantity}</p>
            <PlusBtn onClick={() => dispatch(quantityIncrement(book))} />
          </div>
        </div>
      </div>
    </>
  )
}
