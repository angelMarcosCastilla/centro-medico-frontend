import { useEffect } from 'react'
import { io } from 'socket.io-client'

export const Socket = () => {
  const socket = io('http://localhost:3000/')

  const handleClick = () => {
    socket.emit('client:click', 'click en el botón')
  }

  useEffect(() => {
    socket.on('server:hello', (args) => {
      console.log(args)
    })

    socket.on('server:resclick', (args) => {
      console.log(args)
    })
  }, [])

  return <button onClick={handleClick}>Click me!</button>
}
