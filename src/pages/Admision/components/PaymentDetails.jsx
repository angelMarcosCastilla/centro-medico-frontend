import {
  Button,
  Select,
  SelectItem,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Table,
  Input
} from '@nextui-org/react'
import { Plus, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function PaymentDetails({
  tipoPagos = [],
  onChange = () => {},
  totalPayment = 0
}) {
  const [selectedMetodoPago, setSelectedMetodoPago] = useState(new Set('2'))
  const [detPago, setDetPago] = useState([])
  const [countPartialPayment, setCountPartialPayment] = useState(
    Number(totalPayment)
  )

  const handleAgregarPago = () => {
    // vemos que el pago no sea mayor al total
    const cantTotal = detPago.reduce((acc, curr) => acc + curr.cantidad, 0)
    if (cantTotal + countPartialPayment > Number(totalPayment)) {
      toast.error('El pago no puede ser mayor al total.')
      return
    }

    // agregamos el pago
    if (selectedMetodoPago.size > 0) {
      const metodoPagoSeleccionado = tipoPagos.data.find(
        (pago) =>
          pago.idtipopago === parseInt(Array.from(selectedMetodoPago)[0])
      )

      const paymentDetails = [
        ...detPago,
        { ...metodoPagoSeleccionado, cantidad: countPartialPayment }
      ]
      setDetPago(paymentDetails)
      onChange(paymentDetails)

      const cantTotal = paymentDetails.reduce(
        (acc, curr) => acc + curr.cantidad,
        0
      )
      setCountPartialPayment(Number(totalPayment) - cantTotal)
    } else {
      toast.error('Selecciona un método de pago.')
    }
  }

  const handleRemovePay = (index) => {
    const newPayment = detPago.filter((_, i) => i !== index)

    // cada vez que agregamos un detalle de pago asignamos lo que resta al input de cantidad
    const cantTotal = newPayment.reduce((acc, curr) => acc + curr.cantidad, 0)
    setCountPartialPayment(Number(totalPayment) - cantTotal)

    setDetPago(newPayment)
    onChange(newPayment)
  }

  const disableButton =
    detPago.reduce((acc, curr) => acc + curr.cantidad, 0) ===
    Number(totalPayment)

  return (
    <>
      <div className='flex items-center gap-x-5 w-full mt-2'>
        <Select
          label='Método de pago'
          labelPlacement='outside'
          variant='flat'
          size='lg'
          selectedKeys={selectedMetodoPago}
          onSelectionChange={setSelectedMetodoPago}
        >
          {tipoPagos.data &&
            tipoPagos.data.map((tipoPago) => (
              <SelectItem key={tipoPago.idtipopago} value={tipoPago.idtipopago}>
                {tipoPago.tipo_pago}
              </SelectItem>
            ))}
        </Select>
        <Input
          value={String(countPartialPayment)}
          onChange={(e) => setCountPartialPayment(Number(e.target.value))}
          size='lg'
          type='number'
          max={countPartialPayment}
          labelPlacement='outside'
          variant='flat'
          label='Cantidad'
        />
        <Button
          className='flex-shrink-0'
          color='primary'
          size='lg'
          variant='light'
          isDisabled={disableButton}
          startContent={<Plus />}
          onClick={handleAgregarPago}
        >
          Agregar pago
        </Button>
      </div>
      <div className='col-start-1 col-end-6'>
        <Table aria-label='Tabla de métodos de pagos elegidos' removeWrapper>
          <TableHeader>
            <TableColumn className='bg-red-50'>#</TableColumn>
            <TableColumn className='bg-red-50'>MÉTODO</TableColumn>
            <TableColumn className='bg-red-50'>MONTO PAGADO</TableColumn>
            <TableColumn className='bg-red-50'>ACCIÓN</TableColumn>
          </TableHeader>
          <TableBody emptyContent='Agrega algún método de pago para visualizar'>
            {detPago.map((pago, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{pago.tipo_pago}</TableCell>
                <TableCell>{pago.cantidad.toFixed(2)}</TableCell>
                <TableCell>
                  <div className='relative flex items-center gap-2'>
                    <Button
                      isIconOnly
                      color='danger'
                      variant='light'
                      size='md'
                      onClick={() => {
                        handleRemovePay(index)
                      }}
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
