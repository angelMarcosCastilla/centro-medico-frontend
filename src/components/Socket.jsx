
import { io } from 'socket.io-client'
import { BASE_URL_WS } from '../config'
export const socket = io(BASE_URL_WS)

export const Socket = () => {
  return null
}
