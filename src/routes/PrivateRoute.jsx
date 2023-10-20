import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { Navigate, Outlet } from 'react-router-dom'
import { Spinner } from '@nextui-org/react'
import NoAuthorization from '../components/NoAuthorization'
import { Socket } from '../components/Socket'

export default function PrivateRoute() {
  const [isValidating, setIsValidating] = useState(true)

  const { logout, isValidateAuth, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isValidateAuth) return

    axios.get('/auth/validatetoken').then(({ data }) => {
      if (!data.isValid) {
        logout()
      }
      setIsValidating(false)
    })
  }, [])

  if (!isAuthenticated) return <Navigate to='/' />

  if (isValidating && !isValidateAuth)
    return (
      <div className='h-screen w-screen grid place-content-center'>
        <Spinner
          label='Validando credenciales...'
          color='primary'
          labelColor='primary'
        />
      </div>
    )
  return (
    <>
      <NoAuthorization />
      <Socket />
      <Outlet />
    </>
  )
}
