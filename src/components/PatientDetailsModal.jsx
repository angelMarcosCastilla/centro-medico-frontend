import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@nextui-org/react'
import { calculatePersonAge, formatDate } from '../utils/date'
import { Check, X } from 'lucide-react'

const colors = {
  primary: '#006FEE',
  danger: '#F31260'
}

export default function PatientDetailsModal({ isOpen, onOpenChange, detail }) {
  const hasTriage = detail.triaje ? Object.keys(detail.triaje).length > 0 : null

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
              <h2 className='text-xl'>
                Detalles del {hasTriage ? 'triaje' : 'paciente'}
              </h2>
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
                        <td className='font-bold' colSpan={3}>
                          Apellidos y nombres:
                        </td>
                        <td colSpan={3}>{detail.paciente}</td>
                      </tr>
                      <tr className='text-gray-600'>
                        <td className='font-bold' colSpan={3}>
                          Tipo documento:
                        </td>
                        <td colSpan={3}>
                          {detail.tipo_documento === 'D'
                            ? 'DNI'
                            : 'Carnet de extranjería'}
                        </td>
                      </tr>
                      <tr className='text-gray-600'>
                        <td className='font-bold' colSpan={3}>
                          N° documento
                        </td>
                        <td>{detail.num_documento}</td>
                      </tr>
                      <tr className='text-gray-600'>
                        <td className='font-bold' colSpan={3}>
                          Fecha de nacimiento:
                        </td>
                        <td colSpan={3}>
                          {formatDate(detail.fecha_nacimiento)}
                        </td>
                      </tr>
                      <tr className='text-gray-600'>
                        <td className='font-bold' colSpan={3}>
                          Teléfono:
                        </td>
                        <td colSpan={3}>{detail.celular || '---'}</td>
                      </tr>
                      <tr className='text-gray-600'>
                        <td className='font-bold' colSpan={3}>
                          Dirección:
                        </td>
                        <td colSpan={3}>{detail.direccion || '---'}</td>
                      </tr>
                      <tr className='text-gray-600'>
                        <td className='font-bold'>Edad:</td>
                        <td>
                          {calculatePersonAge(detail.fecha_nacimiento)} años
                        </td>
                        <td className='font-bold'>Talla: </td>
                        <td>
                          {detail.triaje.talla
                            ? `${Math.floor(detail.triaje.talla)} cm`
                            : '---'}{' '}
                        </td>
                        <td className='font-bold'>Peso: </td>
                        <td>
                          {detail.triaje.peso
                            ? `${Math.floor(detail.triaje.peso)} kg`
                            : '---'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className='mb-4'>
                  <h3 className='text-lg font-semibold mb-1'>
                    Factores de Riesgo o Comorbilidad
                  </h3>
                  <table className='w-full'>
                    <tbody>
                      <tr className='text-gray-600'>
                        <td className='font-bold'>Diabetes:</td>
                        <td className='text-xl'>
                          {detail.complicacionesMedicas.diabetes ? (
                            <Check size={25} color={colors.primary} />
                          ) : (
                            <X size={25} color={colors.danger} />
                          )}
                        </td>
                        <td className='font-bold'>Inmunodeficiencia VIH:</td>
                        <td className='text-xl'>
                          {detail.complicacionesMedicas.vih ? (
                            <Check size={25} color={colors.primary} />
                          ) : (
                            <X size={25} color={colors.danger} />
                          )}
                        </td>
                      </tr>
                      <tr className='text-gray-600'>
                        <td className='font-bold'>Hipertensión arterial:</td>
                        <td className='text-xl'>
                          {detail.complicacionesMedicas
                            .hipertension_arterial ? (
                            <Check size={25} color={colors.primary} />
                          ) : (
                            <X size={25} color={colors.danger} />
                          )}
                        </td>
                        {hasTriage && (
                          <>
                            <td className='font-bold'>Daño hepático:</td>
                            <td className='text-xl'>
                              {detail.triaje.danio_hepatico ? (
                                <Check size={25} color={colors.primary} />
                              ) : (
                                <X size={25} color={colors.danger} />
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                      <tr className='text-gray-600'>
                        <td className='font-bold'>
                          Alergia (cerdo, marisco, etc):
                        </td>
                        <td className='text-xl'>
                          {detail.complicacionesMedicas.alergia ? (
                            <Check size={25} color={colors.primary} />
                          ) : (
                            <X size={25} color={colors.danger} />
                          )}
                        </td>
                        {hasTriage && (
                          <>
                            <td className='font-bold'>Embarazo:</td>
                            <td className='text-xl'>
                              {detail.triaje.embarazo ? (
                                <Check size={25} color={colors.primary} />
                              ) : (
                                <X size={25} color={colors.danger} />
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                      <tr className='text-gray-600'>
                        <td className='font-bold'>Enfermedad renal:</td>
                        <td className='text-xl'>
                          {detail.complicacionesMedicas.enfermedad_renal ? (
                            <Check size={25} color={colors.primary} />
                          ) : (
                            <X size={25} color={colors.danger} />
                          )}
                        </td>
                      </tr>
                      {hasTriage && (
                        <tr className='text-gray-600'>
                          <td className='font-bold' colSpan={2}>
                            Otros:
                          </td>
                          <td colSpan={2}>{detail.triaje.otros || '---'}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {hasTriage && (
                  <div>
                    <h3 className='text-lg font-semibold mb-1'>
                      Control de Funciones Vitales
                    </h3>
                    <table className='w-full'>
                      <tbody>
                        <tr className='text-gray-600'>
                          <td className='font-bold'>Temperatura:</td>
                          <td>{detail.triaje.temperatura} °C</td>
                        </tr>
                        <tr className='text-gray-600'>
                          <td className='font-bold'>Presión Arterial:</td>
                          <td>{detail.triaje.presion_arterial} mm Hg</td>
                        </tr>
                        <tr className='text-gray-600'>
                          <td className='font-bold'>Frecuencia Cardiaca:</td>
                          <td>{detail.triaje.frecuencia_cardiaca} lpm</td>
                        </tr>
                        <tr className='text-gray-600'>
                          <td className='font-bold'>
                            Frecuencia Respiratoria:
                          </td>
                          <td>{detail.triaje.frecuencia_respiratoria} rpm</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
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
