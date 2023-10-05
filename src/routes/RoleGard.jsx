import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function RoleGard({ listRoles, children }) {
  const { userInfo } = useAuth()

  if (!listRoles.includes(userInfo.nivel_acceso))
    return <Navigate to='/no-autorizado' replace={true} />

  return <>{children}</>
}
