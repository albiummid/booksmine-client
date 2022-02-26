import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
  cart: [],
  loading: false,
  error: null,
  cartData: {
    subTotalPrice: null,
    subTotalOriginalPrice: null,
    deliveryCharge: null,
    totalPrice: null,
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
      toast.success(`The book '${payload.title}' added to cart.`)
    },

    removeFromCart: (state, { payload }) => {
      const id = payload._id
      const existItemIndex = state.cart.findIndex((item) => item._id === id)
      if (existItemIndex >= 0) {
        const newCart = state.cart.filter((item) => item._id !== id)
        state.cart = newCart
        toast.info('The book removed from cart ')
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
      if (state.cart[itemIndex].quantity === 1) {
        toast.info('Quantity have to minimum 1')
      } else {
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
      const deliveryCharge = subTotal > 1000 ? 0 : 110
      const total = subTotal + deliveryCharge
      state.cartData = {
        subTotalPrice: subTotal,
        totalPrice: total,
        deliveryCharge: deliveryCharge,
        subTotalOriginalPrice: subTotalOriginal,
      }
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
} = cartSlice.actions

export const cartSelector = (state) => state.cart
