/* eslint-disable camelcase */
import { listarTriajeService } from '../../services/triaje'
import {
  Button,
  CardBody,
  Chip,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react'
import { useFetcher } from '../../hook/useFetcher'
import { SearchIcon, Stethoscope } from 'lucide-react'
import { statusColorMap } from '../../constants/state'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TriajePage() {
  const [search, setSearch] = useState('')
  const { data } = useFetcher(listarTriajeService)
  const navigate = useNavigate()

  const filteredData = useMemo(() => {
    if (!search) return data?.data || []
    return data?.data?.filter((triaje) => {
      const fullName = `${triaje.nombres} ${triaje.apellidos}`
      return fullName.toLowerCase().includes(search.toLowerCase())
    })
  }, [search, data])
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
    <CardBody>
      <h1 className='text-2xl mb-5'>Lista Triaje</h1>
      <Input
        isClearable
        className='w-full sm:max-w-[44%]'
        placeholder='Buscar por nombre...'
        startContent={<SearchIcon />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table shadow='none'>
        <TableHeader>
          <TableColumn>N°</TableColumn>
          <TableColumn>Paciente</TableColumn>
          <TableColumn>Cantidad Servicio</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredData.map((triaje, index) => (
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
    </CardBody>
  )
}
