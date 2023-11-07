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
  Input,
  Tooltip
} from '@nextui-org/react'
import { Plus, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useDataContext } from './DataContext'

export default function PaymentTable({
  paymentTypes = [],
  onChange = () => {},
  totalPayment = 0
}) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    new Set('2')
  )
  const [paymentDetails, setPaymentDetails] = useState([])
  const [partialPaymentAmount, setPartialPaymentAmount] = useState(
    Number(totalPayment)
  )
  const { dataCliente, dataToSend } = useDataContext()

  const handleAddPayment = () => {
    const totalAmountPaid = paymentDetails.reduce(
      (acc, curr) => acc + curr.cantidad,
      0
    )

    if (totalAmountPaid + partialPaymentAmount > Number(totalPayment)) {
      return toast.error('El pago no puede ser mayor al total.')
    }

    if (selectedPaymentMethod.size > 0) {
      const selectedMethod = paymentTypes.find(
        (type) =>
          type.idtipopago === parseInt(Array.from(selectedPaymentMethod)[0])
      )
      const updatedPaymentDetails = [
        ...paymentDetails,
        { ...selectedMethod, cantidad: Math.abs(partialPaymentAmount) }
      ]

      const groupedPayments = updatedPaymentDetails.reduce((acc, curr) => {
        const found = acc.find((item) => item.idtipopago === curr.idtipopago)
        if (found) {
          found.cantidad += curr.cantidad
        } else {
          acc.push(curr)
        }
        return acc
      }, [])

      setPaymentDetails(groupedPayments)
      onChange(groupedPayments)

      const totalAmountPaid = groupedPayments.reduce(
        (acc, curr) => acc + curr.cantidad,
        0
      )
      setPartialPaymentAmount(Number(totalPayment) - totalAmountPaid)
    } else {
      toast.error('Selecciona un método de pago.')
    }
  }

  const handleRemovePayment = (index) => {
    const updatedPaymentDetails = paymentDetails.filter((_, i) => i !== index)

    const totalAmountPaid = updatedPaymentDetails.reduce(
      (acc, curr) => acc + curr.cantidad,
      0
    )

    setPartialPaymentAmount(Number(totalPayment) - totalAmountPaid)

    setPaymentDetails(updatedPaymentDetails)
    onChange(updatedPaymentDetails)
  }

  const isAddPaymentDisabled =
    paymentDetails.reduce((acc, curr) => acc + curr.cantidad, 0) ===
    Number(totalPayment)

  useEffect(() => {
    setPaymentDetails([])
    onChange([])
  }, [dataToSend.pagoData.tipoComprobante])

  return (
    <>
      <div className='flex items-center gap-x-5 w-full mt-2'>
        <Select
          label='Método de pago'
          labelPlacement='outside'
          variant='flat'
          selectedKeys={selectedPaymentMethod}
          onSelectionChange={setSelectedPaymentMethod}
        >
          {paymentTypes.map((type) => {
            if (type.tipo_pago === 'CONVENIO') return null
            return (
              <SelectItem key={type.idtipopago} value={type.idtipopago}>
                {type.tipo_pago}
              </SelectItem>
            )
          })}
        </Select>
        <Input
          value={String(partialPaymentAmount)}
          onChange={(e) => setPartialPaymentAmount(Number(e.target.value))}
          type='number'
          max={partialPaymentAmount}
          labelPlacement='outside'
          variant='flat'
          label='Cantidad'
        />
        <Button
          className='flex-shrink-0'
          color='primary'
          variant='light'
          isDisabled={
            !Object.keys(dataCliente).length ||
            !!dataCliente.convenio ||
            isAddPaymentDisabled
          }
          startContent={<Plus />}
          onClick={handleAddPayment}
        >
          Agregar pago
        </Button>
      </div>
      <div className='col-start-1 col-end-6'>
        <Table
          removeWrapper
          tabIndex={-1}
          aria-label='Tabla de métodos de pagos elegidos'
        >
          <TableHeader>
            <TableColumn className='bg-blue-100'>#</TableColumn>
            <TableColumn className='bg-blue-100'>MÉTODO</TableColumn>
            <TableColumn className='bg-blue-100'>MONTO PAGADO</TableColumn>
            <TableColumn className='bg-blue-100'>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              !dataCliente.convenio ? (
                'Agregue algún pago para visualizar'
              ) : (
                <p className='text-blue-500'>
                  Este cliente tiene un convenio. No se pueden agregar pagos.
                </p>
              )
            }
          >
            {paymentDetails.map((pago, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{pago.tipo_pago}</TableCell>
                <TableCell>{pago.cantidad.toFixed(2)}</TableCell>
                <TableCell>
                  <div className='relative flex items-center gap-x-1'>
                    <Tooltip content='Eliminar' color='danger' closeDelay={0}>
                      <Button
                        isIconOnly
                        color='danger'
                        variant='light'
                        size='sm'
                        onClick={() => {
                          handleRemovePayment(index)
                        }}
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
      </div>
    </>
  )
}
