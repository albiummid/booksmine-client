import { Button, Divider, Form, Input, Steps } from 'antd'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import API from '../../API/API'
import CartCard from '../../components/CartCard/CartCard'
import {
  cartSelector,
  clearCart,
  getCartData,
} from '../../redux/slices/cartSlice'

function Cart() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const { cart, cartData, liteCart } = useSelector(cartSelector)
  const [form] = Form.useForm()
  const { data } = useSession()

  useEffect(() => {
    dispatch(getCartData())
  }, [cart])

  const handleOrder = async ({ trxId, phone }) => {
    const { name, email } = data.user
    const orderObj = {
      trxId,
      status: 'pending',
      totalBill: cartData.totalBill,
      user: {
        name,
        email,
        phone,
      },
      orders: liteCart,
    }
    try {
      const { data } = await API.post('/order/add', orderObj)
      toast.success('Order Completed!')
      dispatch(clearCart())
      form.resetFields()
    } catch (err) {
      toast.error('failed to create order !')
      console.log(err)
    }
  }

  return (
    <div className='flex flex-col'>
      <div className='mx-auto w-full md:max-w-[600px] px-4'>
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
        <div className='mx-auto'>
          <div className='shadow-md shadow-gray-200 ring-1 my-2 min-w-[350px] max-w-[400px] p-2 '>
            <p>Carted Items: {cart.length}</p>
            <p>Total Price:{cartData.subTotalBill} Tk.</p>
            <p className='text-center text-green-500'>
              You are saving{' '}
              {cartData.subTotalOriginalBill - cartData.subTotalBill} Tk.
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
        </div>
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
                    {item.price} x {item.quantity} =
                  </p>
                  <p> {item.price * item.quantity} Tk.</p>
                </div>
              ))}
            </div>
            <Divider />

            <div className='flex justify-between text-xs md:text-sm'>
              <p className='font-bold'>SubTotal:</p>
              <p>{cartData.subTotalBill} Tk.</p>
            </div>
            <div className=' flex justify-between border-b-2 text-xs md:text-sm'>
              <p className='font-bold'>Delivery Charge:</p>
              <p>{cartData.deliverCharge || '00'} Tk.</p>
            </div>
            <div className='flex justify-between text-xs md:text-sm '>
              <p className='font-bold'>Total Bill:</p>
              <p>{cartData.totalBill} Tk.</p>
            </div>

            <span className='text-orange-400 text-center'>
              Get free delivery on subtolal 1000tk
            </span>
            <Divider>Order Procedure</Divider>
            <p className='text-xs md:text-sm'>
              First of all make send money {cartData.totalBill} Tk. to{' '}
              <tel>01755977522</tel> . And give us your phone number and TrxID
              of send money. After verifing your payment ,we will process your
              order.
            </p>
            <Divider>Fill Up The Form</Divider>
            <Form form={form} onFinish={handleOrder}>
              <div className='flex justify-between m-0 gap-1 px-2'>
                <div className='m-0'>
                  <b>Phone:</b>
                  <Form.Item
                    name={'phone'}
                    rules={[
                      { required: true, message: 'Phone number is required' },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div>
                  <b>TransactionID :</b>
                  <Form.Item
                    rules={[
                      { required: true, message: 'Transaction Id is required' },
                    ]}
                    name={'trxId'}
                  >
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
