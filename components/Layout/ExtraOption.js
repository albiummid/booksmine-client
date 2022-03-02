import { Select } from 'antd'
import React from 'react'

export default function ExtraOption({ children, setSelectedCategory, _id }) {
  return <Select.Option>{children}</Select.Option>
}
