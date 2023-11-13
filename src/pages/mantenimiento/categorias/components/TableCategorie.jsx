import { useCallback, useMemo, useRef, useState } from 'react'
import {
  Button,
  CardBody,
  Chip,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure
} from '@nextui-org/react'
import {
  getAllCategories,
  removeCategoria
} from '../../../../services/category'
import { toast } from 'sonner'
import { QuestionModal } from '../../../../components/QuestionModal'
import { usePagination } from '../../../../hook/usePagination'
import { useFetcher } from '../../../../hook/useFetcher'
import { BadgeX, Edit, Plus } from 'lucide-react'
import ModalCategoria from './ModalCategoria'

const columns = [
  { name: 'AREA', uid: 'nombre_area', sortable: true },
  { name: 'CATEGORIA', uid: 'nombre_categoria', sortable: true },
  { name: 'ESTADO', uid: 'estado' },
  { name: 'acciones', uid: 'acciones' }
]
const INITIAL_VISIBLE_COLUMNS = [
  'nombre_area',
  'nombre_categoria',
  'estado',
  'acciones'
]
export default function TableCategorie() {
  const [filterValue] = useState('')
  const [visibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS))
  const [areasFilter] = useState('all')
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'id',
    direction: 'descending'
  })
  const [editCategorie, setEditCategorie] = useState(null)
  const categorieID = useRef(null)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    isOpen: isOpenQuestionDelete,
    onOpen: onOpenQuestionDelete,
    onOpenChange: onOpenChangeQuestionDelete
  } = useDisclosure()

  const { data : categorias, loading, refresh } = useFetcher(getAllCategories)

  const transformedData = categorias.map((categoria) => {
    return {
      idcategoria: categoria.idcategoria,
      nombre_area: categoria.nombre_area,
      nombre_categoria: categoria.nombre_categoria,
      estado: categoria.estado
    }
  })

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    let filterCategorie = [...transformedData]

    if (hasSearchFilter) {
      filterCategorie = filterCategorie.filter((categorie) =>
        categorie.nombre_categoria
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      )
    }
    return filterCategorie
  }, [transformedData, filterValue])

  const { items, onRowsPerPageChange, page, pages, setPage } =
    usePagination(filteredItems)

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column]
      const second = b[sortDescriptor.column]
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  const handleEditClick = (categorie) => {
    setEditCategorie(categorie)
    onOpen()    
  }

  const confirmDelete = async () => {
    const result = await removeCategoria(categorieID.current)

    if (result.isSuccess) {
      toast.success(result.message)
      refresh()
    } else {
      toast.error(result.message)
    }
  }

  const renderCell = useCallback((categorie, columnKey) => {
    const cellValue = categorie[columnKey]

    if (columnKey === 'estado')
      return categorie.estado ? (
        <Chip color='primary' variant='flat'>
          Activo
        </Chip>
      ) : (
        <Chip color='danger' variant='flat'>
          Inactivo
        </Chip>
      )
    switch (columnKey) {
      case 'acciones':
        return (
          <div className='relative flex items-center gap-x-1'>
            <Tooltip content='Editar' color='primary' closeDelay={0}>
              <Button
                isIconOnly
                color='primary'
                variant='light'
                size='sm'
                onPress={() => handleEditClick(categorie)}
                
              >              
                <Edit size={20} />              
              </Button>
            </Tooltip>
            <Tooltip color='danger' content='Eliminar' closeDelay={0}>
              <Button
                isIconOnly
                color='danger'
                variant='light'
                size='sm'
                onPress={() => {
                  categorieID.current = categorie.idcategoria
                  onOpenQuestionDelete()
                }}
              >
                <BadgeX size={20} />
              </Button>
            </Tooltip>
          </div>
        )
      default:
        return cellValue
    }
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
                setEditCategorie(null)
                onOpen()
              }}
            >
              Nueva Categoria
            </Button>
          </div>
        </div>
      </div>
    )
  }, [
    filterValue,
    areasFilter,
    visibleColumns,
    onRowsPerPageChange,
    transformedData.length,
    hasSearchFilter
  ])

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
      </div>
    )
  }, [items.length, page, pages, hasSearchFilter])

  return (
    <>
      <CardBody>
        <Table
          isHeaderSticky
          isStriped
          removeWrapper
          tabIndex={-1}
          bottomContent={bottomContent}
          bottomContentPlacement='outside'
          classNames={{
            wrapper: 'max-h-[600px]'
          }}
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement='outside'
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn key={column.uid} allowsSorting={column.sortable}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            isLoading={loading}
            loadingContent={<Spinner />}
            emptyContent='No se encontraron servicios'
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
      <ModalCategoria
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        operation={editCategorie ? 'edit' : 'new'}
        serviceToEdit={editCategorie}
        refreshTable={refresh}
      />

      <QuestionModal
        title='Eliminar categoria'
        textContent='¿Está seguro que quiere eliminar la categoria? Esta acción es irreversible.'
        isOpen={isOpenQuestionDelete}
        onOpenChange={onOpenChangeQuestionDelete}
        confirmConfig={{
          text: 'Eliminar',
          color: 'danger',
          action: confirmDelete
        }}
      />
    </>
  )
}
