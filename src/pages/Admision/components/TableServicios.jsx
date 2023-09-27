import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react'
import { Trash2 } from 'lucide-react'
import React from 'react'

export default function TableServicios({ detService, setDetService }) {
  const handleCalculateSubTotal = (e, service) => {
    const getValue = () => {
      if (e.target.value === '') return ''

      const descuento = parseFloat(e.target.value)
      if (descuento < service.precio && descuento > 0) return descuento
      return ''
    }

    setDetService((prevService) => {
      return prevService.map((prevService) => {
        return prevService.idservicio === service.idservicio
          ? { ...service, descuento: getValue() }
          : prevService
      })
    })
  }

  const handleRemoveServices = (idservice) => {
    setDetService((prevalue) =>
      prevalue.filter((item) => item.idservicio !== idservice)
    )
  }
  return (
    <Table removeWrapper>
      <TableHeader>
        <TableColumn className='bg-blue-50'>SERVICIO</TableColumn>
        <TableColumn className='bg-blue-50'>DESCRIPCIÓN</TableColumn>
        <TableColumn className='bg-blue-50'>PRECIO</TableColumn>
        <TableColumn className='bg-blue-50'>DESCUENTO</TableColumn>
        <TableColumn className='bg-blue-50'>SUBTOTAL</TableColumn>
        <TableColumn className='bg-blue-50'>ACCIÓN</TableColumn>
      </TableHeader>
      <TableBody emptyContent='Agrega algún servicio para visualizar'>
        {detService.map((service) => (
          <TableRow key={service.idservicio}>
            <TableCell>{service.nombre} </TableCell>
            <TableCell>{service.observacion}</TableCell>
            <TableCell>{service.precio}</TableCell>
            <TableCell>
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
              <div className='relative flex items-center gap-2'>
                <Button
                  isIconOnly
                  variant='light'
                  color='danger'
                  onClick={() => handleRemoveServices(service.idservicio)}
                >
                  <Trash2 size={20} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
