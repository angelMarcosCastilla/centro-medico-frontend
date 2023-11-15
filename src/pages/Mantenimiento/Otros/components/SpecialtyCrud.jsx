import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFetcher } from '../../../../hook/useFetcher'
import { getAllAreas } from '../../../../services/area'
import {
  createSpecialty,
  disableSpecialty,
  enableSpecialty,
  getAllSpecialties,
  updateSpecialty
} from '../../../../services/specialty'
import { toast } from 'sonner'
import {
  Button,
  CardBody,
  Chip,
  Input,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip
} from '@nextui-org/react'
import {
  Eraser,
  PenSquare,
  Plus,
  RotateCcw,
  Save,
  Trash,
  X
} from 'lucide-react'
import { QuestionModal } from '../../../../components/QuestionModal'

const columns = [
  { name: 'ÁREA', uid: 'nombre_area', sortable: true },
  { name: 'ESPECIALIDAD', uid: 'nombre_especialidad', sortable: true },
  { name: 'ESTADO', uid: 'estado', sortable: true },
  { name: 'ACCIONES', uid: 'acciones' }
]

const INITIAL_FORM = {
  idespecialidad: -1,
  idArea: '',
  nombreEspecialidad: ''
}

function SpecialtyForm({ form, setForm, specialtyName, refresh }) {
  const [isSaving, setIsSaving] = useState(false)
  const [selectedArea, setSelectedArea] = useState(new Set([]))
  const { data: areasData } = useFetcher(getAllAreas)

  const itemsArea = useMemo(() => {
    return areasData
      .filter((area) => area.estado === 1)
      .sort((a, b) => a.nombre_area.localeCompare(b.nombre_area))
  }, [areasData])

  const handleAddOrEditSpecialty = async () => {
    setIsSaving(true)

    try {
      form.idArea = parseInt([...selectedArea][0])

      const result =
        form.idespecialidad === -1
          ? await createSpecialty(form)
          : await updateSpecialty(form.idespecialidad, form)

      if (result.isSuccess) {
        toast.success(result.message)
        refresh()
        resetForm()
      }
    } catch (err) {
      toast.error('Ocurrió un problema al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  const resetForm = () => {
    setSelectedArea(new Set([]))
    setForm(INITIAL_FORM)
  }

  const disabledControls =
    selectedArea.size === 0 || form.nombreEspecialidad.trim() === ''

  useEffect(() => {
    if (form.idespecialidad !== -1) {
      setSelectedArea(new Set([String(form.idArea)]))
    }
  }, [form.idArea])

  return (
    <div className='flex flex-col p-5 rounded-xl bg-gray-100 mb-5'>
      <p className='text-primary-500 font-semibold text-lg'>
        {form.idespecialidad === -1 ? (
          'Crear nueva especialidad'
        ) : (
          <>
            Editando especialidad de{' '}
            <span className='underline decoration-2'>{specialtyName}</span>
          </>
        )}
      </p>
      <div className='flex flex-row w-full items-end gap-3'>
        <Select
          label='Área'
          color='primary'
          placeholder='Seleccione un área'
          variant='underlined'
          size='sm'
          className='w-[330px]'
          selectedKeys={selectedArea}
          onSelectionChange={setSelectedArea}
        >
          {itemsArea.map((area) => (
            <SelectItem key={area.idarea}>{area.nombre_area}</SelectItem>
          ))}
        </Select>
        <Input
          color='primary'
          variant='underlined'
          size='sm'
          value={form.nombreEspecialidad}
          onChange={(e) =>
            setForm({ ...form, nombreEspecialidad: e.target.value })
          }
          maxLength={50}
          placeholder='Escribe el nombre de la especialidad'
        />
        <Button
          color='danger'
          isDisabled={disabledControls}
          startContent={
            form.idespecialidad === -1 ? <Eraser size={20} /> : <X size={20} />
          }
          onPress={resetForm}
          className='min-w-[130px]'
        >
          {form.idespecialidad === -1 ? 'Limpiar' : 'Cancelar'}
        </Button>
        <Button
          color='primary'
          isDisabled={disabledControls}
          isLoading={isSaving}
          startContent={
            form.idespecialidad === -1 ? <Plus size={20} /> : <Save size={20} />
          }
          className='min-w-[130px]'
          onPress={handleAddOrEditSpecialty}
        >
          {form.idespecialidad === -1 ? 'Agregar' : 'Actualizar'}
        </Button>
      </div>
    </div>
  )
}

export default function SpecialtyCrud() {
  const [form, setForm] = useState(INITIAL_FORM)
  const specialtyName = useRef('')

  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'id',
    direction: 'descending'
  })

  const { data, loading, refresh } = useFetcher(getAllSpecialties)
  const [disableOrEnableId, setDisableOrEnableId] = useState(null)
  const operation = useRef('')

  const sortedItems = useMemo(() => {
    return [...data].sort((a, b) => {
      const first = a[sortDescriptor.column]
      const second = b[sortDescriptor.column]
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, data])

  const toogleState = async () => {
    const result =
      operation.current === 'disable'
        ? await disableSpecialty(disableOrEnableId)
        : await enableSpecialty(disableOrEnableId)

    if (result.isSuccess) {
      toast.success(result.message)
      refresh()
    }
  }

  const renderCell = useCallback((specialty, columnKey) => {
    const cellValue = specialty[columnKey]

    switch (columnKey) {
      case 'estado':
        return (
          <Chip
            color={specialty.estado === 1 ? 'success' : 'danger'}
            variant='flat'
          >
            {specialty.estado === 1 ? 'Activo' : 'Inactivo'}
          </Chip>
        )
      case 'acciones':
        return (
          <div className='relative flex items-center gap-x-1'>
            {specialty.estado === 1 && (
              <Tooltip content='Editar' color='primary' closeDelay={0}>
                <Button
                  isIconOnly
                  color='primary'
                  size='sm'
                  variant='light'
                  onPress={() => {
                    setForm({
                      idespecialidad: specialty.idespecialidad,
                      idArea: specialty.idarea,
                      nombreEspecialidad: specialty.nombre_especialidad
                    })
                    specialtyName.current = specialty.nombre_especialidad
                  }}
                >
                  <PenSquare size={20} />
                </Button>
              </Tooltip>
            )}
            <Tooltip
              content={specialty.estado === 1 ? 'Eliminar' : 'Activar'}
              color={specialty.estado === 1 ? 'danger' : 'success'}
              className='text-white'
              closeDelay={0}
            >
              <Button
                isIconOnly
                size='sm'
                color={specialty.estado === 1 ? 'danger' : 'success'}
                variant='light'
                onPress={() => {
                  setDisableOrEnableId(specialty.idespecialidad)
                  operation.current =
                    specialty.estado === 1 ? 'disable' : 'enable'
                }}
              >
                {specialty.estado === 1 ? (
                  <Trash size={20} />
                ) : (
                  <RotateCcw size={20} />
                )}
              </Button>
            </Tooltip>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  return (
    <>
      <CardBody className='pt-0'>
        <SpecialtyForm
          form={form}
          setForm={setForm}
          specialtyName={specialtyName.current}
          refresh={refresh}
        />

        <Table
          isStriped
          isHeaderSticky
          removeWrapper
          tabIndex={-1}
          aria-label='Tabla CRUD de especialidades'
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} allowsSorting={column.sortable}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            isLoading={loading}
            loadingContent={<Spinner />}
            emptyContent='No se encontraron especialidades'
            items={sortedItems}
          >
            {(item) => (
              <TableRow key={crypto.randomUUID().toString()}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>

      <QuestionModal
        title={
          operation.current === 'disable'
            ? 'Eliminar especialidad'
            : 'Activar especialidad'
        }
        textContent={`¿Está seguro de ${
          operation.current === 'disable' ? 'eliminar' : 'activar'
        } esta especialidad?`}
        isOpen={disableOrEnableId}
        onOpenChange={setDisableOrEnableId}
        confirmConfig={{
          text: operation.current === 'disable' ? 'Eliminar' : 'Activar',
          color: operation.current === 'disable' ? 'danger' : 'success',
          action: toogleState
        }}
      />
    </>
  )
}
