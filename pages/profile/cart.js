import { Button, Divider, Form, Input, Steps } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CartCard from '../../components/CartCard/CartCard'
import { cartSelector, getCartData } from '../../redux/slices/cartSlice'

function Cart() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const { cart, cartData } = useSelector(cartSelector)

  useEffect(() => {
    dispatch(getCartData())
  }, [cart])

  const handleOrder = (values) => {
    console.log(values)
  }

  return (
    <div className=''>
      <div className='mx-auto max-w-[600px] px-4'>
        <Steps
          size='small'
          responsive={false}
          className='cursor:pointer'
          current={activeStep}
        >
          <Steps.Step
            className='cursor:pointer'
            onClick={() => setActiveStep(0)}
            title='Cart Review'
          />
          <Steps.Step onClick={() => setActiveStep(1)} title='Confirm Order' />
        </Steps>
      </div>
      {!activeStep ? (
        <>
          <div className='shadow-md shadow-gray-200 ring-1 my-2 w-[400px] p-2 mx-auto'>
            <p>Carted Items: {cart.length}</p>
            <p>Total Price:{cartData.subTotalPrice} Tk.</p>
            <p className='text-center text-green-500'>
              You are saving{' '}
              {cartData.subTotalOriginalPrice - cartData.subTotalPrice} Tk.
            </p>
          </div>
          <div>
            {cart?.map((item) => (
              <CartCard book={item} key={item._id} />
            ))}
          </div>
          <div className='flex'>
            <Button className='mx-auto my-4' onClick={() => setActiveStep(1)}>
              Proceed to Checkout
            </Button>
          </div>
        </>
      ) : (
        <div className='mx-auto max-w-[500px] my-10 rounded-xl shadow-xl py-5 md:px-8 px-2  ring-1'>
          <div>
            <h1 className='text-center'> Checkout Summary</h1>
            <Divider />
            <div className=''>
              {cart.map((item, index) => (
                <div key={item._id} className='flex justify-between'>
                  <p className='w-[70%] text-xs md:text-sm'>
                    <span className='font-bold '>{index + 1}. </span>

                    {item.title}
                  </p>

                  <p className='text-xs md:text-sm'>
                    {item.price} x {item.quantity} ={' '}
                    {item.price * item.quantity} Tk.
                  </p>
                </div>
              ))}
            </div>
            <Divider />

            <div className='flex justify-between text-xs md:text-sm'>
              <p className='font-bold'>SubTotal:</p>
              <p>{cartData.subTotalPrice} Tk.</p>
            </div>
            <div className=' flex justify-between border-b-2 text-xs md:text-sm'>
              <p className='font-bold'>Delivery Charge:</p>
              <p>{cartData.deliverCharge || '00'} Tk.</p>
            </div>
            <div className='flex justify-between text-xs md:text-sm '>
              <p className='font-bold'>Total Bill:</p>
              <p>{cartData.totalPrice} Tk.</p>
            </div>

            <span className='text-orange-400 text-center'>
              Get free delivery on subtolal 1000tk
            </span>
            <Divider>Order Procedure</Divider>
            <p className='text-xs md:text-sm'>
              First of all make send money {cartData.totalPrice} Tk. to{' '}
              <tel>01755977522</tel> . And give us your phone number and TrxID
              of send money. After verifing your payment ,we will process your
              order.
            </p>
            <Divider>Fill Up The Form</Divider>
            <Form onFinish={handleOrder}>
              <div className='flex justify-between m-0 gap-1 px-2'>
                <div className='m-0'>
                  <b>Phone:</b>
                  <Form.Item name={'phone'}>
                    <Input />
                  </Form.Item>
                </div>
                <div>
                  <b>TransactionID :</b>
                  <Form.Item name={'trxId'}>
                    <Input className='' />
                  </Form.Item>
                </div>
              </div>
              <div className='flex my-1'>
                <Button className='mx-auto' htmlType='submit'>
                  Confirm Order
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
