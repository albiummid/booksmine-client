import React from 'react'

export const PlusBtn = (props) => {
  return (
    <>
      <p
        {...props}
        className='rounded-full select-none w-5 h-5 flex justify-center items-center bg-[#212121] ring-1 ring-[#212121] cursor-pointer text-[#f5f5f5] hover:opacity-80'
      >
        +
      </p>
    </>
  )
}
export const MinusBtn = (props) => {
  return (
    <>
      <p
        {...props}
        className=' rounded-full select-none  flex  items-center justify-center w-5 h-5 ring-1 ring-[#212121] text-[#212121] border-[#212121] hover:opacity-80 cursor-pointer '
      >
        -
      </p>
    </>
  )
}
