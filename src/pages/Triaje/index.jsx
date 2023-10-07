/* eslint-disable camelcase */
import { listarTriajeService } from '../../services/triaje'
import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react'
import { useFetcher } from '../../hook/useFetcher'
import { Stethoscope } from 'lucide-react'
import { statusColorMap } from '../../constants/state'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'

export default function TriajePage() {
  const { data } = useFetcher(listarTriajeService)
  const navigate = useNavigate()

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
      <section className='px-4 py-3 bg-[white] shadow h-full'>
        <Table shadow='none'>
          <TableHeader>
            <TableColumn>N°</TableColumn>
            <TableColumn>Paciente</TableColumn>
            <TableColumn>Cantidad Servicio</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>acciones</TableColumn>
          </TableHeader>
          <TableBody emptyContent={'No Hay pacientes para triaje'}>
            {data.map((triaje, index) => (
              <TableRow key={triaje.idatencion}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {triaje.nombres} {triaje.apellidos}
                </TableCell>
                <TableCell>{triaje.total_servicios}</TableCell>
                <TableCell>
                  <Chip className={statusColorMap.PT}>Pendiente Triaje</Chip>
                </TableCell>
                <TableCell>
                  <Button
                    isIconOnly
                    color='primary'
                    variant='flat'
                    onClick={() => handleNavigate(triaje)}
                  >
                    <Stethoscope />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}
