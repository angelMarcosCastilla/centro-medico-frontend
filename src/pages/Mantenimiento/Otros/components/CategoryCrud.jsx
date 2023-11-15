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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFetcher } from '../../../../hook/useFetcher'
import {
  createCategory,
  disableCategory,
  enableCategory,
  getAllCategories,
  updateCategory
} from '../../../../services/category'
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
import { toast } from 'sonner'
import { getAllAreas } from '../../../../services/area'

const columns = [
  { name: 'ÁREA', uid: 'nombre_area', sortable: true },
  { name: 'CATEGORÍA', uid: 'nombre_categoria', sortable: true },
  { name: 'ESTADO', uid: 'estado', sortable: true },
  { name: 'ACCIONES', uid: 'acciones' }
]

const INITIAL_FORM = {
  idcategoria: -1,
  idArea: '',
  nombreCategoria: ''
}

function CategoryForm({ form, setForm, categoryName, refresh }) {
  const [isSaving, setIsSaving] = useState(false)
  const [selectedArea, setSelectedArea] = useState(new Set([]))
  const { data: areasData } = useFetcher(getAllAreas)
  areasData.filter((area) => area.estado === 1).sort((a, b) => a.nombre_area.localeCompare(b.nombre_area))

  const handleAddOrEditCategory = async () => {
    setIsSaving(true)

    try {
      form.idArea = parseInt([...selectedArea][0])

      const result =
        form.idcategoria === -1
          ? await createCategory(form)
          : await updateCategory(form.idcategoria, form)

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
    selectedArea.size === 0 || form.nombreCategoria.trim() === ''

  useEffect(() => {
    if (form.idcategoria !== -1) {
      setSelectedArea(new Set([String(form.idArea)]))
    }
  }, [form.idArea])

  return (
    <div className='flex flex-col p-5 rounded-xl bg-gray-100 mb-5'>
      <p className='text-primary-500 font-semibold text-lg'>
        {form.idcategoria === -1 ? (
          'Crear nueva categoría'
        ) : (
          <>
            Editando categoría de{' '}
            <span className='underline decoration-2'>{categoryName}</span>
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
          {areasData
            
            .map((area) => (
              <SelectItem key={area.idarea}>{area.nombre_area}</SelectItem>
            ))}
        </Select>
        <Input
          color='primary'
          variant='underlined'
          size='sm'
          value={form.nombreCategoria}
          onChange={(e) =>
            setForm({ ...form, nombreCategoria: e.target.value })
          }
          maxLength={50}
          placeholder='Escribe el nombre de la categoría'
        />
        <Button
          color='danger'
          isDisabled={disabledControls}
          startContent={
            form.idcategoria === -1 ? <Eraser size={20} /> : <X size={20} />
          }
          onPress={resetForm}
          className='min-w-[130px]'
        >
          {form.idcategoria === -1 ? 'Limpiar' : 'Cancelar'}
        </Button>
        <Button
          color='primary'
          isDisabled={disabledControls}
          isLoading={isSaving}
          startContent={
            form.idcategoria === -1 ? <Plus size={20} /> : <Save size={20} />
          }
          className='min-w-[130px]'
          onPress={handleAddOrEditCategory}
        >
          {form.idcategoria === -1 ? 'Agregar' : 'Actualizar'}
        </Button>
      </div>
    </div>
  )
}

export default function CategoryCrud() {
  const [form, setForm] = useState(INITIAL_FORM)
  const categoryName = useRef('')

  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'id',
    direction: 'descending'
  })

  const { data, loading, refresh } = useFetcher(getAllCategories)
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
        ? await disableCategory(disableOrEnableId)
        : await enableCategory(disableOrEnableId)

    if (result.isSuccess) {
      toast.success(result.message)
      refresh()
    }
  }

  const renderCell = useCallback((category, columnKey) => {
    const cellValue = category[columnKey]

    switch (columnKey) {
      case 'estado':
        return (
          <Chip
            color={category.estado === 1 ? 'success' : 'danger'}
            variant='flat'
          >
            {category.estado === 1 ? 'Activo' : 'Inactivo'}
          </Chip>
        )
      case 'acciones':
        return (
          <div className='relative flex items-center gap-x-1'>
            {category.estado === 1 && (
              <Tooltip content='Editar' color='primary' closeDelay={0}>
                <Button
                  isIconOnly
                  color='primary'
                  size='sm'
                  variant='light'
                  onPress={() => {
                    setForm({
                      idcategoria: category.idcategoria,
                      idArea: category.idarea,
                      nombreCategoria: category.nombre_categoria
                    })
                    categoryName.current = category.nombre_categoria
                  }}
                >
                  <PenSquare size={20} />
                </Button>
              </Tooltip>
            )}
            <Tooltip
              content={category.estado === 1 ? 'Eliminar' : 'Activar'}
              color={category.estado === 1 ? 'danger' : 'success'}
              className='text-white'
              closeDelay={0}
            >
              <Button
                isIconOnly
                size='sm'
                color={category.estado === 1 ? 'danger' : 'success'}
                variant='light'
                onPress={() => {
                  setDisableOrEnableId(category.idcategoria)
                  operation.current =
                    category.estado === 1 ? 'disable' : 'enable'
                }}
              >
                {category.estado === 1 ? (
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
        <CategoryForm
          form={form}
          setForm={setForm}
          categoryName={categoryName.current}
          refresh={refresh}
        />

        <Table
          isStriped
          isHeaderSticky
          removeWrapper
          tabIndex={-1}
          aria-label='Tabla CRUD de categorías'
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
            emptyContent='No se encontraron categorías'
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
            ? 'Eliminar categoría'
            : 'Activar categoría'
        }
        textContent={`¿Está seguro de ${
          operation.current === 'disable' ? 'eliminar' : 'activar'
        } esta categoría?`}
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
