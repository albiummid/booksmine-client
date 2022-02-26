import { Button, Result } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'

export default function OrderList() {
  const router = useRouter()
  let orderId = router.query.orderId

  if (orderId?.length)
    return (
      <Result
        status='success'
        title='Successfully ordered the book ${}'
        subTitle={`Order number:${orderId}  Cloud server configuration takes 1-5 minutes, please wait.`}
        extra={[
          <Button
            onClick={() => router.push('/profile/order-list')}
            type='primary'
            key='orderList'
          >
            View Order List
          </Button>,
          <Button key='buy' onClick={() => router.push('/')}>
            Buy Again
          </Button>,
        ]}
      />
    )

  return (
    <div>
      <h1>Order List Page !</h1>

      <p>
        If has new orderID then show the confirmation dialog and then show the
        order list table..
      </p>
      <div>
        {router.query.orderId && (
          <p>Your last order id: {router.query.orderId}</p>
        )}
      </div>
    </div>
  )
}
