import React, { useEffect, useState } from 'react'
import { listarTriajeService } from '../../services/triaje'
import {
  Button,
  CardBody,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react'

export default function TriajePage() {
  const [triajeList, setTriajeList] = useState([])

  useEffect(() => {
    listarTriajeService().then((response) => {
      setTriajeList(response.data)
    })
  }, [])

  return (
    <CardBody>
      <Table shadow='none'>
        <TableHeader>
          <TableColumn>hola</TableColumn>
          <TableColumn>Paciente</TableColumn>
          <TableColumn>Cantidad Servicio</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {triajeList.map((triaje, index) => (
            <TableRow key={triaje.idatencion}>
              <TableCell>{index}</TableCell>
              <TableCell>{triaje.nombres} {triaje.apellidos}</TableCell>
              <TableCell>{triaje.total_servicios}</TableCell>
              <TableCell>Pendiente triaje</TableCell>
              <TableCell><Button>sd</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardBody>
  )
}
