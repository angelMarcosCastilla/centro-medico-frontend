import { Radio } from '@nextui-org/react'

export default function CustomRadio({ value, children }) {
  return (
    <Radio
      value={value}
      className='inline-flex m-0 bg-slate-100 hover:bg-content2 items-center justify-between
          flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-3 border-transparent
          data-[selected=true]:border-primary'
    >
      {children}
    </Radio>
  )
}
