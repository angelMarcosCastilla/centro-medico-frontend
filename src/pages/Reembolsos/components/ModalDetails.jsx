import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@nextui-org/react'
import { formatDate } from '../../../utils/date'
import {
  TIPO_COMPROBANTE,
  listState,
  statusColorMap
} from '../../../constants/state'

export default function ModalDetails({ isOpen, onOpenChange, detail }) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => onOpenChange(false)}
      size='2xl'
      scrollBehavior='inside'
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h2 className='text-xl'>Detalles del comprobante</h2>
            </ModalHeader>
            <ModalBody>
              <div className='gap-4'>
                <div className='mb-4'>
                  <h3 className='text-lg font-semibold mb-1'>
                    Información General
                  </h3>
                  <table className='w-full'>
                    <tbody>
                      <tr className='text-gray-600'>
                        <td className='font-bold'>Paciente:</td>
                        <td>{detail.paciente}</td>
                      </tr>
                      <tr className='text-gray-600'>
                        <td className='font-bold'>Cliente:</td>
                        <td>{detail.cliente}</td>
                      </tr>
                      <tr className='text-gray-600'>
                        <td className='font-bold'>Tipo de Comprobante:</td>
                        <td>{TIPO_COMPROBANTE[detail.tipo_comprobante]}</td>
                      </tr>
                      <tr className='text-gray-600'>
                        <td className='font-bold'>N° Comprobante:</td>
                        <td>{detail.num_comprobante || '---'}</td>
                      </tr>
                      <tr className='text-gray-600'>
                        <td className='font-bold'>Fecha de Emisión:</td>
                        <td>{formatDate(detail.fecha_hora_emision, true)}</td>
                      </tr>
                      <tr className='text-gray-600'>
                        <td className='font-bold'>Fecha de Pago:</td>
                        <td>{formatDate(detail.fecha_hora_pago, true)}</td>
                      </tr>
                      <tr className='text-gray-600'>
                        <td className='font-bold'>Monto Total:</td>
                        <td>S/ {detail.monto_total}</td>
                      </tr>
                      <tr className='text-gray-600'>
                        <td className='font-bold'>Saldo:</td>
                        <td>S/ {detail.saldo}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className='mb-4'>
                  <h3 className='text-lg font-semibold mb-1'>Pago(s):</h3>
                  <table className='w-full text-gray-600 border-separate border-spacing-1'>
                    <thead>
                      <tr className='text-left'>
                        <th>Tipo de pago</th>
                        <th>Monto pagado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.detallesPago.map((detalle, index) => (
                        <tr key={index}>
                          <td>{detalle.tipo_pago}</td>
                          <td>{detalle.monto_pagado}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 className='text-lg font-semibold mb-1'>Servicio(s)</h3>
                  <table className='w-full text-gray-600 border-separate border-spacing-1'>
                    <thead>
                      <tr className='text-left'>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Descuento</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.detallesAtencion.map((detalle, index) => (
                        <tr key={index}>
                          <td>{detalle.nombre_servicio}</td>
                          <td>{detalle.precio_pagado}</td>
                          <td>{detalle.descuento || '---'}</td>
                          <td>
                            <Chip
                              className={`${statusColorMap[detalle.estado]}`}
                            >
                              {listState[detalle.estado]}
                            </Chip>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                type='button'
                color='primary'
                variant='light'
                onPress={onClose}
              >
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
