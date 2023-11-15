import { useCallback, useMemo, useRef, useState } from 'react'
import {
  Button,
  CardBody,
  Chip,
  Input,
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
import {
  createArea,
  disableArea,
  enableArea,
  getAllAreas,
  updateArea
} from '../../../../services/area'
import { toast } from 'sonner'
import { QuestionModal } from '../../../../components/QuestionModal'
import { useFetcher } from '../../../../hook/useFetcher'

const columns = [
  { name: 'ÁREA', uid: 'nombre_area', sortable: true },
  { name: 'ESTADO', uid: 'estado', sortable: true },
  { name: 'ACCIONES', uid: 'acciones' }
]

const INITIAL_FORM = {
  idarea: -1,
  nombreArea: ''
}

function AreaForm({ form, setForm, areaName, refresh }) {
  const [isSaving, setIsSaving] = useState(false)

  const handleAddOrEditArea = async () => {
    setIsSaving(true)

    try {
      const result =
        form.idarea === -1
          ? await createArea(form)
          : await updateArea(form.idarea, form)

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

  const resetForm = () => setForm(INITIAL_FORM)

  return (
    <div className='flex flex-col p-5 rounded-xl bg-gray-100 mb-5'>
      <p className='text-primary-500 font-semibold text-lg'>
        {form.idarea === -1 ? (
          'Crear nueva área'
        ) : (
          <>
            Editando área de{' '}
            <span className='underline decoration-2'>{areaName}</span>
          </>
        )}
      </p>
      <div className='flex flex-row w-full items-end gap-3'>
        <Input
          color='primary'
          variant='underlined'
          size='sm'
          value={form.nombreArea}
          onChange={(e) => setForm({ ...form, nombreArea: e.target.value })}
          maxLength={50}
          placeholder='Escribe el nombre del área'
        />
        <Button
          color='danger'
          isDisabled={form.nombreArea.trim() === ''}
          startContent={
            form.idarea === -1 ? <Eraser size={20} /> : <X size={20} />
          }
          onPress={resetForm}
          className='min-w-[130px]'
        >
          {form.idarea === -1 ? 'Limpiar' : 'Cancelar'}
        </Button>
        <Button
          color='primary'
          isDisabled={form.nombreArea.trim() === ''}
          isLoading={isSaving}
          startContent={
            form.idarea === -1 ? <Plus size={20} /> : <Save size={20} />
          }
          className='min-w-[130px]'
          onPress={handleAddOrEditArea}
        >
          {form.idarea === -1 ? 'Agregar' : 'Actualizar'}
        </Button>
      </div>
    </div>
  )
}

export default function AreaCrud() {
  const [form, setForm] = useState(INITIAL_FORM)
  const areaName = useRef('')

  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'id',
    direction: 'descending'
  })

  const { data, loading, refresh } = useFetcher(getAllAreas)
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
        ? await disableArea(disableOrEnableId)
        : await enableArea(disableOrEnableId)

    if (result.isSuccess) {
      toast.success(result.message)
      refresh()
    }
  }

  const renderCell = useCallback((area, columnKey) => {
    const cellValue = area[columnKey]

    switch (columnKey) {
      case 'estado':
        return (
          <Chip color={area.estado === 1 ? 'success' : 'danger'} variant='flat'>
            {area.estado === 1 ? 'Activo' : 'Inactivo'}
          </Chip>
        )
      case 'acciones':
        return (
          <div className='relative flex items-center gap-x-1'>
            {area.estado === 1 && (
              <Tooltip content='Editar' color='primary' closeDelay={0}>
                <Button
                  isIconOnly
                  color='primary'
                  size='sm'
                  variant='light'
                  onPress={() => {
                    setForm({
                      idarea: area.idarea,
                      nombreArea: area.nombre_area
                    })
                    areaName.current = area.nombre_area
                  }}
                >
                  <PenSquare size={20} />
                </Button>
              </Tooltip>
            )}
            <Tooltip
              content={area.estado === 1 ? 'Eliminar' : 'Activar'}
              color={area.estado === 1 ? 'danger' : 'success'}
              className='text-white'
              closeDelay={0}
            >
              <Button
                isIconOnly
                size='sm'
                color={area.estado === 1 ? 'danger' : 'success'}
                variant='light'
                onPress={() => {
                  setDisableOrEnableId(area.idarea)
                  operation.current = area.estado === 1 ? 'disable' : 'enable'
                }}
              >
                {area.estado === 1 ? (
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
        <AreaForm
          form={form}
          setForm={setForm}
          areaName={areaName.current}
          refresh={refresh}
        />

        <Table
          isStriped
          isHeaderSticky
          removeWrapper
          tabIndex={-1}
          aria-label='Tabla CRUD de áreas'
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
            emptyContent='No se encontraron áreas'
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
          operation.current === 'disable' ? 'Eliminar área' : 'Activar área'
        }
        textContent={`¿Está seguro de ${
          operation.current === 'disable' ? 'eliminar' : 'activar'
        } esta área?`}
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
