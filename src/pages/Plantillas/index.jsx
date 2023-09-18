import React, { useState } from 'react'
import { tableBaseTemplate } from '../../constants/template'
import {
  TableBody,
  Table,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input
} from '@nextui-org/react'

export default function Plantillas() {
  const [template, setTemplate] = useState(tableBaseTemplate)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  return (
    <div>
      <Table aria-label='Example table with custom cells' shadow='none'>
        <TableHeader columns={template.columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.title}</TableColumn>
          )}
        </TableHeader>
        <TableBody /* items={users} */>
          {/* {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )} */}
        </TableBody>
      </Table>
      <div className='flex justify-center'>
        <Button onPress={onOpen}>Agregar Fila</Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} size='3xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Nueva Fila
              </ModalHeader>
              <ModalBody>
                <div className='grid grid-cols-2 gap-4'>
                  {tableBaseTemplate.columns.map((column) => (
                    <div key={column.uid}>
                      <Input
                        isRequired={column.isReadOnly}
                        disabled={!column.isReadOnly}
                        type='text'
                        id={column.uid}
                        name={column.uid}
                        label={column.title}
                      />
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button color='primary' onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
