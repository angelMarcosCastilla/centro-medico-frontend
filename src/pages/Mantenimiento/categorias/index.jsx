import { useCallback, useMemo, useRef, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure
} from '@nextui-org/react'
import { getAllAreas, removeArea } from '../../../services/area'
// import { getAllCategories, removeCategoria } from '../../../services/category'
import { toast } from 'sonner'
import { QuestionModal } from '../../../components/QuestionModal'

import { usePagination } from '../../../hook/usePagination'
import ModalCategorie from './ModalCategorie'
import DateTimeClock from '../../../components/DateTimeClock'
import { BadgeX, PenSquare, Plus } from 'lucide-react'
import { useFetcher } from '../../../hook/useFetcher'

const columns = [
  { name: 'AREA', uid: 'nombre_area', sortable: true },
  { name: 'ESTADO', uid: 'estado' },
  { name: 'ACCIONES', uid: 'acciones' }
]
const INITIAL_VISIBLE_COLUMNS = ['nombre_area', 'estado', 'acciones']

export default function categorias() {
  const [filterValue] = useState('')
  const [visibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS))

  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'id',
    direction: 'descending'
  })

  const [editArea, setEditArea] = useState(null)
  const areaID = useRef(null)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    isOpen: isOpenQuestionDelete,
    onOpen: onOpenQuestionDelete,
    onOpenChange: onOpenChangeQuestionDelete
  } = useDisclosure()

  const { data, refresh } = useFetcher(getAllAreas)
  console.log("data", getAllAreas)

  const transformedData = data.map((area) => {
    return {
      idarea: area.idarea,
      nombre_area: area.nombre_area,
      estado: area.estado
    };
  })

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    let filteredAreas = [...transformedData]

    if (hasSearchFilter) {      
      filteredAreas = filteredAreas.filter((area) =>
        area.nombre_area.toLowerCase().includes(filterValue.toLowerCase())
      )
    }

    return filteredAreas
  }, [transformedData, filterValue])

  const {
    items,
    onNextPage,
    onPreviousPage,
    rowsPerPage,
    onRowsPerPageChange,
    page,
    pages,
    setPage
  } = usePagination(filteredItems)

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column]
      const second = b[sortDescriptor.column]
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  const handleEditClick = (area) => {
    setEditArea(area)
    onOpen()
  }

  const confirmDelete = async () => {
    const result = await removeArea(areaID.current)

    if (result.isSuccess) {
      toast.success(result.message)
      refresh()
    } else {
      toast.error(result.message)
    }
  }

  const renderCell = useCallback((area, columnKey) => {
    const cellValue = area[columnKey]

    if (columnKey === 'estado')
      return area.estado ? (
        <Chip color='primary' variant='flat'>
          Activo
        </Chip>
      ) : (
        <Chip color='danger' variant='flat'>
          Inactivo
        </Chip>
      )
    if (columnKey === 'acciones')
      return (
        <div className='relative flex items-center gap-2'>
          <Tooltip content='Editar' color='primary' closeDelay={0}>
            <Button
              isIconOnly
              color='primary'
              size='sm'
              variant='light'
              onClick={() => handleEditClick(area.idarea)}
            >
              <PenSquare size={20} />
            </Button>
          </Tooltip>
          <Tooltip color='danger' content='Eliminar' closeDelay={0}>
            <Button
              isIconOnly
              color='danger'
              size='sm'
              variant='light'
              onClick={() => {
                areaID.current = area.idarea
                onOpenQuestionDelete()
              }}
            >
              <BadgeX size={20} />
            </Button>
          </Tooltip>
        </div>
      )
    return cellValue
  }, [])

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between gap-3 items-end'>
          <div className='flex gap-3'>
            <Button
              color='primary'
              endContent={<Plus size={20} />}
              onPress={() => {
                setEditArea(null)
                onOpen()
              }}
            >
              Nueva Area
            </Button>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-default-400 text-small'>
            Total: {transformedData.length} empresas
          </span>
          <label className='flex items-center text-default-400 text-small'>
            Filas por página:
            <select
              className='bg-transparent outline-none text-default-400 text-small'
              defaultValue={rowsPerPage}
              onChange={onRowsPerPageChange}
            >
              <option value='5'>5</option>
              <option value='10'>10</option>
              <option value='15'>15</option>
            </select>
          </label>
        </div>
      </div>
    )
  }, [filterValue, visibleColumns, onRowsPerPageChange, hasSearchFilter])

  const bottomContent = useMemo(() => {
    return (
      <div className='py-2 px-2 flex justify-between items-center'>
        <Pagination
          isCompact
          showControls
          showShadow
          color='primary'
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className='hidden sm:flex w-[30%] justify-end gap-2'>
          <Button
            isDisabled={pages === 1}
            variant='flat'
            onPress={onPreviousPage}
          >
            Anterior
          </Button>
          <Button isDisabled={pages === 1} variant='flat' onPress={onNextPage}>
            Siguiente
          </Button>
        </div>
      </div>
    )
  }, [items.length, page, pages, hasSearchFilter])

  return (
    <>
      <Card>
        <CardHeader className='flex justify-between'>
          <h2 className='text-2xl'>AREAS - CATEGORIAS</h2>
          <DateTimeClock />
        </CardHeader>
        <Divider />
        <CardBody>
          <div className='mb-3'>
            <h1 className='text-xl'>AREAS</h1>
          </div>
          <Table
            isHeaderSticky
            isStriped
            aria-label='Example table with custom cells, pagination and sorting'
            bottomContent={bottomContent}
            bottomContentPlacement='outside'
            classNames={{
              wrapper: 'max-h-[600px]'
            }}
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement='outside'
            shadow='none'
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === 'actions' ? 'center' : 'start'}
                  allowsSorting={column.sortable}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sortedItems}>
              {(item) => (
                <TableRow key={crypto.randomUUID().toString()}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Divider className='my-6' />
        </CardBody>
      </Card>
      <ModalCategorie
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        operation={editArea ? 'edit' : 'new'}
        serviceToEdit={editArea}
        refreshTable={refresh}
      />

      <QuestionModal
        textContent='¿Seguro de eliminar?'
        isOpen={isOpenQuestionDelete}
        onOpenChange={onOpenChangeQuestionDelete}
        data={areaID}
        onConfirm={confirmDelete}
      />
    </>
  )
}
