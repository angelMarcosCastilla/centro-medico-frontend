import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Search, UploadCloud } from 'lucide-react'
import { BASE_URL_WS } from '../../../../config'
import {
  createMedicalPersonnel,
  searchMedicalPersonnelByNumDoc,
  updateMedicalPersonnel
} from '../../../../services/medicalStaff'
import { useFetcher } from '../../../../hook/useFetcher'
import { getAllEspecialidad } from '../../../../services/especialidad'

export default function ModalFormMedicalPersonnel({
  isOpen,
  onOpenChange,
  medicalPersonnelToEdit,
  refresh
}) {
  const { data: specialtiesData } = useFetcher(getAllEspecialidad)

  const [loading, setLoading] = useState(false)

  const [person, setPerson] = useState(null)
  const [specialties, setSpecialties] = useState(new Set([]))
  const [firma, setFirma] = useState(null)

  const handleSearchPerson = async (e) => {
    if (e.key !== 'Enter') return

    const docNumber = e.target.value
    if (!docNumber || docNumber.length < 8) return

    const result = await searchMedicalPersonnelByNumDoc(docNumber)
    if (!result.data) {
      setPerson(null)
      toast.error('No se encontró a la persona')
      return
    }

    if (result.data.idpersonalmedico) {
      setPerson(null)
      toast.error('Esta persona ya esta registrada')
      return
    }

    setPerson(result.data)
  }

  const personName = medicalPersonnelToEdit
    ? medicalPersonnelToEdit.personal
    : person?.nombres
    ? `${person?.nombres} ${person?.apellidos}`
    : ''

  const handleAddOrEditPersonnel = async (e, onClose) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()

    if (!medicalPersonnelToEdit) {
      formData.append('idpersonalmedico', person.idpersona)
      formData.append('idespecialidad', Array.from(specialties))
      formData.append('firmaUrl', firma)

      try {
        const result = await createMedicalPersonnel(formData)
        refresh()
        toast.success(result.message)
        onClose()
      } catch {
        toast.error('Ocurrió un problema al guardar')
      }
    } else {
      const oldEspecialidades = medicalPersonnelToEdit.especialidades.map(
        (el) => String(el.iddetespecialidad)
      )

      const newEspecialidades = Array.from(specialties).map((el) => ({
        idespecialidad: el,
        estado: 1
      }))

      const especialidadesToSend = []

      newEspecialidades.forEach((el) => {
        const isOldEspecialdad = oldEspecialidades.includes(el.idespecialidad)
        if (!isOldEspecialdad) {
          especialidadesToSend.push({
            ...el,
            op: 'new'
          })
        }
      })

      oldEspecialidades.forEach((esp) => {
        const isNewEspecialidad = newEspecialidades
          .map((el) => el.idespecialidad)
          .includes(esp)
        if (!isNewEspecialidad) {
          especialidadesToSend.push({
            idespecialidad: esp,
            estado: 0,
            op: 'edit'
          })
        }
      })

      formData.append('idpersonalmedico', medicalPersonnelToEdit.idpersona)
      formData.append('idespecialidad', JSON.stringify(especialidadesToSend))
      const firmaFile = !firma || typeof firma === 'string' ? null : firma
      formData.append('firmaUrl', firmaFile)

      try {
        const result = await updateMedicalPersonnel(
          medicalPersonnelToEdit.idpersonal,
          formData
        )
        refresh()
        toast.success(result.message)
        onClose()
      } catch {
        toast.error('Ocurrió un problema al guardar')
      }
    }
    setLoading(false)
  }

  const handleOpenChange = (e) => {
    onOpenChange(e)
    setPerson(null)
    setSpecialties(new Set())
    setFirma(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()

    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === 'file') {
          const file = e.dataTransfer.items[i].getAsFile()
          handleFileUpload(file)
        }
      }
    } else {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        handleFileUpload(e.dataTransfer.files[i])
      }
    }
  }

  const handleFileUpload = (file) => {
    if (file.type.includes('image')) {
      setFirma(file)
    } else {
      toast.error('Solo se permiten imágenes')
    }
  }

  useEffect(() => {
    if (medicalPersonnelToEdit) {
      const activeSpecialties = medicalPersonnelToEdit.especialidades
        .filter((el) => el.estado === 1)
        .map((esp) => String(esp.idespecialidad))

      setSpecialties(new Set(activeSpecialties))
      setFirma(medicalPersonnelToEdit.firma_url)
    } else {
      setSpecialties(new Set([]))
      setFirma(null)
    }
  }, [medicalPersonnelToEdit])

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange} size='2xl'>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={(e) => handleAddOrEditPersonnel(e, onClose)}
            autoComplete='off'
          >
            <ModalHeader className='flex flex-col gap-1'>
              <h2 className='text-xl'>
                {!medicalPersonnelToEdit ? 'Nuevo Registro' : 'Editar Registro'}{' '}
              </h2>
            </ModalHeader>
            <ModalBody>
              <div className='flex flex-col gap-y-4'>
                <Input
                  isDisabled={Boolean(medicalPersonnelToEdit)}
                  label='Numero de documento'
                  placeholder='Enter para buscar'
                  defaultValue={
                    medicalPersonnelToEdit ? medicalPersonnelToEdit.nombres : ''
                  }
                  endContent={<Search />}
                  onKeyDown={handleSearchPerson}
                  isRequired
                />
                <Input
                  isReadOnly
                  label='Nombres y apellidos'
                  value={personName}
                  name='personal medico'
                  isRequired
                />
              </div>
              <Divider className='my-2' />
              <div className='flex flex-col gap-y-4'>
                <Select
                  label='Especialidades'
                  selectionMode='multiple'
                  name='Especialidad'
                  placeholder='Selecciona la(s) especialidade(s) del empleado'
                  selectedKeys={specialties}
                  onSelectionChange={setSpecialties}
                  isRequired
                >
                  {specialtiesData.map((el) => (
                    <SelectItem
                      key={el.idespecialidad}
                      value={el.idespecialidad}
                    >
                      {el.nombre_especialidad}
                    </SelectItem>
                  ))}
                </Select>
                <div
                  className='w-full'
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <label
                    className='flex justify-center w-full h-44 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none'
                    htmlFor='file_upload'
                  >
                    {!firma ? (
                      <span className='flex items-center space-x-2'>
                        <UploadCloud size={30} color='gray' />
                        <span className='font-semibold text-gray-500'>
                          Subir Firma(opcional)
                        </span>{' '}
                      </span>
                    ) : (
                      <img
                        className='w-full h-full object-contain'
                        src={
                          typeof firma === 'string'
                            ? `${BASE_URL_WS}/${firma}`
                            : URL.createObjectURL(firma)
                        }
                        alt='Firma'
                      />
                    )}
                    <input
                      accept='.jpg, .jpeg, .png'
                      type='file'
                      id='file_upload'
                      name='file_upload'
                      className='hidden'
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color='danger'
                type='button'
                variant='light'
                onPress={onClose}
              >
                Cancelar
              </Button>
              <Button color='primary' type='submit' isLoading={loading}>
                Guardar
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}
