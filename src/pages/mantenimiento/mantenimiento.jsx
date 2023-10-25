import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Mantenimiento() {
  return (
    <div className='p-5 overflow-hidden'>
      <Outlet />
    </div>
  )
}
