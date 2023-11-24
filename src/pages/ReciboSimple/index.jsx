import React, { useCallback, useMemo, useState } from 'react'
import { useFetcher } from '../../hook/useFetcher'
import { addObservacion, getPaymentSimple } from '../../services/pay'
import {
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Divider,
  Spinner,
  Input,
  Button,
  Tooltip,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  useDisclosure
} from '@nextui-org/react'
import DateTimeClock from '../../components/DateTimeClock'
import { formatDate } from '../../utils/date'
import { SearchIcon, FileDown, Edit } from 'lucide-react'
import { BASE_URL_WS } from '../../config'
import { toast } from 'sonner'

const columns = [
  { name: 'CLIENTE', uid: 'cliente' },
  { name: 'TOTAL ATENCIONES', uid: 'total_atenciones' },
  { name: 'FECHA EMISIÓN', uid: 'fecha_hora_emision' },
  { name: 'MONTO TOTAL', uid: 'monto_total' },
  { name: 'ACCIONES', uid: 'acciones' }
]

export default function ReciboSimple() {
  const { data, loading, refresh } = useFetcher(getPaymentSimple)
  const [filterValue, setFilterValue] = useState('')
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [editId, setEditId] = useState(null)
  const [input, setInput] = useState('')
  const [submiting, setSubmiting] = useState(false)

  const items = useMemo(() => {
    return data.filter((el) =>
      el.cliente.toLowerCase().includes(filterValue.toLowerCase())
    )
  }, [data, filterValue])

  const renderCell = useCallback((item, cellValue) => {
    if (cellValue === 'fecha_hora_emision') {
      return formatDate(item.fecha_hora_emision, true)
    }
    if (cellValue === 'acciones') {
      return (
        <div>
          <Tooltip content='Editar' color='warning' closeDelay={0}>
            <Button
              isIconOnly
              color='warning'
              variant='light'
              size='sm'
              onClick={() => {
                setEditId(item.idpago)
                onOpen(true)
                setInput(item.observacion)
              }}
            >
              <Edit size={20} />
            </Button>
          </Tooltip>
          <Tooltip content='Ver recibo simple' color='primary' closeDelay={0}>
            <a
              target='_blank'
              href={`${BASE_URL_WS}/api/pagos/boleta/${item.idpago}`}
              rel='noreferrer'
            >
              <Button isIconOnly color='primary' variant='light' size='sm'>
                <FileDown size={20} />
              </Button>
            </a>
          </Tooltip>
        </div>
      )
    }
    return item[cellValue]
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

  const handleAddObsrvacion = async (onClose) => {
    if(input.trim().length === 0){
      toast.error("Ingrese una observación")
      return 
    }

    try {
      setSubmiting(true)
      await addObservacion(input, editId)
      setSubmiting(false)
      toast.success("se edito la observación correctamente")
      setInput("")
      onClose()
      refresh()
    } catch (error) {
      toast.error("Error al editar la observacion")
    }
  }

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4 mb-5'>
        <div className='flex justify-between items-center'>
          <Input
            isClearable
            className='w-full sm:max-w-[44%]'
            placeholder='Buscar por nombre...'
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    )
  })
  return (
    <>
      <CardHeader className='flex justify-between'>
        <h2 className='text-2xl'>Recibo simple</h2>
        <DateTimeClock />
      </CardHeader>
      <Divider />
      <CardBody>
        <Table
          topContent={topContent}
          isStriped
          isHeaderSticky
          removeWrapper
          aria-label='Colección de boletas simples'
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
            emptyContent='No se encontraron empleados'
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
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  Agregar observación
                </ModalHeader>
                <ModalBody>
                  <div>
                    <Input
                      placeholder='agregar observación'
                      color='primary'
                      variant='bordered'
                      value={input}
                      onValueChange={setInput}
                    ></Input>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color='danger' variant='light' onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button color='primary' onPress={()=>handleAddObsrvacion(onClose)} isLoading={submiting}>
                    Guardar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </CardBody>
    </>
  )
}
