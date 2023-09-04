import { Radio } from '@nextui-org/react'
import React from 'react'

export default function CustonRadio({ value, children }) {
  return (
    <Radio
      
      value={value}
      className='inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between
          flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent
          data-[selected=true]:border-primary'
    >
      {children}
    </Radio>
  )
}
