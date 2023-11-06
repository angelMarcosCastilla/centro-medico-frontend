import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip
} from '@nextui-org/react'
import { Trash2 } from 'lucide-react'
import React from 'react'

export default function ServiceTable({ detService, setDetService }) {
  const handleCalculateSubTotal = (e, service) => {
    const validateDiscount = () => {
      let discount = e.target.value

      if (discount === '') return 0

      discount = parseFloat(discount.replace(/^0+/, ''))

      if (!isNaN(discount) && discount < service.precio && discount > 0) {
        e.target.value = discount
        return discount
      }

      e.target.value = 0
      return 0
    }

    setDetService((prevService) => {
      return prevService.map((prevService) => {
        return prevService.idservicio === service.idservicio
          ? { ...service, descuento: validateDiscount() }
          : prevService
      })
    })
  }

  const handleRemoveService = (idservice) => {
    setDetService((prevalue) =>
      prevalue.filter((item) => item.idservicio !== idservice)
    )
  }

  return (
    <Table
      removeWrapper
      tabIndex={-1}
      aria-label='Lista de servicios escogidos para el paciente'
    >
      <TableHeader>
        <TableColumn className='bg-blue-100'>SERVICIO</TableColumn>
        <TableColumn className='bg-blue-100'>OBSERVACIÓN</TableColumn>
        <TableColumn className='bg-blue-100'>PRECIO</TableColumn>
        <TableColumn className='bg-blue-100'>DESCUENTO</TableColumn>
        <TableColumn className='bg-blue-100'>SUBTOTAL</TableColumn>
        <TableColumn className='bg-blue-100' align='end'>
          ACCIONES
        </TableColumn>
      </TableHeader>
      <TableBody emptyContent='Agregue algún servicio para visualizar'>
        {detService.map((service) => (
          <TableRow key={service.idservicio}>
            <TableCell>{service.nombre}</TableCell>
            <TableCell>{service.observacion}</TableCell>
            <TableCell>{service.precio}</TableCell>
            <TableCell width={150}>
              <Input
                type='number'
                placeholder='0'
                value={service.descuento}
                onChange={(e) => handleCalculateSubTotal(e, service)}
              />
            </TableCell>
            <TableCell>
              {(service.precio - service.descuento).toFixed(2)}
            </TableCell>
            <TableCell>
              <div className='relative flex items-center gap-x-1'>
                <Tooltip content='Eliminar' color='danger' closeDelay={0}>
                  <Button
                    isIconOnly
                    variant='light'
                    color='danger'
                    size='sm'
                    onClick={() => handleRemoveService(service.idservicio)}
                  >
                    <Trash2 size={20} />
                  </Button>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
