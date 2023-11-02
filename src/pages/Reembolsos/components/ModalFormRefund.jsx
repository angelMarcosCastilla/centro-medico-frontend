import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  Textarea,
  getKeyValue,
  useDisclosure
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { createRefund } from '../../../services/refund'
import { listState, statusColorMap } from '../../../constants/state'
import { changeStatus } from '../../../services/admission'
import { createPayment, createPaymentDetail } from '../../../services/pay'
import Prompt from '../../../components/Prompt'
import { validatePassword } from '../../../services/auth'

const allowedStates = ['P', 'PT', 'PP']

const columns = [
  {
    key: 'nombre_servicio',
    label: 'SERVICIO'
  },
  {
    key: 'precio_pagado',
    label: 'PRECIO'
  },
  {
    key: 'descuento',
    label: 'DESCUENTO'
  },
  {
    key: 'estado',
    label: 'ESTADO'
  }
]

export default function ModalFormRefund({
  isOpen,
  onOpenChange,
  paymentData,
  refreshTable
}) {
  const [tabSelected, setTabSelected] = useState('reembolso-completo')
  const [tabsDisabled, setTabsDisabled] = useState([])
  const [reason, setReason] = useState('')
  const [selectedServices, setSelectedServices] = useState(new Set([]))
  const [disabledServices, setDisabledServices] = useState(new Set([]))
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const [loading, setLoading] = useState(false)

  const [inputPassword, setInputPassword] = useState('')

  const {
    isOpen: isOpenPrompt,
    onOpen: onOpenPrompt,
    onOpenChange: onOpenChangePrompt
  } = useDisclosure()

  const adjustPaymentDetails = (paymentDetails, totalRefundAmount) => {
    const updatedPaymentDetails = paymentDetails.map((detail) => ({
      ...detail
    }))

    updatedPaymentDetails.sort(
      (a, b) => parseFloat(a.monto_pagado) - parseFloat(b.monto_pagado)
    )

    for (const paymentDetail of updatedPaymentDetails) {
      if (totalRefundAmount <= 0) {
        break
      }

      const montoPagado = parseFloat(paymentDetail.monto_pagado)

      if (montoPagado > 0) {
        if (totalRefundAmount >= montoPagado) {
          totalRefundAmount -= montoPagado
          paymentDetail.monto_pagado = '0.00'
        } else {
          paymentDetail.monto_pagado = (
            montoPagado - totalRefundAmount
          ).toFixed(2)
          totalRefundAmount = 0
          break
        }
      }
    }

    const updatedDetails = updatedPaymentDetails.filter(
      (detail) => parseFloat(detail.monto_pagado) > 0
    )

    return updatedDetails
  }

  const handleCreateRefund = async (onClose) => {
    try {
      setLoading(true)

      const isPasswordValid = await verifyPassword()

      if (!isPasswordValid) return toast.error('Contraseña incorrecta')

      let totalRefundAmount = parseFloat(paymentData.monto_total)
      let updatedPaymentDetails

      if (tabSelected === 'reembolso-parcial') {
        const selectedServiceIds = Array.from(selectedServices).map(Number)

        const selectedDetails = paymentData.detallesAtencion.filter((item) =>
          selectedServiceIds.includes(item.iddetatencion)
        )

        totalRefundAmount = selectedDetails.reduce((total, item) => {
          const precioPagado = parseFloat(item.precio_pagado) || 0
          return total + precioPagado
        }, 0)

        updatedPaymentDetails = adjustPaymentDetails(
          paymentData.detallesPago,
          totalRefundAmount
        )
      }

      const refundData = {
        idPago: paymentData.idpago,
        tipoReembolso: tabSelected === 'reembolso-completo' ? 'C' : 'P',
        motivoCancelacion:
          tabSelected === 'reembolso-completo'
            ? reason
            : 'Se removieron uno o varios servicios',
        montoCancelado: totalRefundAmount,
        idUsuario: userInfo.idusuario
      }

      const result = await createRefund(refundData)

      if (result.isSuccess) {
        toast.success(result.message)

        if (refundData.tipoReembolso === 'P') {
          const canceledServices = [...selectedServices]
          canceledServices.forEach((id) => changeStatus(id, 'C'))

          const newPaymentData = {
            idAtencion: paymentData.idatencion,
            idCliente: paymentData.idcliente,
            idUsuario: userInfo.idusuario,
            tipoComprobante: paymentData.tipo_comprobante,
            convenio: Number(!!paymentData.convenio),
            montoTotal: paymentData.monto_total - totalRefundAmount,
            saldo: paymentData.saldo
          }
          const resultPayment = await createPayment(newPaymentData)

          if (resultPayment.isSuccess) {
            updatedPaymentDetails.forEach(async (el) => {
              const paymentDetailData = {
                idPago: resultPayment.data,
                idTipoPago: el.idtipopago,
                montoPagado: el.monto_pagado
              }
              await createPaymentDetail(paymentDetailData)
            })
          }
        }

        onClose()
        refreshTable()
      } else {
        toast.error(result.message)
      }
    } catch (err) {
      toast.error('Problemas al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    onOpenChange(false)
    setReason('')
    setSelectedServices(new Set([]))
  }

  const verifyPassword = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('userInfo')).nombre_usuario
      const { data } = await validatePassword(user, inputPassword)

      return data.isValid
    } catch (err) {
      toast.error('Problemas con el servidor')
    }
  }

  const toogleSaveButton =
    (tabSelected === 'reembolso-completo' && reason === '') ||
    (tabSelected === 'reembolso-parcial' &&
      (selectedServices.size === 0 ||
        selectedServices === 'all' ||
        selectedServices.size ===
          paymentData.detallesAtencion.filter((item) => item.estado !== 'C')
            .length))

  useEffect(() => {
    if (Object.keys(paymentData).length > 0) {
      const isEveryElValid = paymentData.detallesAtencion
        .filter((item) => item.estado !== 'C')
        .every((el) => allowedStates.includes(el.estado))

      setTabsDisabled(isEveryElValid ? [] : ['reembolso-completo'])

      setTabSelected(
        isEveryElValid ? 'reembolso-completo' : 'reembolso-parcial'
      )

      const rowsDisabled = new Set(
        paymentData.detallesAtencion
          .filter((item) => !allowedStates.includes(item.estado))
          .map((item) => item.iddetatencion.toString())
      )

      setDisabledServices(rowsDisabled)
    }
  }, [paymentData])

  return (
    <Modal isOpen={isOpen} onOpenChange={handleCloseModal} size='2xl'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h2 className='text-xl'>Formulario de reembolso</h2>
            </ModalHeader>
            <ModalBody>
              <Tabs
                disabledKeys={tabsDisabled}
                aria-label='Tipos de reembolsos'
                color='primary'
                variant='underlined'
                selectedKey={tabSelected}
                onSelectionChange={setTabSelected}
              >
                <Tab key='reembolso-completo' title='Completo'>
                  <Textarea
                    minRows={7}
                    maxRows={7}
                    maxLength={200}
                    placeholder='Escribe el motivo del reembolso'
                    value={reason}
                    onValueChange={setReason}
                  />
                </Tab>
                <Tab key='reembolso-parcial' title='Parcial'>
                  <Table
                    removeWrapper
                    aria-label='Tabla de servicios para reembolsar'
                    selectionMode='multiple'
                    disabledKeys={disabledServices}
                    selectedKeys={selectedServices}
                    onSelectionChange={setSelectedServices}
                    bottomContent={
                      <p className='text-sm select-none	'>
                        Selecciona los servicios que deseas remover...
                      </p>
                    }
                  >
                    <TableHeader columns={columns}>
                      {(column) => (
                        <TableColumn key={column.key}>
                          {column.label}
                        </TableColumn>
                      )}
                    </TableHeader>
                    <TableBody items={paymentData.detallesAtencion}>
                      {(item) => (
                        <TableRow key={item.iddetatencion}>
                          {(columnKey) => {
                            let columnValue

                            switch (columnKey) {
                              case 'descuento':
                                columnValue =
                                  getKeyValue(item, columnKey) || '---'
                                break
                              case 'estado':
                                columnValue = (
                                  <Chip
                                    className={`${
                                      statusColorMap[
                                        getKeyValue(item, columnKey)
                                      ]
                                    }`}
                                  >
                                    {listState[getKeyValue(item, columnKey)]}
                                  </Chip>
                                )
                                break
                              default:
                                columnValue = getKeyValue(item, columnKey)
                                break
                            }
                            return <TableCell>{columnValue}</TableCell>
                          }}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Tab>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button
                type='button'
                color='danger'
                variant='light'
                onPress={onClose}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                color='primary'
                isLoading={loading}
                isDisabled={toogleSaveButton}
                onPress={() => {
                  onOpenPrompt()
                }}
              >
                Guardar
              </Button>
            </ModalFooter>

            <Prompt
              placeholder='Escribe tu contraseña para confirmar'
              type='password'
              isOpen={isOpenPrompt}
              onOpenChange={onOpenChangePrompt}
              input={inputPassword}
              setInput={setInputPassword}
              onConfirm={() => handleCreateRefund(onClose)}
            />
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
