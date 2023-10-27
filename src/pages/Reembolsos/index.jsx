import { listPaymentsForRefunds } from '../../services/refund'
import { useFetcher } from '../../hook/useFetcher'
import {
  Button,
  CardBody,
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
import { useCallback, useMemo, useState } from 'react'
import { usePagination } from '../../hook/usePagination'
import { formatDate } from '../../utils/date'
import { Eye, RotateCcw } from 'lucide-react'
import ModalDetails from './components/ModalDetails'
import ModalFormRefund from './components/ModalFormRefund'
import { TIPO_COMPROBANTE } from '../../constants/state'

const columns = [
  { name: 'PACIENTE', uid: 'paciente', sortable: true },
  { name: 'CLIENTE', uid: 'cliente', sortable: true },
  { name: 'COMPROBANTE', uid: 'tipo_comprobante', sortable: true },
  { name: 'EMISIÓN', uid: 'fecha_hora_emision', sortable: true },
  { name: 'MONTO', uid: 'monto_total', sortable: true },
  { name: 'ACCIONES', uid: 'acciones' }
]

export default function Reembolsos() {
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'id',
    direction: 'ascending'
  })

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    isOpen: isOpenForm,
    onOpen: onOpenForm,
    onOpenChange: onOpenChangeForm
  } = useDisclosure()

  const { data, refresh } = useFetcher(listPaymentsForRefunds)
  const [payment, setPayment] = useState({})

  const { items, page, pages, onNextPage, onPreviousPage, setPage } =
    usePagination(data)

  const renderCell = useCallback((detail, columnKey) => {
    const cellValue = detail[columnKey]

    switch (columnKey) {
      case 'tipo_comprobante':
        return TIPO_COMPROBANTE[cellValue]
      case 'fecha_hora_emision':
        return formatDate(cellValue, true)
      case 'acciones':
        return (
          <div className='relative flex items-center gap-x-1'>
            <Tooltip content='Detalles' color='primary' closeDelay={0}>
              <Button
                isIconOnly
                color='primary'
                size='sm'
                variant='light'
                onPress={() => {
                  setPayment(detail)
                  onOpen()
                }}
              >
                <Eye size={20} />
              </Button>
            </Tooltip>
            <Tooltip content='Reembolsar' color='danger' closeDelay={0}>
              <Button
                isIconOnly
                color='danger'
                size='sm'
                variant='light'
                onPress={() => {
                  setPayment(detail)
                  onOpenForm()
                }}
              >
                <RotateCcw size={20} />
              </Button>
            </Tooltip>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

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
  }, [items.length, page, pages])

  return (
    <>
      <CardBody>
        <Table
          aria-label='Example table with custom cells, pagination and sorting'
          isHeaderSticky
          removeWrapper
          isStriped
          bottomContent={bottomContent}
          bottomContentPlacement='outside'
          classNames={{
            wrapper: 'max-h-[600px]'
          }}
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={columns}>
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
          <TableBody
            emptyContent='No se encontraron pagos en este día'
            items={items}
          >
            {(item) => (
              <TableRow key={item.idpago}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>

      <ModalDetails
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        detail={payment}
      />

      <ModalFormRefund
        isOpen={isOpenForm}
        onOpenChange={onOpenChangeForm}
        paymentData={payment}
        refreshTable={refresh}
      />
    </>
  )
}
