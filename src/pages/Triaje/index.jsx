/* eslint-disable camelcase */
import { getTriageList } from '../../services/triage'
import {
  Button,
  Card,
  CardBody,
  Chip,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip
} from '@nextui-org/react'
import { useFetcher } from '../../hook/useFetcher'
import { Stethoscope } from 'lucide-react'
import { listState, statusColorMap } from '../../constants/state'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { useCallback, useEffect, useMemo } from 'react'
import { socket } from '../../components/Socket'
import { formatDate } from '../../utils/date'

const columns = [
  { name: '#', uid: 'index' },
  { name: 'NÚMERO DOCUMENTO', uid: 'num_documento' },
  { name: 'PACIENTE', uid: 'paciente' },
  { name: 'CANTIDAD SERVICIOS', uid: 'total_servicios' },
  { name: 'FECHA Y HORA', uid: 'create_at' },
  { name: 'ESTADO', uid: 'estado' },
  { name: 'ACCIONES', uid: 'acciones' }
]

export default function Triaje() {
  const { data, loading, refresh } = useFetcher(getTriageList)
  const navigate = useNavigate()

  const items = useMemo(() => {
    return data.map((el, index) => ({
      ...el,
      index: index + 1
    }))
  }, [data])

  const renderCell = useCallback((element, columnKey) => {
    const cellValue = element[columnKey]

    switch (columnKey) {
      case 'paciente':
        return element.apellidos + ', ' + element.nombres
      case 'create_at':
        return formatDate(cellValue, true)
      case 'estado':
        return (
          <Chip className={`capitalize ${statusColorMap[cellValue]}`}>
            {listState[cellValue]}
          </Chip>
        )
      case 'acciones':
        return (
          <div className='relative flex items-center gap-x-1'>
            <Tooltip content='Realizar triaje' color='primary' closeDelay={0}>
              <Button
                isIconOnly
                color='primary'
                variant='light'
                size='sm'
                onClick={() => handleNavigate(element)}
              >
                <Stethoscope size={20} />
              </Button>
            </Tooltip>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  const handleNavigate = (triajeData) => {
    const {
      index,
      apellidos,
      nombres,
      num_documento,
      total_servicios,
      idpersona,
      idcomplicacionmed,
      celular,
      idatencion,
      correo,
      direccion,
      fecha_nacimiento,
      create_at,
      estado,
      idpago,
      ...rest
    } = triajeData

    const structureData = {
      datosPaciente: {
        idatencion,
        idcomplicacionmed,
        apellidos,
        nombres,
        num_documento,
        total_servicios,
        idpersona,
        celular,
        correo,
        direccion,
        fecha_nacimiento,
        idpago
      },
      complicaciones: rest
    }

    navigate(`/triaje/${idatencion}`, {
      state: structureData
    })
  }

  useEffect(() => {
    socket.on('server:newAction', ({ action }) => {
      if (action === 'New Triaje') {
        refresh()
      }
    })

    return () => socket.off('server:newAction')
  }, [])

  return (
    <div className='bg-slate-100 h-screen flex flex-col p-5 gap-y-4'>
      <Header title='Área de Triaje' />
      <Card className='h-full shadow-small rounded-2xl'>
        <CardBody>
          <Table
            isStriped
            removeWrapper
            tabIndex={-1}
            aria-label='Tabla de pacientes derivados a triaje'
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid}>{column.name}</TableColumn>
              )}
            </TableHeader>
            <TableBody
              isLoading={loading}
              loadingContent={<Spinner />}
              emptyContent='En este momento, no hay pacientes que requieran triaje'
              items={items}
            >
              {(item) => (
                <TableRow key={item.index}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  )
}
