/* eslint-disable camelcase */
import { listarTriajeService } from '../../services/triaje'
import {
  Chip,
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
import { statusColorMap } from '../../constants/state'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { useEffect } from 'react'
import { socket } from '../../components/Socket'

export default function TriajePage() {
  const { data, refresh } = useFetcher(listarTriajeService)
  const navigate = useNavigate()

  useEffect(() => {
    socket.on('server:newAction', ({ action }) => {
      if (action === 'New Triaje') {
        refresh()
      }
    })

    return () => socket.off('server:newAction')
  }, [])

  const handleNavigate = (triajeData) => {
    const {
      apellidos,
      nombres,
      num_documento,
      total_servicios,
      idpersona,
      idcompliacionmed,
      celular,
      idatencion,
      correo,
      direccion,
      fecha_nacimiento,
      ...rest
    } = triajeData

    const structureData = {
      datosPaciente: {
        idatencion,
        idcompliacionmed,
        apellidos,
        nombres,
        num_documento,
        total_servicios,
        idpersona,
        celular,
        correo,
        direccion,
        fecha_nacimiento
      },
      complicaciones: rest
    }

    navigate(`/triaje/${idatencion}`, {
      state: structureData
    })
  }

  return (
    <div className='px-3 py-4 bg-slate-100 h-screen flex flex-col gap-y-4'>
      <Header title='Triaje' />
      <section className='px-4 py-3 bg-[white] shadow h-full rounded-lg'>
        <Table
          isStriped
          aria-label='Tabla de pacientes derivados a triaje'
          shadow='none'
        >
          <TableHeader>
            <TableColumn>#</TableColumn>
            <TableColumn>DNI</TableColumn>
            <TableColumn>PACIENTE</TableColumn>
            <TableColumn>CANTIDAD SERVICIOS</TableColumn>
            <TableColumn>ESTADO</TableColumn>
            <TableColumn>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody emptyContent='No hay pacientes para triaje en este momento'>
            {Array.isArray(data) &&
              data.map((el, index) => (
                <TableRow key={el.idatencion}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{el.num_documento}</TableCell>
                  <TableCell>{el.apellidos + ', ' + el.nombres}</TableCell>
                  <TableCell>{el.total_servicios}</TableCell>
                  <TableCell>
                    <Chip className={statusColorMap.PT}>Pendiente Triaje</Chip>
                  </TableCell>
                  <TableCell>
                    <div className='relative flex items-center gap-2'>
                      <Tooltip
                        content='Realizar triaje'
                        color='primary'
                        closeDelay={0}
                      >
                        <span
                          className='text-lg text-primary-400 cursor-pointer active:opacity-50'
                          onClick={() => handleNavigate(el)}
                        >
                          <Stethoscope size={20} />
                        </span>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}
