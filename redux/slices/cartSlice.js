import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
  cart: [],
  loading: false,
  error: null,
  liteCart: [],
  cartData: {
    subTotalBill: null,
    subTotalOriginalBill: null,
    deliveryCharge: null,
    totalBill: null,
  },
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, { payload }) => {
      state.loading = false
      const newItem = payload
      state.cart.push({ ...newItem, quantity: 1 })
    },

    removeFromCart: (state, { payload }) => {
      const id = payload._id
      const existItemIndex = state.cart.findIndex((item) => item._id === id)
      if (existItemIndex >= 0) {
        const newCart = state.cart.filter((item) => item._id !== id)
        state.cart = newCart
      } else {
        toast.error('Product not exists in the cart !')
      }
    },
    quantityIncrement: (state, { payload }) => {
      const id = payload._id
      const itemIndex = state.cart.findIndex((item) => item._id === id)
      if (state.cart[itemIndex].quantity === 5) {
        toast.info("You can't cart an item more than 3 times !")
      } else {
        state.cart[itemIndex].quantity += 1
      }
    },
    quantityDecrement: (state, { payload }) => {
      const id = payload._id
      const itemIndex = state.cart.findIndex((item) => item._id === id)
      if (state.cart[itemIndex].quantity > 1) {
        state.cart[itemIndex].quantity -= 1
      }
    },
    loadCart: (state, { payload }) => {
      state.cart = payload
    },
    getCartData: (state) => {
      const cart = state.cart
      let subTotal = 0
      let subTotalOriginal = 0
      for (let item of cart) {
        subTotal += item.price * item.quantity
        subTotalOriginal += item.originalPrice * item.quantity
      }
      const liteCart = state.cart.map((item) => {
        const data = {
          _id: item._id,
          title: item.title,
          author: item.author,
          quantity: item.quantity,
          price: item.price,
        }
        return data
      })
      state.liteCart = liteCart
      const deliveryCharge = subTotal > 1000 ? 0 : 110
      const total = subTotal + deliveryCharge
      state.cartData = {
        subTotalBill: subTotal,
        totalBill: total,
        deliveryCharge: deliveryCharge,
        subTotalOriginalBill: subTotalOriginal,
      }
    },
    clearCart: (state) => {
      state.cart = []
      state.liteCart = []
      state.cartData = {}
    },
  },
})

export default cartSlice.reducer

export const {
  addToCart,
  loadCart,
  removeFromCart,
  quantityIncrement,
  quantityDecrement,
  getCartData,
  clearCart,
} = cartSlice.actions

export const cartSelector = (state) => state.cart
