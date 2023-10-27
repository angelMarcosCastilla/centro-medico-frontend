import { useCallback, useMemo, useRef, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  Input,
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
import { BadgeX, PenSquare, Plus, SearchIcon } from 'lucide-react'

import { getAllCompany, removeCompany } from '../../../services/company'
import { toast } from 'sonner'
import { QuestionModal } from '../../../components/QuestionModal'
import { useFetcher } from '../../../hook/useFetcher'
import { usePagination } from '../../../hook/usePagination'
import ModalCompany from './ModalCompany'

const columns = [
  { name: 'EMPRESA', uid: 'razon_social', sortable: true },
  { name: 'RUC', uid: 'ruc', sortable: true },
  { name: 'DIRECCION', uid: 'direccion', sortable: true },
  { name: 'ESTADO', uid: 'estado' },
  { name: 'ACCIONES', uid: 'acciones' }
]

const INITIAL_VISIBLE_COLUMNS = [
  'razon_social',
  'ruc',
  'direccion',
  'estado',
  'acciones'
]

export default function Empresa() {
  const [filterValue, setFilterValue] = useState('')
  const [visibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS))

  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'idempresa',
    direction: 'descending'
  })

  const [editCompany, setEditCompany] = useState(null)
  const companyID = useRef(null)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    isOpen: isOpenQuestionDelete,
    onOpen: onOpenQuestionDelete,
    onOpenChange: onOpenChangeQuestionDelete
  } = useDisclosure()

  const { data = [], refresh } = useFetcher(getAllCompany)

  const transformedData = data.map((empresa) => {
    return {
      idempresa: empresa.idempresa,
      razon_social: empresa.razon_social,
      ruc: empresa.ruc,
      estado: empresa.estado === 1 ? 'Activo' : 'Inactico',
      direccion: empresa.direccion || '',
      create_at: empresa.create_at,
      update_at: empresa.update_at || ''
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
    let filteredEmpresas = [...transformedData]

    if (hasSearchFilter) {
      // Filtrar por término de búsqueda en el campo "razon_social"
      filteredEmpresas = filteredEmpresas.filter((company) =>
        company.razon_social.toLowerCase().includes(filterValue.toLowerCase())
      )
    }

    return filteredEmpresas
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

  const handleEditClick = (company) => {
    setEditCompany(company)
    onOpen()
  }

  const confirmDelete = async () => {
    const result = await removeCompany(companyID.current)

    if (result.isSuccess) {
      toast.success(result.message)
      refresh()
    } else {
      toast.error(result.message)
    }
  }

  const renderCell = useCallback((empresa, columnKey) => {
    const cellValue = empresa[columnKey]
    switch (columnKey) {
      case 'acciones':
        return (
          <div className='relative flex items-center gap-2'>
            <Tooltip content='Editar' color='primary' closeDelay={0}>
              <Button
                isIconOnly
                color='primary'
                size='sm'
                variant='light'
                onClick={() => handleEditClick(empresa.idempresa)}
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
                  companyID.current = empresa.idempresa
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
  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value)
    } else {
      setFilterValue('')
    }
  }, [])

  const onClear = useCallback(() => {
    setFilterValue('')
  }, [])

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between gap-3 items-end'>
          <Input
            isClearable
            className='w-full sm:max-w-[44%]'
            placeholder='Buscar por razón social...'
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className='flex gap-3'>
            <Button
              color='primary'
              endContent={<Plus size={20} />}
              onPress={() => {
                setEditCompany(null)
                onOpen()
              }}
            >
              Nueva empresa
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
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    transformedData.length,
    onSearchChange,
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
      <Card shadow='none'>
        <CardBody>
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
        </CardBody>
      </Card>
      <ModalCompany
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        operation={editCompany ? 'edit' : 'new'}
        serviceToEdit={editCompany}
        refreshTable={refresh}
      />

      <QuestionModal
        textContent='¿Seguro de eliminar?'
        isOpen={isOpenQuestionDelete}
        onOpenChange={onOpenChangeQuestionDelete}
        data={companyID}
        onConfirm={confirmDelete}
      />
    </>
  )
}