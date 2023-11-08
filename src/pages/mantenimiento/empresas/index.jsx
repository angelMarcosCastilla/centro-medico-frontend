import { useCallback, useMemo, useRef, useState } from 'react'
import {
  Button,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Input,
  Pagination,
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
  HeartPulse,
  PenSquare,
  Plus,
  RotateCcw,
  SearchIcon,
  Trash
} from 'lucide-react'
import {
  disableCompany,
  enableCompany,
  getAllCompany
} from '../../../services/company'
import { toast } from 'sonner'
import { QuestionModal } from '../../../components/QuestionModal'
import { useFetcher } from '../../../hook/useFetcher'
import { formatDate } from '../../../utils/date'
import { usePagination } from '../../../hook/usePagination'
import DateTimeClock from '../../../components/DateTimeClock'
import ModalFormCompany from './components/ModalFormCompany'
import ModalFormAgreement from './components/ModalFormAgreement'
import { removeAgreement } from '../../../services/agreement'

const columns = [
  { name: 'EMPRESA', uid: 'razon_social', sortable: true },
  { name: 'RUC', uid: 'ruc', sortable: true },
  { name: 'DIRECCION', uid: 'direccion', sortable: true },
  { name: 'CONVENIO', uid: 'convenio', sortable: true },
  { name: 'ESTADO', uid: 'estado', sortable: true },
  { name: 'ACCIONES', uid: 'acciones' }
]

const INITIAL_VISIBLE_COLUMNS = [
  'razon_social',
  'ruc',
  'direccion',
  'convenio',
  'estado',
  'acciones'
]

export default function Empresas() {
  const [filterValue, setFilterValue] = useState('')
  const [visibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS))
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'id',
    direction: 'descending'
  })

  const { data, loading, mutate, refresh } = useFetcher(getAllCompany)
  const [disableOrEnableId, setDisableOrEnableId] = useState(null)
  const operation = useRef('')
  const [isOpen, setIsOpen] = useState(null)
  const dataToEdit = useRef()

  const [isOpenAgreement, setIsOpenAgreement] = useState(null)
  const [companyId, setCompanyId] = useState(-1)
  const [deleteAgreementId, setDeleteAgreementId] = useState(null)

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    let filteredEmpresas = [...data]

    if (hasSearchFilter) {
      filteredEmpresas = filteredEmpresas.filter(
        (company) =>
          company.razon_social
            .toLowerCase()
            .includes(filterValue.toLocaleLowerCase()) ||
          company.ruc.toLowerCase().includes(filterValue.toLocaleLowerCase())
      )
    }

    return filteredEmpresas
  }, [data, filterValue])

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

  const deleteAgreement = async () => {
    const result = await removeAgreement(deleteAgreementId)

    if (result.isSuccess) {
      toast.success(result.message)

      mutate((prevCompanies) => {
        const updatedCompanies = prevCompanies.map((company) => {
          if (company.idconvenio === deleteAgreementId) {
            return {
              ...company,
              convenio: null,
              idconvenio: null,
              fecha_inicio: null,
              fecha_fin: null
            }
          }
          return company
        })
        return updatedCompanies
      })
    }
  }

  const toogleState = async () => {
    const result =
      operation.current === 'disable'
        ? await disableCompany(disableOrEnableId)
        : await enableCompany(disableOrEnableId)

    if (result.isSuccess) {
      toast.success(result.message)

      mutate((prevCompanies) => {
        const updatedCompanies = prevCompanies.map((company) => {
          if (company.idempresa === disableOrEnableId) {
            return {
              ...company,
              estado: operation.current === 'disable' ? 0 : 1,
              convenio: null
            }
          }
          return company
        })
        return updatedCompanies
      })
    }
  }

  const renderCell = useCallback((company, columnKey) => {
    const cellValue = company[columnKey]

    const agreementContent = (
      <div>
        <div>
          Inicio:{' '}
          {company.fecha_inicio ? formatDate(company.fecha_inicio) : '---'}
        </div>
        <div>
          Fin: {company.fecha_fin ? formatDate(company.fecha_fin) : '---'}
        </div>
      </div>
    )

    const companyDateInfo = (
      <div>
        <div>Creación: {formatDate(company.create_at, true, false)}</div>
        {company.update_at && (
          <div>
            Últ. actu:{' '}
            {company.update_at
              ? formatDate(company.update_at, true, false)
              : ' ---'}
          </div>
        )}
      </div>
    )

    switch (columnKey) {
      case 'convenio':
        return company.convenio ? (
          <Tooltip
            content={agreementContent}
            color='success'
            className='text-white'
            closeDelay={0}
          >
            <Chip color='success' variant='flat'>
              Activo
            </Chip>
          </Tooltip>
        ) : (
          <Chip color='danger' variant='flat'>
            Inactivo
          </Chip>
        )
      case 'estado':
        return company.estado ? (
          <Tooltip
            content={companyDateInfo}
            color='success'
            className='text-white'
            closeDelay={0}
          >
            <Chip color='success' variant='flat'>
              Activo
            </Chip>
          </Tooltip>
        ) : (
          <Chip color='danger' variant='flat'>
            Inactivo
          </Chip>
        )
      case 'acciones':
        return (
          <div className='relative flex items-center gap-x-1'>
            <Tooltip content='Editar' color='primary' closeDelay={0}>
              {company.estado && (
                <Button
                  isIconOnly
                  color='primary'
                  variant='light'
                  size='sm'
                  onPress={() => {
                    dataToEdit.current = company
                    setIsOpen(true)
                  }}
                >
                  <PenSquare size={20} />
                </Button>
              )}
            </Tooltip>
            {company.estado ? (
              !company.convenio ? (
                <Tooltip
                  content='Agregar convenio'
                  color='primary'
                  closeDelay={0}
                >
                  <Button
                    isIconOnly
                    color='primary'
                    size='sm'
                    variant='light'
                    onPress={() => {
                      setCompanyId(company.idempresa)
                      setIsOpenAgreement(true)
                    }}
                  >
                    <HeartPulse size={20} />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip
                  content='Eliminar convenio'
                  color='danger'
                  closeDelay={0}
                >
                  <Button
                    isIconOnly
                    color='danger'
                    size='sm'
                    variant='light'
                    onPress={() => {
                      setDeleteAgreementId(company.idconvenio)
                    }}
                  >
                    <HeartPulse size={20} />
                  </Button>
                </Tooltip>
              )
            ) : null}

            <Tooltip
              content={company.estado === 1 ? 'Eliminar' : 'Activar'}
              color={company.estado === 1 ? 'danger' : 'success'}
              className='text-white'
              closeDelay={0}
            >
              <Button
                isIconOnly
                size='sm'
                color={company.estado === 1 ? 'danger' : 'success'}
                variant='light'
                onPress={() => {
                  setDisableOrEnableId(company.idempresa)
                  operation.current =
                    company.estado === 1 ? 'disable' : 'enable'
                }}
              >
                {company.estado === 1 ? (
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
            placeholder='Buscar por empresa...'
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
                setIsOpen(true)
              }}
            >
              Agregar nuevo
            </Button>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-default-400 text-small'>
            Total: {data.length} empresas
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
    items.length,
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
      <CardHeader className='flex justify-between'>
        <h2 className='text-2xl'>Mantenimiento Empresas</h2>
        <DateTimeClock />
      </CardHeader>
      <Divider />
      <CardBody>
        <Table
          isHeaderSticky
          isStriped
          removeWrapper
          tabIndex={-1}
          aria-label='Tabla CRUD de empresas y convenios'
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
            emptyContent='No se encontraron empresas'
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

      <ModalFormCompany
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) dataToEdit.current = null
          setIsOpen(open)
        }}
        companyToEdit={dataToEdit.current}
        refresh={refresh}
      />

      <ModalFormAgreement
        isOpen={isOpenAgreement}
        onOpenChange={(open) => setIsOpenAgreement(open)}
        companyId={companyId}
        mutate={mutate}
      />

      <QuestionModal
        title='Eliminar convenio'
        textContent='¿Está seguro que quiere eliminar el convenio de esta empresa? Esta acción es irreversible.'
        isOpen={deleteAgreementId}
        onOpenChange={setDeleteAgreementId}
        confirmConfig={{
          text: 'Eliminar',
          color: 'danger',
          action: deleteAgreement
        }}
      />

      <QuestionModal
        title={
          operation.current === 'disable'
            ? 'Eliminar empresa'
            : 'Activar empresa'
        }
        textContent={`¿Está seguro de ${
          operation.current === 'disable' ? 'eliminar' : 'activar'
        } esta empresa? ${
          operation.current === 'disable'
            ? 'Incluye el convenio si lo tiene.'
            : ''
        }`}
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
